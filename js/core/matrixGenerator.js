// Matrix/Array View Generator
class MatrixGenerator {
  /**
   * Convert linear text into 2D matrix for visualization
   * @param {string} text - Continuous normalized text
   * @param {number} width - Row width (columns)
   * @param {number} startOffset - Starting position in text
   * @param {number} rows - Number of rows to generate
   */
  generateMatrix(text, width, startOffset = 0, rows = 50) {
    const matrix = [];
    const maxRows = Math.ceil((text.length - startOffset) / width);
    const actualRows = Math.min(rows, maxRows);
    
    for (let row = 0; row < actualRows; row++) {
      const rowStart = startOffset + (row * width);
      const rowEnd = Math.min(rowStart + width, text.length);
      
      if (rowStart >= text.length) break;
      
      const letters = [];
      for (let i = rowStart; i < rowEnd; i++) {
        letters.push(text[i]);
      }
      
      matrix.push({
        rowNumber: row,
        startPosition: rowStart,
        endPosition: rowEnd - 1,
        letters: letters
      });
    }
    
    return matrix;
  }

  /**
   * Find optimal matrix width for displaying multiple ELS results
   * Width where results appear most compact
   */
  findOptimalWidth(elsResults, minWidth = 10, maxWidth = 200) {
    if (!elsResults || elsResults.length === 0) {
      return { width: 50, compactness: 0 };
    }

    let bestWidth = minWidth;
    let bestCompactness = Infinity;

    for (let width = minWidth; width <= maxWidth; width++) {
      const compactness = this.calculateCompactness(elsResults, width);
      if (compactness < bestCompactness) {
        bestCompactness = compactness;
        bestWidth = width;
      }
    }

    return { 
      width: bestWidth, 
      compactness: bestCompactness.toFixed(2) 
    };
  }

  calculateCompactness(elsResults, width) {
    let totalSpread = 0;

    for (const result of elsResults) {
      const positions = result.positions;
      const rows = positions.map(pos => Math.floor(pos / width));
      const cols = positions.map(pos => pos % width);
      
      const rowSpread = Math.max(...rows) - Math.min(...rows);
      const colSpread = Math.max(...cols) - Math.min(...cols);
      
      // Combined spread (Euclidean-like metric)
      totalSpread += Math.sqrt(rowSpread * rowSpread + colSpread * colSpread);
    }

    return totalSpread / elsResults.length;
  }

  /**
   * Get matrix dimensions for a given text and width
   */
  getMatrixDimensions(text, width) {
    const rows = Math.ceil(text.length / width);
    const lastRowWidth = text.length % width || width;
    
    return {
      rows: rows,
      columns: width,
      lastRowWidth: lastRowWidth,
      totalCells: text.length
    };
  }

  /**
   * Convert position in linear text to row/column in matrix
   */
  positionToRowCol(position, width) {
    return {
      row: Math.floor(position / width),
      col: position % width
    };
  }

  /**
   * Convert row/column to position in linear text
   */
  rowColToPosition(row, col, width) {
    return row * width + col;
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.MatrixGenerator = MatrixGenerator;
}
