// ============================================================
// Alignment Manager — Side-by-side dual-pane display
//
// Word hover behaviour:
//   • Highlights the ENTIRE corresponding verse on the other
//     side (safe: never maps word-N to wrong word-N)
//   • Shows a rich gematria tooltip above the hovered word:
//       – the word itself
//       – its value in the primary gematria system for that language
//       – all other systems for that language as secondary chips
//       – the verse reference
// ============================================================

class AlignmentManager {
  constructor() {
    // Singleton tooltip element shared by all hovers
    this._tooltip = null;
    this._tooltipHideTimer = null;
    this._engine = null; // lazy-init from window.GematriaEngine
  }

  // ----------------------------------------------------------
  // MAIN ENTRY: render the dual pane
  // ----------------------------------------------------------

  async renderDualPane(primaryLang, book, chapter, searchResults) {
    const container = document.getElementById('dual-display');
    if (!container) return;

    // Determine reference language
    const refLang = this._getReferenceLanguage(book, primaryLang);

    // For the primary language, reuse the verseMap already loaded by the search engine.
    // For the reference language (Hebrew/Greek), fetch fresh via getContinuousText.
    let primaryVerses, refVerses;
    try {
      primaryVerses = searchResults && searchResults.verseMap
        ? this._versesFromVerseMap(searchResults.verseMap)
        : await this._loadVerses(primaryLang, book, chapter);

      refVerses = refLang ? await this._loadVerses(refLang, book, chapter) : null;
    } catch (err) {
      container.innerHTML = `<div class="empty-state"><div class="empty-state-text">Error loading texts: ${err.message}</div></div>`;
      return;
    }

    if (!primaryVerses || primaryVerses.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📖</div><div class="empty-state-text">No verses found</div></div>`;
      return;
    }

    // Build layout
    container.innerHTML = this._buildDualLayout(
      primaryVerses, refVerses, primaryLang, refLang, book, chapter
    );

    // Attach hover behaviour after render
    this._attachHoverBehaviour(container, primaryLang, refLang);

    // Ensure tooltip element exists
    this._ensureTooltip();
  }

  // ----------------------------------------------------------
  // LAYOUT BUILDER
  // ----------------------------------------------------------

  _buildDualLayout(primaryVerses, refVerses, primaryLang, refLang, book, chapter) {
    const refLabel = refLang
      ? (refLang === 'hebrew' ? 'Hebrew (Source)' : 'Greek (Source)')
      : 'Reference';

    const langLabel = {
      latin: 'Latin (Vulgate)', kjv: 'King James English',
      finnish: 'Finnish', hebrew: 'Hebrew', greek: 'Greek'
    };

    // Build verse map for ref language (verse number → words)
    const refMap = {};
    if (refVerses) {
      refVerses.forEach(v => { refMap[v.verse] = v; });
    }

    let primaryHtml = '';
    let refHtml = '';

    primaryVerses.forEach(pVerse => {
      const verseNum = pVerse.verse;
      const rVerse = refMap[verseNum];

      primaryHtml += this._buildVerseBlock(pVerse, primaryLang, 'primary', verseNum);
      refHtml += rVerse
        ? this._buildVerseBlock(rVerse, refLang, 'reference', verseNum)
        : `<div class="verse-group" data-verse="${verseNum}"><span class="verse-num">${verseNum}</span><span class="verse-missing">—</span></div>`;
    });

    return `
      <div class="dual-pane-wrapper">
        <div class="dual-pane" id="pane-primary">
          <div class="dual-pane-header">
            <span class="pane-lang-label">${langLabel[primaryLang] || primaryLang}</span>
            <span class="pane-hint">Hover a word to see its gematria value</span>
          </div>
          <div class="dual-pane-content">${primaryHtml}</div>
        </div>
        ${refLang ? `
        <div class="dual-pane" id="pane-reference">
          <div class="dual-pane-header">
            <span class="pane-lang-label">${refLabel}</span>
            <span class="pane-hint">Verse highlighted on hover</span>
          </div>
          <div class="dual-pane-content">${refHtml}</div>
        </div>` : ''}
      </div>
    `;
  }

  _buildVerseBlock(verseObj, lang, paneType, verseNum) {
    const words = this._tokeniseVerse(verseObj.text, lang);
    const isRTL = lang === 'hebrew';
    const dirAttr = isRTL ? ' dir="rtl"' : '';
    const gemSystem = this._defaultSystem(lang);

    const wordSpans = words.map((w, i) => {
      if (!w.text.trim()) return `<span class="word-space"> </span>`;
      // Store raw word text as data attribute for gematria calculation
      const safe = w.text.replace(/"/g, '&quot;');
      return `<span class="word" 
                    data-word="${safe}"
                    data-word-index="${i}"
                    data-verse="${verseNum}"
                    data-lang="${lang}"
                    data-gem-system="${gemSystem}"
                    data-pane="${paneType}">${w.text}</span>`;
    }).join('');

    return `
      <div class="verse-group" data-verse="${verseNum}"${dirAttr}>
        <span class="verse-num">${verseNum}</span>
        <span class="verse-text"${dirAttr}>${wordSpans}</span>
      </div>`;
  }

  // ----------------------------------------------------------
  // HOVER BEHAVIOUR
  // ----------------------------------------------------------

  _attachHoverBehaviour(container, primaryLang, refLang) {
    const primaryPane = container.querySelector('#pane-primary .dual-pane-content');
    const refPane = container.querySelector('#pane-reference .dual-pane-content');

    // Delegate to container for performance
    container.addEventListener('mouseenter', (e) => {
      const word = e.target.closest('.word');
      if (!word) return;

      const verseNum = word.dataset.verse;
      const pane = word.dataset.pane;

      // Highlight this verse on the OPPOSITE pane
      this._highlightVerse(primaryPane, verseNum, pane === 'primary' ? false : true);
      this._highlightVerse(refPane,    verseNum, pane === 'reference' ? false : true);

      // Show gematria tooltip
      this._showGematriaTooltip(word, word.dataset.lang);

    }, true); // capture phase so it fires on child elements

    container.addEventListener('mouseleave', (e) => {
      const word = e.target.closest('.word');
      if (!word) return;

      // Only clear if we actually left the word (not moved to child)
      if (!word.contains(e.relatedTarget)) {
        this._clearVerseHighlights(primaryPane);
        this._clearVerseHighlights(refPane);
        this._scheduleHideTooltip();
      }
    }, true);
  }

  _highlightVerse(paneContent, verseNum, doHighlight) {
    if (!paneContent) return;
    // Clear all first
    paneContent.querySelectorAll('.verse-group').forEach(vg => {
      vg.classList.remove('verse-highlighted', 'verse-dimmed');
    });
    if (!doHighlight) return;
    // Highlight target verse, dim others
    paneContent.querySelectorAll('.verse-group').forEach(vg => {
      if (vg.dataset.verse === verseNum) {
        vg.classList.add('verse-highlighted');
      } else {
        vg.classList.add('verse-dimmed');
      }
    });
  }

  _clearVerseHighlights(paneContent) {
    if (!paneContent) return;
    paneContent.querySelectorAll('.verse-group').forEach(vg => {
      vg.classList.remove('verse-highlighted', 'verse-dimmed');
    });
  }

  // ----------------------------------------------------------
  // GEMATRIA TOOLTIP
  // ----------------------------------------------------------

  _ensureTooltip() {
    if (document.getElementById('gem-hover-tooltip')) return;
    const tip = document.createElement('div');
    tip.id = 'gem-hover-tooltip';
    tip.className = 'gem-hover-tooltip';
    tip.innerHTML = '';
    document.body.appendChild(tip);
    this._tooltip = tip;

    // Keep tooltip alive when mouse moves onto it
    tip.addEventListener('mouseenter', () => {
      if (this._tooltipHideTimer) clearTimeout(this._tooltipHideTimer);
    });
    tip.addEventListener('mouseleave', () => {
      this._scheduleHideTooltip();
    });
  }

  _scheduleHideTooltip(delay = 200) {
    if (this._tooltipHideTimer) clearTimeout(this._tooltipHideTimer);
    this._tooltipHideTimer = setTimeout(() => {
      if (this._tooltip) this._tooltip.classList.remove('gem-tooltip-visible');
    }, delay);
  }

  _showGematriaTooltip(wordEl, lang) {
    if (!this._tooltip) this._ensureTooltip();
    if (this._tooltipHideTimer) clearTimeout(this._tooltipHideTimer);

    const word = wordEl.dataset.word;
    const verseRef = `v.${wordEl.dataset.verse}`;
    const engine = this._getEngine();
    if (!engine) return;

    // Get all systems for this language
    const systems = this._systemsForLang(lang);
    const primary = systems[0];
    if (!primary) return;

    // Calculate primary value
    let primaryValue, breakdown;
    try {
      primaryValue = engine.calculate(word, primary.key);
      breakdown = engine.breakdown(word, primary.key);
    } catch (e) { return; }

    const digitalRoot = engine.digitalRoot(primaryValue);

    // Secondary systems
    const secondaries = systems.slice(1).map(s => {
      try {
        return { name: s.shortName, value: engine.calculate(word, s.key) };
      } catch (e) { return null; }
    }).filter(Boolean);

    // Breakdown chips (max 12 letters shown)
    const bdChips = breakdown
      .filter(b => b.value > 0)
      .slice(0, 12)
      .map(b => `<span class="gem-tip-chip">${b.letter}<sub>${b.value}</sub></span>`)
      .join('');
    const moreChips = breakdown.filter(b => b.value > 0).length > 12
      ? `<span class="gem-tip-more">…</span>` : '';

    const secondaryHtml = secondaries.length
      ? `<div class="gem-tip-secondary">${secondaries.map(s =>
          `<span class="gem-tip-sec-chip" title="${s.name}">${s.name}: <b>${s.value}</b></span>`
        ).join('')}</div>`
      : '';

    const rootHtml = digitalRoot !== primaryValue
      ? `<span class="gem-tip-root">root: ${digitalRoot}</span>` : '';

    this._tooltip.innerHTML = `
      <div class="gem-tip-word">${word}</div>
      <div class="gem-tip-main">
        <span class="gem-tip-value">${primaryValue}</span>
        <span class="gem-tip-system">${primary.shortName}</span>
        ${rootHtml}
      </div>
      <div class="gem-tip-breakdown">${bdChips}${moreChips}</div>
      ${secondaryHtml}
      <div class="gem-tip-verse">${verseRef}</div>
    `;

    // Position above the word element
    const rect = wordEl.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;

    this._tooltip.style.left = `${rect.left + scrollX}px`;
    this._tooltip.style.top  = `${rect.top  + scrollY - 8}px`; // will be pushed up by CSS transform

    this._tooltip.classList.add('gem-tooltip-visible');
  }

  // ----------------------------------------------------------
  // HELPERS
  // ----------------------------------------------------------

  _getEngine() {
    if (this._engine) return this._engine;
    if (window.GematriaEngine) {
      this._engine = new GematriaEngine();
      return this._engine;
    }
    return null;
  }

  _defaultSystem(lang) {
    const map = {
      latin: 'latin_ordinal', kjv: 'english', finnish: 'finnish',
      hebrew: 'hebrew', greek: 'greek'
    };
    return map[lang] || 'english';
  }

  _systemsForLang(lang) {
    // Returns [{key, shortName}] ordered primary first
    const all = {
      latin:   [{ key: 'latin_ordinal', shortName: 'Ordinal' },
                { key: 'latin',         shortName: 'Literae' }],
      kjv:     [{ key: 'english',           shortName: 'Standard' },
                { key: 'english_reduction', shortName: 'Reduction' },
                { key: 'english_reverse',   shortName: 'Reverse' }],
      finnish: [{ key: 'finnish',           shortName: 'Standard' },
                { key: 'finnish_reduction', shortName: 'Reduction' }],
      hebrew:  [{ key: 'hebrew',       shortName: 'Hechrachi' },
                { key: 'hebrew_gadol', shortName: 'Gadol' },
                { key: 'hebrew_katan', shortName: 'Katan' }],
      greek:   [{ key: 'greek', shortName: 'Isopsephy' }]
    };
    return all[lang] || all['kjv'];
  }

  _getReferenceLanguage(book, primaryLang) {
    if (primaryLang === 'hebrew' || primaryLang === 'greek') return null;
    // NT short IDs from dataLoader (mat, mrk, luk, jhn, act, rom, 1co..., rev)
    const ntIds = [
      'mat','mrk','luk','jhn','act','rom','1co','2co','gal','eph',
      'php','col','1th','2th','1ti','2ti','tit','phm','heb','jas',
      '1pe','2pe','1jn','2jn','3jn','jud','rev'
    ];
    const bookLower = (book || '').toLowerCase();
    return ntIds.includes(bookLower) ? 'greek' : 'hebrew';
  }

  async _loadVerses(lang, book, chapter) {
    try {
      // loadBookRange returns a book-data object; getContinuousText extracts {text, verseMap}
      const bookData = await window.dataLoader.loadBookRange(lang, book, chapter, chapter);
      if (!bookData) return [];
      const { verseMap } = window.dataLoader.getContinuousText(bookData);
      return verseMap.map(v => ({
        verse: v.verse,
        text: v.text || ''
      }));
    } catch (e) {
      console.error(`AlignmentManager: failed to load ${lang}/${book}/${chapter}`, e);
      return [];
    }
  }

  // Use pre-loaded verseMap directly (no extra fetch needed for primary language)
  _versesFromVerseMap(verseMap) {
    if (!verseMap) return [];
    return verseMap.map(v => ({ verse: v.verse, text: v.text || '' }));
  }

  _tokeniseVerse(text, lang) {
    // Split into word tokens and spaces, preserving punctuation with words
    // Returns [{text, isWord}]
    if (!text) return [];
    // Split on whitespace boundaries
    const parts = text.split(/(\s+)/);
    return parts.map(p => ({ text: p, isWord: /\S/.test(p) }));
  }
}

// Export
if (typeof window !== 'undefined') {
  window.AlignmentManager = AlignmentManager;
}
