// Display Manager for Text Visualization
class DisplayManager {
  constructor() {
    this.currentText = null;
    this.verseMap = null;
    this.highlightedPositions = new Set();
  }

  loadText(text, verseMap, language) {
    this.currentText = text;
    this.verseMap = verseMap;
    this.renderText(text, verseMap, language);
  }

  renderText(text, verseMap, language) {
    const textViewer = document.querySelector('#text-display .text-viewer');
    if (!text || text.length === 0) {
      textViewer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📖</div>
          <div class="empty-state-text">No text available</div>
        </div>
      `;
      return;
    }

    let html = '';
    let currentPosition = 0;

    // Group by chapter
    const chapterGroups = {};
    for (const verse of verseMap) {
      const key = `${verse.chapter}`;
      if (!chapterGroups[key]) {
        chapterGroups[key] = [];
      }
      chapterGroups[key].push(verse);
    }

    // Render by chapter
    for (const [chapter, verses] of Object.entries(chapterGroups)) {
      html += `<div class="chapter">`;
      html += `<h4>Chapter ${chapter}</h4>`;

      for (const verse of verses) {
        html += `<span class="verse-number">${verse.verse}</span> `;
        
        // Render each letter
        for (let pos = verse.start; pos <= verse.end; pos++) {
          if (pos < text.length) {
            html += `<span class="letter" data-position="${pos}">${text[pos]}</span>`;
          }
        }
        html += ' ';
      }

      html += `</div>`;
    }

    textViewer.innerHTML = html;
  }

  highlightPositions(positions) {
    // Clear previous highlights
    document.querySelectorAll('.letter.highlighted').forEach(el => {
      el.classList.remove('highlighted');
    });

    // Add new highlights
    const sortedPositions = [...positions].sort((a, b) => a - b);
    let firstElement = null;

    sortedPositions.forEach(pos => {
      const letterElement = document.querySelector(`.letter[data-position="${pos}"]`);
      if (letterElement) {
        letterElement.classList.add('highlighted');
        if (!firstElement) {
          firstElement = letterElement;
        }
      }
    });

    // Scroll first highlighted letter into view
    if (firstElement) {
      firstElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    this.highlightedPositions = new Set(positions);
  }

  renderMatrix(text, width, highlightedResults = []) {
    const matrixViewer = document.querySelector('.matrix-viewer');
    
    if (!text || text.length === 0) {
      matrixViewer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⊞</div>
          <div class="empty-state-text">No matrix to display</div>
        </div>
      `;
      return;
    }

    const generator = new MatrixGenerator();
    const matrix = generator.generateMatrix(text, width, 0, 100); // First 100 rows
    
    // Build highlight set
    const highlightSet = new Set();
    highlightedResults.forEach(result => {
      if (result.positions) {
        result.positions.forEach(pos => highlightSet.add(pos));
      }
    });

    let html = `<div class="matrix-grid" style="grid-template-columns: repeat(${width}, 1fr);">`;
    
    for (const row of matrix) {
      for (let col = 0; col < row.letters.length; col++) {
        const position = row.startPosition + col;
        const isHighlighted = highlightSet.has(position);
        
        html += `<span class="matrix-cell ${isHighlighted ? 'highlighted' : ''}" 
                      data-position="${position}" 
                      title="Position: ${position}">
                  ${row.letters[col]}
                </span>`;
      }
    }
    
    html += '</div>';
    matrixViewer.innerHTML = html;
  }

  clearHighlights() {
    document.querySelectorAll('.letter.highlighted, .matrix-cell.highlighted').forEach(el => {
      el.classList.remove('highlighted');
    });
    this.highlightedPositions.clear();
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.DisplayManager = DisplayManager;
}
