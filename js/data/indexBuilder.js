// Index Builder - Creates search indices for faster lookups
class IndexBuilder {
  constructor() {
    this.indices = new Map();
  }

  /**
   * Build n-gram index for faster searching
   */
  buildNGramIndex(text, n = 3) {
    const index = new Map();
    
    for (let i = 0; i <= text.length - n; i++) {
      const ngram = text.substring(i, i + n);
      
      if (!index.has(ngram)) {
        index.set(ngram, []);
      }
      index.get(ngram).push(i);
    }

    return index;
  }

  /**
   * Build character position index
   */
  buildCharacterIndex(text) {
    const index = new Map();
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      if (!index.has(char)) {
        index.set(char, []);
      }
      index.get(char).push(i);
    }

    return index;
  }

  /**
   * Build verse position index
   */
  buildVerseIndex(verseMap) {
    const index = {
      byChapter: new Map(),
      byVerse: new Map(),
      byPosition: []
    };

    for (const verse of verseMap) {
      // Index by chapter
      const chapterKey = verse.chapter;
      if (!index.byChapter.has(chapterKey)) {
        index.byChapter.set(chapterKey, []);
      }
      index.byChapter.get(chapterKey).push(verse);

      // Index by verse
      const verseKey = `${verse.chapter}:${verse.verse}`;
      index.byVerse.set(verseKey, verse);

      // Position array for binary search
      index.byPosition.push({
        start: verse.start,
        end: verse.end,
        reference: verseKey
      });
    }

    // Sort position array
    index.byPosition.sort((a, b) => a.start - b.start);

    return index;
  }

  /**
   * Find verse reference for a given position using binary search
   */
  findVerseByPosition(position, verseIndex) {
    const positions = verseIndex.byPosition;
    let left = 0;
    let right = positions.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const verse = positions[mid];

      if (position >= verse.start && position <= verse.end) {
        return verse.reference;
      } else if (position < verse.start) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    return null;
  }

  /**
   * Cache index for a text
   */
  cacheIndex(textId, indexType, index) {
    const key = `${textId}-${indexType}`;
    this.indices.set(key, index);
  }

  /**
   * Retrieve cached index
   */
  getCachedIndex(textId, indexType) {
    const key = `${textId}-${indexType}`;
    return this.indices.get(key);
  }

  /**
   * Clear all indices
   */
  clearIndices() {
    this.indices.clear();
  }

  /**
   * Get memory usage of indices (approximate)
   */
  getMemoryUsage() {
    let totalSize = 0;
    
    for (const [key, index] of this.indices) {
      // Rough estimation
      totalSize += JSON.stringify(index).length;
    }

    return {
      totalBytes: totalSize,
      totalKB: (totalSize / 1024).toFixed(2),
      totalMB: (totalSize / 1024 / 1024).toFixed(2),
      indexCount: this.indices.size
    };
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.IndexBuilder = IndexBuilder;
}
