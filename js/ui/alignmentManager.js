// Alignment Manager - Handles side-by-side language display
class AlignmentManager {
  constructor() {
    this.alignmentCache = new Map();
    this.currentAlignment = null;
  }

  /**
   * Align two language texts at word level
   */
  async alignTexts(primaryLang, primaryBook, primaryChapter, secondaryLang) {
    const cacheKey = `${primaryLang}-${secondaryLang}-${primaryBook}-${primaryChapter}`;
    
    if (this.alignmentCache.has(cacheKey)) {
      return this.alignmentCache.get(cacheKey);
    }

    try {
      // Load both texts
      const primaryText = await window.dataLoader.loadBookRange(
        primaryLang, primaryBook, primaryChapter, primaryChapter
      );
      
      const secondaryText = await window.dataLoader.loadBookRange(
        secondaryLang, primaryBook, primaryChapter, primaryChapter
      );

      if (!primaryText || !secondaryText) {
        console.warn('Could not load texts for alignment:', {primaryLang, secondaryLang, primaryBook, primaryChapter});
        return null;
      }

      if (!primaryText.chapters || primaryText.chapters.length === 0) {
        console.warn('Primary text has no chapters');
        return null;
      }

      if (!secondaryText.chapters || secondaryText.chapters.length === 0) {
        console.warn('Secondary text has no chapters');
        return null;
      }

      // Perform alignment
      const alignment = this.performAlignment(primaryText, secondaryText);
      
      this.alignmentCache.set(cacheKey, alignment);
      return alignment;
    } catch (error) {
      console.error('Error in alignTexts:', error);
      return null;
    }
  }

  performAlignment(primaryText, secondaryText) {
    const alignment = [];
    const primaryVerses = primaryText.chapters[0].verses;
    const secondaryVerses = secondaryText.chapters[0].verses;

    const maxVerses = Math.min(primaryVerses.length, secondaryVerses.length);

    for (let i = 0; i < maxVerses; i++) {
      const primaryVerse = primaryVerses[i];
      const secondaryVerse = secondaryVerses[i];

      const verseAlignment = this.alignVerse(
        primaryVerse.text,
        secondaryVerse.text
      );

      alignment.push({
        verseNumber: primaryVerse.number,
        primaryVerse: primaryVerse.text,
        secondaryVerse: secondaryVerse.text,
        wordMappings: verseAlignment
      });
    }

    return alignment;
  }

  alignVerse(primaryText, secondaryText) {
    // Simple word-splitting approach with linear mapping
    const primaryWords = primaryText.split(/\s+/).filter(w => w.length > 0);
    const secondaryWords = secondaryText.split(/\s+/).filter(w => w.length > 0);
    
    if (primaryWords.length === 0 || secondaryWords.length === 0) {
      return [];
    }

    const ratio = secondaryWords.length / primaryWords.length;
    const mappings = [];

    for (let i = 0; i < primaryWords.length; i++) {
      const secondaryStart = Math.floor(i * ratio);
      const secondaryEnd = Math.min(
        Math.floor((i + 1) * ratio),
        secondaryWords.length
      );
      
      mappings.push({
        primaryWord: primaryWords[i],
        primaryIndex: i,
        secondaryWords: secondaryWords.slice(secondaryStart, secondaryEnd),
        secondaryIndices: [secondaryStart, secondaryEnd]
      });
    }

    return mappings;
  }

  /**
   * Determine secondary language based on testament
   */
  getSecondaryLanguage(testament) {
    return testament === 'OT' ? 'hebrew' : 'greek';
  }

  /**
   * Render dual-pane display with current search results
   */
  async renderDualPane(primaryLang, book, chapter, searchResults) {
    const container = document.getElementById('dual-display');
    
    if (!container) {
      console.error('Dual display container not found');
      return;
    }

    // Get testament for this book
    const testament = window.dataLoader.getTestament(book);
    const secondaryLang = this.getSecondaryLanguage(testament);

    console.log('Rendering dual pane:', {primaryLang, book, chapter, testament, secondaryLang});

    try {
      // Load the alignment
      const alignment = await this.alignTexts(primaryLang, book, chapter, secondaryLang);
      
      if (!alignment || alignment.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">❌</div>
            <div class="empty-state-text">Unable to load alignment</div>
            <div class="empty-state-subtext">Could not load ${secondaryLang} text for ${book} ${chapter}</div>
          </div>
        `;
        return;
      }

      this.currentAlignment = alignment;
      const isRTL = secondaryLang === 'hebrew';
      
      let html = `
        <div class="dual-pane-container">
          <div class="pane primary-pane">
            <div class="pane-header">
              <h3>${primaryLang.toUpperCase()}</h3>
            </div>
            <div class="pane-content">
              ${this.buildPrimaryContent(alignment)}
            </div>
          </div>
          
          <div class="pane secondary-pane ${isRTL ? 'rtl' : ''}">
            <div class="pane-header">
              <h3>${secondaryLang.toUpperCase()}</h3>
            </div>
            <div class="pane-content">
              ${this.buildSecondaryContent(alignment, isRTL)}
            </div>
          </div>
        </div>
      `;

      container.innerHTML = html;
      this.attachDualPaneHandlers();

    } catch (error) {
      console.error('Error rendering dual pane:', error);
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">❌</div>
          <div class="empty-state-text">Error loading alignment</div>
          <div class="empty-state-subtext">${error.message}</div>
        </div>
      `;
    }
  }

  buildPrimaryContent(alignment) {
    let html = '';
    
    for (const verseAlignment of alignment) {
      html += `<div class="verse-group" data-verse="${verseAlignment.verseNumber}">`;
      html += `<span class="verse-number">${verseAlignment.verseNumber}</span> `;
      
      for (let i = 0; i < verseAlignment.wordMappings.length; i++) {
        const mapping = verseAlignment.wordMappings[i];
        html += `<span class="word primary-word" 
                      data-word-index="${i}"
                      data-verse="${verseAlignment.verseNumber}"
                      data-secondary-start="${mapping.secondaryIndices[0]}"
                      data-secondary-end="${mapping.secondaryIndices[1]}">
                  ${mapping.primaryWord}
                </span> `;
      }
      
      html += `</div>`;
    }
    
    return html;
  }

  buildSecondaryContent(alignment, isRTL) {
    let html = '';
    
    for (const verseAlignment of alignment) {
      html += `<div class="verse-group" data-verse="${verseAlignment.verseNumber}">`;
      html += `<span class="verse-number">${verseAlignment.verseNumber}</span> `;
      
      const secondaryWords = verseAlignment.secondaryVerse.split(/\s+/).filter(w => w.length > 0);
      secondaryWords.forEach((word, index) => {
        html += `<span class="word secondary-word" 
                      data-word-index="${index}"
                      data-verse="${verseAlignment.verseNumber}">
                  ${word}
                </span> `;
      });
      
      html += `</div>`;
    }
    
    return html;
  }

  attachDualPaneHandlers() {
    const primaryWords = document.querySelectorAll('.primary-word');
    const secondaryWords = document.querySelectorAll('.secondary-word');

    primaryWords.forEach(word => {
      word.addEventListener('mouseenter', (e) => {
        const verse = e.target.dataset.verse;
        const start = parseInt(e.target.dataset.secondaryStart);
        const end = parseInt(e.target.dataset.secondaryEnd);
        
        // Highlight corresponding secondary words
        secondaryWords.forEach((secWord) => {
          if (secWord.dataset.verse === verse) {
            const idx = parseInt(secWord.dataset.wordIndex);
            if (idx >= start && idx < end) {
              secWord.classList.add('highlighted');
            }
          }
        });
      });

      word.addEventListener('mouseleave', () => {
        secondaryWords.forEach(w => w.classList.remove('highlighted'));
      });
    });

    // Reverse highlighting
    secondaryWords.forEach(word => {
      word.addEventListener('mouseenter', (e) => {
        const verse = e.target.dataset.verse;
        const idx = parseInt(e.target.dataset.wordIndex);
        
        // Find primary word that maps to this secondary word
        primaryWords.forEach((primWord) => {
          if (primWord.dataset.verse === verse) {
            const start = parseInt(primWord.dataset.secondaryStart);
            const end = parseInt(primWord.dataset.secondaryEnd);
            if (idx >= start && idx < end) {
              primWord.classList.add('highlighted');
            }
          }
        });
      });

      word.addEventListener('mouseleave', () => {
        primaryWords.forEach(w => w.classList.remove('highlighted'));
      });
    });
  }

  /**
   * Update dual pane when chapter changes
   */
  async updateForChapter(primaryLang, book, startChapter, endChapter) {
    // For now, just show the first chapter
    // In future, could show multiple chapters
    await this.renderDualPane(primaryLang, book, startChapter, null);
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.AlignmentManager = AlignmentManager;
}
