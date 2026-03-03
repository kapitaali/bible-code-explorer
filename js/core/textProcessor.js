// Text Processor - Utility functions for text manipulation
class TextProcessor {
  /**
   * Normalize text based on language configuration
   */
  static normalize(text, languageConfig) {
    if (!text || !languageConfig || !languageConfig.normalize) {
      return text;
    }
    return languageConfig.normalize(text);
  }

  /**
   * Count letter frequencies in text
   */
  static analyzeFrequencies(text, alphabet) {
    const frequencies = {};
    alphabet.split('').forEach(letter => {
      frequencies[letter] = 0;
    });

    for (const char of text) {
      if (frequencies.hasOwnProperty(char)) {
        frequencies[char]++;
      }
    }

    const total = Object.values(frequencies).reduce((a, b) => a + b, 0);
    const percentages = {};
    
    for (const [letter, count] of Object.entries(frequencies)) {
      percentages[letter] = total > 0 ? ((count / total) * 100).toFixed(2) : 0;
    }

    return {
      counts: frequencies,
      percentages: percentages,
      totalLetters: total
    };
  }

  /**
   * Split text into chunks for processing
   */
  static chunkText(text, chunkSize) {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.substring(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Find all occurrences of a substring
   */
  static findAllOccurrences(text, searchString) {
    const positions = [];
    let position = 0;

    while ((position = text.indexOf(searchString, position)) !== -1) {
      positions.push(position);
      position += 1; // Move to next character to allow overlapping matches
    }

    return positions;
  }

  /**
   * Calculate text statistics
   */
  static getTextStatistics(text) {
    return {
      totalCharacters: text.length,
      uniqueCharacters: new Set(text.split('')).size,
      entropy: this.calculateEntropy(text)
    };
  }

  /**
   * Calculate Shannon entropy of text
   */
  static calculateEntropy(text) {
    if (!text || text.length === 0) return 0;

    const frequencies = {};
    for (const char of text) {
      frequencies[char] = (frequencies[char] || 0) + 1;
    }

    let entropy = 0;
    const length = text.length;

    for (const count of Object.values(frequencies)) {
      const probability = count / length;
      entropy -= probability * Math.log2(probability);
    }

    return entropy.toFixed(4);
  }

  /**
   * Remove specified characters from text
   */
  static removeCharacters(text, charactersToRemove) {
    const regex = new RegExp(`[${charactersToRemove}]`, 'g');
    return text.replace(regex, '');
  }

  /**
   * Extract substring using positions array
   */
  static extractByPositions(text, positions) {
    return positions.map(pos => text[pos]).join('');
  }

  /**
   * Reverse text
   */
  static reverse(text) {
    return text.split('').reverse().join('');
  }

  /**
   * Get context around a position
   */
  static getContext(text, position, contextLength = 50) {
    const start = Math.max(0, position - contextLength);
    const end = Math.min(text.length, position + contextLength + 1);
    
    return {
      before: text.substring(start, position),
      char: text[position],
      after: text.substring(position + 1, end),
      full: text.substring(start, end)
    };
  }

  /**
   * Validate if text contains only allowed characters
   */
  static validateText(text, alphabet) {
    const allowedChars = new Set(alphabet.split(''));
    
    for (const char of text) {
      if (!allowedChars.has(char)) {
        return {
          valid: false,
          invalidChar: char,
          position: text.indexOf(char)
        };
      }
    }

    return { valid: true };
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.TextProcessor = TextProcessor;
}
