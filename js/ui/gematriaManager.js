// ============================================================
// Gematria Manager — UI layer for gematria features
// ============================================================

class GematriaManager {

  constructor() {
    this.engine = new GematriaEngine();
    this.currentResults = null;
    this.currentSystem = null;
  }

  // ----------------------------------------------------------
  // BUILD HTML FOR THE GEMATRIA CONTROL PANEL SECTION
  // Called by layoutManager to inject into the control panel
  // ----------------------------------------------------------

  buildGematriaPanel() {
    return `
      <div class="control-section" id="gematria-section">
        <h3>🔢 Gematria</h3>

        <!-- System selector -->
        <div class="control-group">
          <label>System</label>
          <select id="gematria-system">
            <optgroup label="Hebrew">
              <option value="hebrew">Hebrew — Mispar Hechrachi</option>
              <option value="hebrew_gadol">Hebrew — Mispar Gadol (finals elevated)</option>
              <option value="hebrew_katan">Hebrew — Mispar Katan (reduced)</option>
            </optgroup>
            <optgroup label="Greek">
              <option value="greek">Greek — Isopsephy</option>
            </optgroup>
            <optgroup label="Latin">
              <option value="latin_ordinal" selected>Latin — Ordinal (A=1)</option>
              <option value="latin">Latin — Literae Notae (Roman numerals)</option>
            </optgroup>
            <optgroup label="English">
              <option value="english">English — Standard (A=1)</option>
              <option value="english_reduction">English — Reduction (1–9)</option>
              <option value="english_reverse">English — Reverse (Z=1)</option>
            </optgroup>
            <optgroup label="Finnish">
              <option value="finnish">Finnish — Standard (A=1, Ö=29)</option>
              <option value="finnish_reduction">Finnish — Reduction (1–9)</option>
            </optgroup>
          </select>
          <small class="help-text" id="gematria-system-desc"></small>
        </div>

        <!-- Term calculator -->
        <div class="control-group">
          <label>Calculate value</label>
          <input type="text" id="gematria-term" placeholder="Enter word or phrase…">
          <div id="gematria-term-result" class="gematria-value-display" style="display:none;">
            <span class="gematria-value-number" id="gematria-term-value">0</span>
            <span class="gematria-value-label">gematria value</span>
            <div id="gematria-breakdown" class="gematria-breakdown"></div>
            <div id="gematria-digital-root" class="gematria-digital-root"></div>
          </div>
        </div>

        <!-- Search by value -->
        <div class="control-group">
          <label>Search by value</label>
          <div class="gematria-search-row">
            <input type="number" id="gematria-target-value" placeholder="e.g. 26" min="1">
            <button id="gematria-search-btn" class="primary-btn gematria-search-btn">🔢 Search</button>
          </div>
          <small class="help-text">Finds words in the loaded text whose gematria equals this value</small>
        </div>

        <!-- Search mode -->
        <div class="control-group">
          <label>Search mode</label>
          <div class="gematria-mode-row">
            <label class="radio-label">
              <input type="radio" name="gematria-mode" value="words" checked> Words
            </label>
            <label class="radio-label">
              <input type="radio" name="gematria-mode" value="sequences"> Letter sequences
            </label>
          </div>
          <div id="gematria-sequence-options" style="display:none;">
            <div class="skip-inputs" style="margin-top:0.5rem;">
              <label style="font-size:0.85rem;">Min letters:</label>
              <input type="number" id="gematria-min-len" value="2" min="1" max="20" style="width:60px;">
              <label style="font-size:0.85rem;">Max:</label>
              <input type="number" id="gematria-max-len" value="8" min="1" max="30" style="width:60px;">
            </div>
          </div>
        </div>

        <!-- Multi-language comparison (for side-by-side) -->
        <div class="control-group">
          <label class="checkbox-label">
            <input type="checkbox" id="gematria-multilang">
            Compare across all languages
          </label>
          <small class="help-text">When enabled, search results show matches in all loaded languages</small>
        </div>

      </div>
    `;
  }

  // ----------------------------------------------------------
  // BUILD GEMATRIA RESULTS PANEL (injected into results area)
  // ----------------------------------------------------------

  buildGematriaResultsSection() {
    return `
      <div id="gematria-results-section" style="display:none;">
        <div class="gematria-results-header">
          <span id="gematria-result-label">🔢 Gematria Results</span>
          <span id="gematria-result-count" class="result-count-badge"></span>
        </div>
        <div id="gematria-results-list" class="gematria-results-list"></div>
      </div>
    `;
  }

  // ----------------------------------------------------------
  // ATTACH EVENTS — called after DOM is ready
  // ----------------------------------------------------------

  attachEvents() {
    // System selector — update description + recalculate live term
    const systemSel = document.getElementById('gematria-system');
    if (systemSel) {
      systemSel.addEventListener('change', () => {
        this._updateSystemDescription();
        this._recalculateTerm();
      });
      this._updateSystemDescription();
    }

    // Term input — live calculation
    const termInput = document.getElementById('gematria-term');
    if (termInput) {
      termInput.addEventListener('input', () => this._recalculateTerm());
    }

    // "Use term value" convenience: clicking the value badge fills target input
    document.getElementById('gematria-term-value')?.addEventListener('click', () => {
      const val = document.getElementById('gematria-term-value').textContent;
      document.getElementById('gematria-target-value').value = val;
    });

    // Search mode radio
    document.querySelectorAll('input[name="gematria-mode"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const seqOpts = document.getElementById('gematria-sequence-options');
        if (seqOpts) seqOpts.style.display = e.target.value === 'sequences' ? 'block' : 'none';
      });
    });

    // Search button
    document.getElementById('gematria-search-btn')?.addEventListener('click', () => {
      this.performGematriaSearch();
    });

    // Also allow Enter in the target value field
    document.getElementById('gematria-target-value')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.performGematriaSearch();
    });

    // Sync system with primary language selector
    document.getElementById('language-selector')?.addEventListener('change', (e) => {
      this._syncSystemToLanguage(e.target.value);
    });
  }

  // ----------------------------------------------------------
  // LIVE TERM CALCULATION
  // ----------------------------------------------------------

  _recalculateTerm() {
    const term = (document.getElementById('gematria-term')?.value || '').trim();
    const system = document.getElementById('gematria-system')?.value;
    const resultDiv = document.getElementById('gematria-term-result');
    const valueEl = document.getElementById('gematria-term-value');
    const breakdownEl = document.getElementById('gematria-breakdown');
    const rootEl = document.getElementById('gematria-digital-root');

    if (!term || !system) {
      if (resultDiv) resultDiv.style.display = 'none';
      return;
    }

    try {
      const value = this.engine.calculate(term, system);
      const breakdown = this.engine.breakdown(term, system);
      const root = this.engine.digitalRoot(value);

      if (resultDiv) resultDiv.style.display = 'block';
      if (valueEl) valueEl.textContent = value;

      if (breakdownEl) {
        if (breakdown.length <= 20) {
          breakdownEl.innerHTML = breakdown
            .filter(b => b.value > 0)
            .map(b => `<span class="gem-letter-chip" title="${b.letter}=${b.value}">${b.letter}<sub>${b.value}</sub></span>`)
            .join(' + ');
        } else {
          breakdownEl.innerHTML = `<span class="help-text">${breakdown.length} letters</span>`;
        }
      }

      if (rootEl) rootEl.textContent = root !== value ? `Digital root: ${root}` : '';

    } catch (err) {
      if (resultDiv) resultDiv.style.display = 'none';
    }
  }

  _updateSystemDescription() {
    const system = document.getElementById('gematria-system')?.value;
    const descEl = document.getElementById('gematria-system-desc');
    if (!system || !descEl) return;
    const systems = this.engine.getAllSystems();
    const found = systems.find(s => s.key === system);
    descEl.textContent = found ? found.description : '';
  }

  _syncSystemToLanguage(lang) {
    const sel = document.getElementById('gematria-system');
    if (!sel) return;
    const def = this.engine.defaultSystemForLanguage(lang);
    if (sel.querySelector(`option[value="${def}"]`)) {
      sel.value = def;
      this._updateSystemDescription();
      this._recalculateTerm();
    }
  }

  // ----------------------------------------------------------
  // SEARCH
  // ----------------------------------------------------------

  async performGematriaSearch() {
    const targetRaw = document.getElementById('gematria-target-value')?.value;
    const target = parseInt(targetRaw);
    if (isNaN(target) || target < 1) {
      alert('Please enter a valid gematria value to search for.');
      return;
    }

    const system = document.getElementById('gematria-system')?.value;
    const mode = document.querySelector('input[name="gematria-mode"]:checked')?.value || 'words';
    const multilang = document.getElementById('gematria-multilang')?.checked;

    // We need the current text data from layoutManager
    if (!window.layoutManager?.currentResults) {
      alert('Please perform an ELS search first to load a text, then use Gematria search.');
      return;
    }

    const { text, verseMap } = window.layoutManager.currentResults;
    if (!text || !verseMap) {
      alert('No text loaded. Please perform an ELS search first.');
      return;
    }

    const btn = document.getElementById('gematria-search-btn');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Searching…'; }

    try {
      let results;

      if (mode === 'words') {
        results = this.engine.searchByValue(verseMap, target, system, null);
      } else {
        const minLen = parseInt(document.getElementById('gematria-min-len')?.value) || 1;
        const maxLen = parseInt(document.getElementById('gematria-max-len')?.value) || 8;
        results = this.engine.searchSequencesByValue(text, verseMap, target, system, minLen, maxLen);
      }

      this.currentResults = { results, target, system, mode };

      if (multilang) {
        await this._addMultiLangMatches(results, target, mode);
      }

      this.renderGematriaResults(results, target, system, mode);

      // Highlight in text view
      if (results.length > 0 && mode === 'sequences') {
        const allPositions = results.flatMap(r => r.positions || []);
        window.displayManager?.highlightPositions(allPositions);
        window.layoutManager?.switchView('text');
      }

      if (window.layoutManager) {
        window.layoutManager.setStatus(`Gematria: ${results.length} match(es) for value ${target}`);
      }

    } catch (err) {
      console.error('Gematria search error:', err);
      alert('Gematria search error: ' + err.message);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '🔢 Search'; }
    }
  }

  async _addMultiLangMatches(results, target, mode) {
    // For each result, calculate what the same word/sequence looks like in other languages
    const languages = ['latin', 'kjv', 'finnish', 'hebrew', 'greek'];
    for (const result of results) {
      result.multiLang = {};
      for (const lang of languages) {
        const sys = this.engine.defaultSystemForLanguage(lang);
        try {
          const val = this.engine.calculate(result.word || result.sequence, sys);
          result.multiLang[lang] = { system: sys, value: val };
        } catch (e) {
          // skip
        }
      }
    }
  }

  // ----------------------------------------------------------
  // RENDER RESULTS
  // ----------------------------------------------------------

  renderGematriaResults(results, target, system, mode) {
    const section = document.getElementById('gematria-results-section');
    const list = document.getElementById('gematria-results-list');
    const label = document.getElementById('gematria-result-label');
    const count = document.getElementById('gematria-result-count');

    if (!section || !list) return;

    section.style.display = 'block';

    const systemName = this.engine.tables[system]?.name || system;
    if (label) label.textContent = `🔢 Gematria = ${target}`;
    if (count) count.textContent = `${results.length} match${results.length !== 1 ? 'es' : ''}`;

    if (results.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔢</div>
          <div class="empty-state-text">No matches for value ${target}</div>
          <div class="empty-state-subtext">Try a different value or system</div>
        </div>`;
      return;
    }

    let html = '';

    if (mode === 'words') {
      for (const r of results) {
        const multiHtml = r.multiLang
          ? `<div class="gem-multilang">${Object.entries(r.multiLang)
              .map(([lang, d]) => `<span class="gem-lang-chip" title="${d.system}">${lang.toUpperCase()}: ${d.value}</span>`)
              .join('')}</div>`
          : '';
        html += `
          <div class="gematria-result-item">
            <div class="gematria-result-word">${r.word}</div>
            <div class="gematria-result-meta">
              <span class="gematria-badge">${r.value}</span>
              <span class="gematria-verse-ref">${r.verseRef}</span>
            </div>
            <div class="gematria-verse-preview">${this._highlightWord(r.verseText, r.word)}</div>
            ${multiHtml}
          </div>`;
      }
    } else {
      // Sequence results
      for (const r of results) {
        html += `
          <div class="gematria-result-item">
            <div class="gematria-result-word">${r.sequence}</div>
            <div class="gematria-result-meta">
              <span class="gematria-badge">${r.value}</span>
              <span class="gematria-verse-ref">${r.verseRef}</span>
              <span class="gematria-pos">pos ${r.startPosition}</span>
            </div>
            <button class="view-btn gematria-view-btn"
                    data-start="${r.startPosition}"
                    data-end="${r.endPosition}">
              👁️ View in Text
            </button>
          </div>`;
      }
    }

    list.innerHTML = html;

    // Attach view-in-text handlers for sequences
    list.querySelectorAll('.gematria-view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const start = parseInt(e.target.dataset.start);
        const end = parseInt(e.target.dataset.end);
        const positions = Array.from({ length: end - start + 1 }, (_, i) => start + i);
        window.displayManager?.highlightPositions(positions);
        window.layoutManager?.switchView('text');
      });
    });
  }

  _highlightWord(verseText, word) {
    if (!verseText || !word) return verseText || '';
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return verseText.replace(
      new RegExp(`(${escaped})`, 'gi'),
      '<mark class="gematria-word-highlight">$1</mark>'
    );
  }

  // ----------------------------------------------------------
  // MULTI-LANGUAGE SIDE-BY-SIDE VALUE DISPLAY
  // Shows gematria of a word in all systems simultaneously
  // ----------------------------------------------------------

  showWordInAllSystems(word) {
    const languages = [
      { lang: 'hebrew', systems: ['hebrew', 'hebrew_gadol', 'hebrew_katan'] },
      { lang: 'greek',  systems: ['greek'] },
      { lang: 'latin',  systems: ['latin_ordinal', 'latin'] },
      { lang: 'english',systems: ['english', 'english_reduction', 'english_reverse'] },
      { lang: 'finnish',systems: ['finnish', 'finnish_reduction'] }
    ];

    let html = `<div class="gem-all-systems"><strong>${word}</strong> across all systems:<br>`;
    for (const { lang, systems } of languages) {
      html += `<div class="gem-lang-group"><strong>${lang.toUpperCase()}</strong>: `;
      html += systems.map(s => {
        try {
          const val = this.engine.calculate(word, s);
          return `<span class="gem-lang-chip" title="${this.engine.tables[s]?.name}">${this.engine.tables[s]?.name.split('(')[1]?.replace(')', '') || s}: <b>${val}</b></span>`;
        } catch { return ''; }
      }).join(' ');
      html += '</div>';
    }
    html += '</div>';
    return html;
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.GematriaManager = GematriaManager;
}
