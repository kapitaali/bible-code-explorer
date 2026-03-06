// Layout Manager - Controls UI layout and interaction
class LayoutManager {
  constructor() {
    this.currentView = 'text';
    this.selectedLanguages = {
      primary: 'latin',
      secondary: null
    };
    this.currentResults = null;
    this.currentText = '';
  }

  initializeLayout() {
    document.getElementById('app').innerHTML = this.buildMainLayout();
    this.attachEventListeners();
    this.populateBookSelector(this.selectedLanguages.primary);
    // Initialize gematria manager and inject its HTML
    window.gematriaManager = new GematriaManager();
    const panelSlot = document.getElementById('gematria-panel-placeholder');
    if (panelSlot) panelSlot.innerHTML = window.gematriaManager.buildGematriaPanel();
    const resultsSlot = document.getElementById('gematria-results-placeholder');
    if (resultsSlot) resultsSlot.innerHTML = window.gematriaManager.buildGematriaResultsSection();
    window.gematriaManager.attachEvents();
  }

  buildMainLayout() {
    return `
      <!-- Header -->
      <header id="main-header">
        <div class="header-left">
          <h1>📖 Bible Code Explorer</h1>
        </div>
        <div class="header-right">
          <select id="language-selector" class="language-dropdown">
            <option value="latin">Latin (Vulgate)</option>
            <option value="kjv">King James English</option>
            <option value="finnish">Finnish</option>
          </select>
        </div>
      </header>

      <!-- Main Content -->
      <main id="main-content">
        <!-- Left Sidebar: Controls -->
        <aside id="control-panel">
          ${this.buildControlPanel()}
        </aside>

        <!-- Center: Display Area -->
        <section id="display-area">
          ${this.buildDisplayArea()}
        </section>

        <!-- Right Sidebar: Results -->
        <aside id="results-panel">
          ${this.buildResultsPanel()}
        </aside>
      </main>

      <!-- Footer -->
      <footer id="main-footer">
        <div class="footer-content">
          <span>Bible Code Explorer | Educational & Research Tool | <a href="gematria_reference.html" style="color: rgba(255,255,255,0.7); text-decoration: none;" target="_blank">Gematria Reference</a></span>
          <span>Status: <span id="status-indicator">Ready</span></span>
        </div>
      </footer>
    `;
  }

  buildControlPanel() {
    return `
      <div class="control-section">
        <h3>📋 Search Parameters</h3>
        
        <!-- Text Selection -->
        <div class="control-group">
          <label>Text Range</label>
          <select id="book-selector">
            <option value="">Loading books...</option>
          </select>
          
          <div class="range-inputs">
            <input type="number" id="chapter-start" placeholder="From Ch." min="1" value="1">
            <span>to</span>
            <input type="number" id="chapter-end" placeholder="To Ch." min="1" value="1">
          </div>
        </div>

        <!-- Search Term -->
        <div class="control-group">
          <label>Search Term</label>
          <input type="text" id="search-term" placeholder="Enter word to search...">
          <small class="help-text">Normalized: <span id="normalized-preview">-</span></small>
        </div>

        <!-- Skip Range -->
        <div class="control-group">
          <label>Skip Interval Range</label>
          <div class="skip-inputs">
            <input type="number" id="min-skip" value="1" min="1" max="1000">
            <span>to</span>
            <input type="number" id="max-skip" value="50" min="1" max="1000">
          </div>
          <label class="checkbox-label">
            <input type="checkbox" id="include-negative" checked>
            Include backward searches
          </label>
        </div>

        <!-- Advanced Options -->
        <details class="control-group">
          <summary>⚙️ Advanced Options</summary>
          <div class="advanced-options">
            <label>
              Max Results:
              <input type="number" id="max-results" value="500" min="10" max="10000">
            </label>
            
            <label class="checkbox-label">
              <input type="checkbox" id="cluster-search">
              Cluster search mode
            </label>
            
            <div id="cluster-options" style="display: none;">
              <label>Related terms (comma-separated):</label>
              <textarea id="related-terms" rows="3" placeholder="term1, term2, term3"></textarea>
              <label>
                Proximity threshold (characters):
                <input type="number" id="proximity-threshold" value="1000" min="100">
              </label>
            </div>
          </div>
        </details>

        <!-- Action Buttons -->
        <div class="control-group action-buttons">
          <button id="search-btn" class="primary-btn">🔍 Search</button>
          <button id="clear-btn" class="secondary-btn">✖ Clear</button>
        </div>

        <!-- Side-by-Side Toggle -->
        <div class="control-group">
          <label class="checkbox-label">
            <input type="checkbox" id="show-reference-lang">
            Show reference language (Hebrew/Greek)
          </label>
        </div>
      </div>

      <!-- Gematria Panel (injected by GematriaManager) -->
      <div id="gematria-panel-placeholder"></div>
    `;
  }

  buildDisplayArea() {
    return `
      <div class="display-container">
        <!-- View Mode Tabs -->
        <div class="view-tabs">
          <button class="tab-btn active" data-view="text">📄 Text View</button>
          <button class="tab-btn" data-view="matrix">⊞ Matrix View</button>
          <button class="tab-btn" data-view="dual">↔️ Side-by-Side</button>
        </div>

        <!-- Display Content -->
        <div id="text-display" class="display-content active">
          <div class="text-viewer">
            <div class="empty-state">
              <div class="empty-state-icon">📖</div>
              <div class="empty-state-text">No text loaded</div>
              <div class="empty-state-subtext">Select a text range and perform a search to begin</div>
            </div>
          </div>
        </div>

        <div id="matrix-display" class="display-content">
          <div class="matrix-controls">
            <label>
              Matrix Width:
              <input type="number" id="matrix-width" value="50" min="10" max="200">
            </label>
            <button id="auto-width-btn">Auto-optimize</button>
          </div>
          <div class="matrix-viewer">
            <div class="empty-state">
              <div class="empty-state-icon">⊞</div>
              <div class="empty-state-text">No matrix to display</div>
              <div class="empty-state-subtext">Perform a search first</div>
            </div>
          </div>
        </div>

        <div id="dual-display" class="display-content">
          <div class="empty-state">
            <div class="empty-state-icon">↔️</div>
            <div class="empty-state-text">Side-by-side view</div>
            <div class="empty-state-subtext">Enable reference language and perform a search</div>
          </div>
        </div>
      </div>
    `;
  }

  buildResultsPanel() {
    return `
      <div class="results-container">
        <h3>📊 Results <span id="result-count">(0)</span></h3>
        
        <!-- Sorting Options -->
        <div class="results-controls">
          <select id="sort-by">
            <option value="position">Sort by Position</option>
            <option value="skip">Sort by Skip Value</option>
          </select>
        </div>

        <!-- Results List -->
        <div id="results-list" class="results-list">
          <div class="empty-state">
            <div class="empty-state-icon">🔍</div>
            <div class="empty-state-text">No results yet</div>
            <div class="empty-state-subtext">Perform a search to see results</div>
          </div>
        </div>

        <!-- Export Options -->
        <div class="results-actions">
          <button id="export-csv-btn" class="secondary-btn" disabled>💾 CSV</button>
          <button id="export-json-btn" class="secondary-btn" disabled>💾 JSON</button>
        </div>

        <!-- Gematria Results (injected by GematriaManager) -->
        <div id="gematria-results-placeholder"></div>
      </div>
    `;
  }

  async populateBookSelector(language) {
    const selector = document.getElementById('book-selector');
    if (!selector) return;

    selector.innerHTML = '<option value="">Loading books...</option>';
    selector.disabled = true;

    try {
      const books = await window.dataLoader.getAvailableBooks(language);

      if (!books || books.length === 0) {
        selector.innerHTML = '<option value="">No books available</option>';
        return;
      }

      // Group by testament
      const otBooks = books.filter(b => b.testament === 'OT');
      const ntBooks = books.filter(b => b.testament === 'NT');

      let html = '';

      if (otBooks.length > 0) {
        html += '<optgroup label="Old Testament">';
        otBooks.forEach(book => {
          html += `<option value="${book.id}">${book.name}</option>`;
        });
        html += '</optgroup>';
      }

      if (ntBooks.length > 0) {
        html += '<optgroup label="New Testament">';
        ntBooks.forEach(book => {
          html += `<option value="${book.id}">${book.name}</option>`;
        });
        html += '</optgroup>';
      }

      selector.innerHTML = html;
      selector.disabled = false;

      // Update chapter range for the first book
      this.updateChapterRange(books[0]);

    } catch (error) {
      console.error('Failed to populate book selector:', error);
      selector.innerHTML = '<option value="">Error loading books</option>';
    }
  }

  updateChapterRange(book) {
    if (!book) return;
    const chapterEnd = document.getElementById('chapter-end');
    if (chapterEnd) {
      chapterEnd.max = book.chapterCount;
      chapterEnd.value = 1;
    }
    const chapterStart = document.getElementById('chapter-start');
    if (chapterStart) {
      chapterStart.max = book.chapterCount;
      chapterStart.value = 1;
    }
  }

  attachEventListeners() {
    // Language selector
    document.getElementById('language-selector').addEventListener('change', (e) => {
      this.selectedLanguages.primary = e.target.value;
      this.updateNormalizedPreview();
      this.populateBookSelector(e.target.value);
    });

    // Book selector - update chapter range when book changes
    document.getElementById('book-selector').addEventListener('change', async (e) => {
      const language = this.selectedLanguages.primary;
      const books = await window.dataLoader.getAvailableBooks(language);
      const selected = books.find(b => b.id === e.target.value);
      if (selected) this.updateChapterRange(selected);
    });

    // Search term preview
    document.getElementById('search-term').addEventListener('input', () => {
      this.updateNormalizedPreview();
    });

    // Cluster search toggle
    document.getElementById('cluster-search').addEventListener('change', (e) => {
      document.getElementById('cluster-options').style.display = 
        e.target.checked ? 'block' : 'none';
    });

    // View tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchView(e.target.dataset.view);
      });
    });

    // Search button
    document.getElementById('search-btn').addEventListener('click', () => {
      this.performSearch();
    });

    // Clear button
    document.getElementById('clear-btn').addEventListener('click', () => {
      this.clearResults();
    });

    // Reference language checkbox
    document.getElementById('show-reference-lang').addEventListener('change', (e) => {
      if (e.target.checked && this.currentResults) {
        this.switchView('dual');
        this.updateDualPane();
      }
    });

    // Export buttons
    document.getElementById('export-csv-btn').addEventListener('click', () => {
      if (this.currentResults) {
        window.exportManager.exportToCSV(this.currentResults.results || this.currentResults.clusters);
      }
    });

    document.getElementById('export-json-btn').addEventListener('click', () => {
      if (this.currentResults) {
        window.exportManager.exportToJSON(this.currentResults);
      }
    });

    // Auto-optimize matrix width
    document.getElementById('auto-width-btn').addEventListener('click', () => {
      this.optimizeMatrixWidth();
    });
  }

  updateNormalizedPreview() {
    const term = document.getElementById('search-term').value;
    const lang = this.selectedLanguages.primary;
    
    const normalized = window.searchManager.normalizeForLanguage(term, lang);
    document.getElementById('normalized-preview').textContent = normalized || '(empty)';
  }

  switchView(viewName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    document.querySelectorAll('.display-content').forEach(content => {
      content.classList.remove('active');
    });
    
    document.getElementById(`${viewName}-display`).classList.add('active');
    this.currentView = viewName;
  }

  async performSearch() {
    const params = {
      language: this.selectedLanguages.primary,
      book: document.getElementById('book-selector').value,
      chapterStart: parseInt(document.getElementById('chapter-start').value) || 1,
      chapterEnd: parseInt(document.getElementById('chapter-end').value) || 1,
      searchTerm: document.getElementById('search-term').value.trim(),
      minSkip: parseInt(document.getElementById('min-skip').value) || 1,
      maxSkip: parseInt(document.getElementById('max-skip').value) || 50,
      includeNegative: document.getElementById('include-negative').checked,
      maxResults: parseInt(document.getElementById('max-results').value) || 500,
      clusterMode: document.getElementById('cluster-search').checked,
      relatedTerms: document.getElementById('related-terms').value
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0),
      proximityThreshold: parseInt(document.getElementById('proximity-threshold').value) || 1000
    };

    if (!params.searchTerm) {
      alert('Please enter a search term');
      return;
    }

    if (!params.book) {
      alert('Please select a book');
      return;
    }

    if (params.chapterStart > params.chapterEnd) {
      alert('Start chapter must be less than or equal to end chapter');
      return;
    }

    this.setStatus('Searching...');
    document.getElementById('search-btn').disabled = true;
    document.getElementById('search-btn').innerHTML = '⏳ Searching...';

    try {
      const results = await window.searchManager.executeSearch(params);
      
      this.currentResults = results;
      this.currentText = results.text;
      
      if (results.mode === 'cluster') {
        this.displayClusterResults(results.clusters);
      } else {
        this.displayResults(results.results);
      }
      
      window.displayManager.loadText(results.text, results.verseMap, params.language);
      
      if (document.getElementById('show-reference-lang').checked) {
        this.updateDualPane();
      }
      
      document.getElementById('export-csv-btn').disabled = false;
      document.getElementById('export-json-btn').disabled = false;
      
      const count = results.mode === 'cluster' ? results.clusters.length : results.results.length;
      this.setStatus(`Found ${count} result(s)`);
      
    } catch (error) {
      console.error('Search error:', error);
      this.setStatus('Search failed');
      alert('Search error: ' + error.message);
    } finally {
      document.getElementById('search-btn').disabled = false;
      document.getElementById('search-btn').innerHTML = '🔍 Search';
    }
  }

  displayResults(results) {
    const resultsList = document.getElementById('results-list');
    document.getElementById('result-count').textContent = `(${results.length})`;
    
    if (results.length === 0) {
      resultsList.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">❌</div>
          <div class="empty-state-text">No matches found</div>
          <div class="empty-state-subtext">Try adjusting your search parameters</div>
        </div>
      `;
      return;
    }

    let html = '';
    results.forEach((result, index) => {
      html += `
        <div class="result-item" data-result-index="${index}">
          <div class="result-header">
            <span class="result-term">${result.term}</span>
            <span class="result-skip">Skip: ${result.skip}</span>
          </div>
          <div class="result-details">
            <span>Start Position: ${result.startPosition}</span>
            <span>Sequence: ${result.sequence}</span>
            <span>Span: ${result.positions.length} letters</span>
          </div>
          <button class="view-btn" data-result-index="${index}">
            👁️ View in Text
          </button>
        </div>
      `;
    });

    resultsList.innerHTML = html;

    resultsList.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.resultIndex);
        this.highlightResult(results[index]);
      });
    });
  }

  displayClusterResults(clusters) {
    const resultsList = document.getElementById('results-list');
    document.getElementById('result-count').textContent = `(${clusters.length} clusters)`;
    
    if (clusters.length === 0) {
      resultsList.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">❌</div>
          <div class="empty-state-text">No clusters found</div>
          <div class="empty-state-subtext">Try different related terms or increase proximity threshold</div>
        </div>
      `;
      return;
    }

    let html = '';
    clusters.forEach((cluster, index) => {
      html += `
        <div class="result-item cluster-item" data-result-index="${index}">
          <div class="result-header">
            <span class="result-term">${cluster.primary.term}</span>
            <span class="result-skip">Skip: ${cluster.primary.skip}</span>
          </div>
          <div class="result-details">
            <span>Position: ${cluster.primary.startPosition}</span>
            <span>Compactness: ${cluster.compactness.toFixed(0)} chars</span>
            <span>Related: ${cluster.related.length} term(s)</span>
          </div>
          <div class="related-terms">
            ${cluster.related.map(r => 
              `<span class="related-term">${r.term} (${r.matches.length})</span>`
            ).join('')}
          </div>
          <button class="view-btn" data-result-index="${index}">
            👁️ View Cluster
          </button>
        </div>
      `;
    });

    resultsList.innerHTML = html;

    resultsList.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.resultIndex);
        this.highlightCluster(clusters[index]);
      });
    });
  }

  highlightResult(result) {
    this.switchView('text');
    window.displayManager.highlightPositions(result.positions);
  }

  highlightCluster(cluster) {
    this.switchView('text');
    const allPositions = [
      ...cluster.primary.positions,
      ...cluster.related.flatMap(r => r.matches.flatMap(m => m.positions))
    ];
    window.displayManager.highlightPositions(allPositions);
  }

  clearResults() {
    this.currentResults = null;
    this.currentText = '';
    document.getElementById('results-list').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-text">No results yet</div>
        <div class="empty-state-subtext">Perform a search to see results</div>
      </div>
    `;
    document.getElementById('result-count').textContent = '(0)';
    document.getElementById('export-csv-btn').disabled = true;
    document.getElementById('export-json-btn').disabled = true;
    
    document.querySelector('#text-display .text-viewer').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📖</div>
        <div class="empty-state-text">No text loaded</div>
        <div class="empty-state-subtext">Select a text range and perform a search to begin</div>
      </div>
    `;
    
    this.setStatus('Ready');
  }

  optimizeMatrixWidth() {
    if (!this.currentResults || !this.currentResults.results) {
      alert('Perform a search first');
      return;
    }

    const generator = new MatrixGenerator();
    const optimal = generator.findOptimalWidth(this.currentResults.results, 10, 150);
    document.getElementById('matrix-width').value = optimal.width;
    this.updateMatrixView();
    alert(`Optimal width found: ${optimal.width} (compactness: ${optimal.compactness})`);
  }

  updateMatrixView() {
    if (!this.currentResults) return;
    const width = parseInt(document.getElementById('matrix-width').value) || 50;
    const results = this.currentResults.results || [];
    window.displayManager.renderMatrix(this.currentText, width, results);
  }

  async updateDualPane() {
    if (!this.currentResults || !this.currentResults.params) {
      console.warn('No current results to display in dual pane');
      return;
    }

    const params = this.currentResults.params;
    
    try {
      await window.alignmentManager.renderDualPane(
        params.language,
        params.book,
        params.chapterStart,
        this.currentResults
      );
    } catch (error) {
      console.error('Error updating dual pane:', error);
    }
  }

  setStatus(message) {
    document.getElementById('status-indicator').textContent = message;
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.LayoutManager = LayoutManager;
}
