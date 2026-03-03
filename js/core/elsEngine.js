// ELS (Equidistant Letter Sequence) Search Engine
class ELSEngine {
  constructor(text, config = {}) {
    this.text = text;
    this.config = config;
    this.results = [];
  }

  /**
   * Primary ELS search function
   * @param {string} searchTerm - Normalized word to search for
   * @param {number} minSkip - Minimum skip interval
   * @param {number} maxSkip - Maximum skip interval
   * @param {boolean} searchBackward - Include negative skips
   * @param {number} maxResults - Limit results for performance
   */
  search(searchTerm, minSkip, maxSkip, searchBackward = true, maxResults = 1000) {
    this.results = [];
    const termLength = searchTerm.length;
    
    if (!searchTerm || termLength === 0) {
      return this.results;
    }

    // Forward searches
    for (let skip = minSkip; skip <= maxSkip; skip++) {
      if (this.results.length >= maxResults) break;
      this.searchWithSkip(searchTerm, skip, termLength, maxResults);
    }

    // Backward searches
    if (searchBackward) {
      for (let skip = -minSkip; skip >= -maxSkip; skip--) {
        if (this.results.length >= maxResults) break;
        this.searchWithSkip(searchTerm, skip, termLength, maxResults);
      }
    }

    return this.results;
  }

  searchWithSkip(searchTerm, skip, termLength, maxResults) {
    const textLength = this.text.length;
    const absSkip = Math.abs(skip);
    
    // Calculate valid starting positions
    const maxStart = skip > 0 
      ? textLength - (termLength - 1) * skip
      : textLength - 1;

    const minStart = skip > 0 
      ? 0 
      : (termLength - 1) * absSkip;

    for (let start = (skip < 0 ? textLength - 1 : 0); 
         skip > 0 ? (start <= maxStart) : (start >= minStart); 
         skip > 0 ? start++ : start--) {
      
      if (this.matchesAtPosition(start, skip, searchTerm, termLength)) {
        const positions = this.getLetterPositions(start, skip, termLength);
        
        this.results.push({
          term: searchTerm,
          skip: skip,
          startPosition: start,
          endPosition: positions[positions.length - 1],
          positions: positions,
          sequence: this.extractSequence(start, skip, termLength)
        });

        if (this.results.length >= maxResults) return;
      }
    }
  }

  matchesAtPosition(start, skip, searchTerm, termLength) {
    for (let i = 0; i < termLength; i++) {
      const position = start + (i * skip);
      
      // Bounds check
      if (position < 0 || position >= this.text.length) {
        return false;
      }

      if (this.text[position] !== searchTerm[i]) {
        return false;
      }
    }
    return true;
  }

  getLetterPositions(start, skip, termLength) {
    const positions = [];
    for (let i = 0; i < termLength; i++) {
      positions.push(start + (i * skip));
    }
    return positions;
  }

  extractSequence(start, skip, length) {
    let sequence = '';
    for (let i = 0; i < length; i++) {
      const pos = start + (i * skip);
      if (pos >= 0 && pos < this.text.length) {
        sequence += this.text[pos];
      }
    }
    return sequence;
  }

  /**
   * Get statistics about search results
   */
  getStatistics() {
    if (this.results.length === 0) {
      return null;
    }

    const skips = this.results.map(r => Math.abs(r.skip));
    const avgSkip = skips.reduce((a, b) => a + b, 0) / skips.length;
    const minSkip = Math.min(...skips);
    const maxSkip = Math.max(...skips);

    return {
      totalResults: this.results.length,
      averageSkip: avgSkip.toFixed(2),
      minSkip: minSkip,
      maxSkip: maxSkip,
      forwardResults: this.results.filter(r => r.skip > 0).length,
      backwardResults: this.results.filter(r => r.skip < 0).length
    };
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.ELSEngine = ELSEngine;
}
