// ============================================================
// Gematria Engine
// Supports: Hebrew, Greek, Latin, English (Standard + Ordinal),
//           Finnish (Standard + Ordinal)
// ============================================================

class GematriaEngine {

  constructor() {
    this.tables = this.buildTables();
  }

  // ----------------------------------------------------------
  // VALUE TABLES
  // ----------------------------------------------------------

  buildTables() {
    return {

      // -------------------------------------------------------
      // HEBREW — Classical Mispar Hechrachi (absolute value)
      // Alef=1 ... Tet=9, Yod=10 ... Kuf=100, Resh=200, Shin=300, Tav=400
      // Final forms keep the same value as their standard form
      // -------------------------------------------------------
      hebrew: {
        name: 'Hebrew (Mispar Hechrachi)',
        description: 'Classical Hebrew gematria. Each letter has an absolute value.',
        map: {
          'א': 1,  'ב': 2,  'ג': 3,  'ד': 4,  'ה': 5,
          'ו': 6,  'ז': 7,  'ח': 8,  'ט': 9,  'י': 10,
          'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60,
          'ע': 70, 'פ': 80, 'צ': 90, 'ק': 100,'ר': 200,
          'ש': 300,'ת': 400,
          // Final forms — same value as base form
          'ך': 20, 'ם': 40, 'ן': 50, 'ף': 80, 'ץ': 90
        }
      },

      // Hebrew variant: Mispar Gadol — final forms get elevated values
      hebrew_gadol: {
        name: 'Hebrew (Mispar Gadol)',
        description: 'Final letters get elevated values: Kaf-final=500, Mem-final=600, Nun-final=700, Pe-final=800, Tsadi-final=900.',
        map: {
          'א': 1,  'ב': 2,  'ג': 3,  'ד': 4,  'ה': 5,
          'ו': 6,  'ז': 7,  'ח': 8,  'ט': 9,  'י': 10,
          'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60,
          'ע': 70, 'פ': 80, 'צ': 90, 'ק': 100,'ר': 200,
          'ש': 300,'ת': 400,
          'ך': 500,'ם': 600,'ן': 700,'ף': 800,'ץ': 900
        }
      },

      // Hebrew variant: Mispar Katan — reduce to single digit (digit sum)
      hebrew_katan: {
        name: 'Hebrew (Mispar Katan)',
        description: 'Reduced value: each letter value is reduced to a single digit.',
        map: {
          'א': 1,  'ב': 2,  'ג': 3,  'ד': 4,  'ה': 5,
          'ו': 6,  'ז': 7,  'ח': 8,  'ט': 9,  'י': 1,
          'כ': 2,  'ל': 3,  'מ': 4,  'נ': 5,  'ס': 6,
          'ע': 7,  'פ': 8,  'צ': 9,  'ק': 1,  'ר': 2,
          'ש': 3,  'ת': 4,
          'ך': 2,  'ם': 4,  'ן': 5,  'ף': 8,  'ץ': 9
        }
      },

      // -------------------------------------------------------
      // GREEK — Isopsephy (classical)
      // Alpha=1...Theta=9, Iota=10...Koppa=90, Rho=100...Sampi=900
      // Using standard 24-letter alphabet (no archaic letters)
      // -------------------------------------------------------
      greek: {
        name: 'Greek (Isopsephy)',
        description: 'Classical Greek isopsephy. Alpha=1, Beta=2 ... Omega=800.',
        map: {
          'Α': 1,   'Β': 2,   'Γ': 3,   'Δ': 4,   'Ε': 5,
          'Ζ': 7,   'Η': 8,   'Θ': 9,   'Ι': 10,  'Κ': 20,
          'Λ': 30,  'Μ': 40,  'Ν': 50,  'Ξ': 60,  'Ο': 70,
          'Π': 80,  'Ρ': 100, 'Σ': 200, 'Τ': 300, 'Υ': 400,
          'Φ': 500, 'Χ': 600, 'Ψ': 700, 'Ω': 800,
          // lowercase (normalized text should be uppercase, but just in case)
          'α': 1,   'β': 2,   'γ': 3,   'δ': 4,   'ε': 5,
          'ζ': 7,   'η': 8,   'θ': 9,   'ι': 10,  'κ': 20,
          'λ': 30,  'μ': 40,  'ν': 50,  'ξ': 60,  'ο': 70,
          'π': 80,  'ρ': 100, 'σ': 200, 'ς': 200, 'τ': 300,
          'υ': 400, 'φ': 500, 'χ': 600, 'ψ': 700, 'ω': 800
        }
      },

      // -------------------------------------------------------
      // LATIN — Literae Notae (traditional)
      // Only letters used as Roman numerals have values;
      // others are 0. This is the classical system.
      // Alternative: simple A=1..Z=24 ordinal also provided.
      // -------------------------------------------------------
      latin: {
        name: 'Latin (Literae Notae)',
        description: 'Traditional Latin gematria using Roman numeral values: I=1, V=5, X=10, L=50, C=100, D=500, M=1000.',
        map: {
          'A': 0,  'B': 0,  'C': 100,'D': 500,'E': 0,
          'F': 0,  'G': 0,  'H': 0,  'I': 1,  'J': 1,
          'K': 0,  'L': 50, 'M': 1000,'N': 0, 'O': 0,
          'P': 0,  'Q': 0,  'R': 0,  'S': 0,  'T': 0,
          'U': 5,  'V': 5,  'W': 0,  'X': 10, 'Y': 0,
          'Z': 0
        }
      },

      // Latin ordinal: A=1, B=2 ... Z=26 (skipping J, using I=J, U=V classical)
      latin_ordinal: {
        name: 'Latin (Ordinal A=1)',
        description: 'Simple ordinal value. A=1, B=2, C=3 ... Z=26.',
        map: this._buildOrdinalMap('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1)
      },

      // -------------------------------------------------------
      // ENGLISH — Standard (A=1..Z=26) and other variants
      // -------------------------------------------------------
      english: {
        name: 'English (Standard A=1)',
        description: 'Standard English gematria. A=1, B=2, C=3 ... Z=26.',
        map: this._buildOrdinalMap('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1)
      },

      english_ordinal: {
        name: 'English (Ordinal)',
        description: 'Same as Standard. A=1 through Z=26.',
        map: this._buildOrdinalMap('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1)
      },

      english_reduction: {
        name: 'English (Reduction)',
        description: 'Values reduced so each letter maps to 1–9. A=1..I=9, J=1..R=9, S=1..Z=8.',
        map: this._buildReductionMap('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
      },

      english_reverse: {
        name: 'English (Reverse)',
        description: 'Reverse ordinal. Z=1, Y=2 ... A=26.',
        map: this._buildOrdinalMap('ZYXWVUTSRQPONMLKJIHGFEDCBA', 1,
              'ABCDEFGHIJKLMNOPQRSTUVWXYZ')
      },

      // -------------------------------------------------------
      // FINNISH — ordinal based on Finnish alphabet order
      // Finnish alphabet: A B C D E F G H I J K L M N O P Q R S T U V W X Y Z Å Ä Ö
      // Standard: A=1...Z=26, Å=27, Ä=28, Ö=29
      // -------------------------------------------------------
      finnish: {
        name: 'Finnish (Standard A=1)',
        description: 'Finnish ordinal gematria including Å=27, Ä=28, Ö=29.',
        map: this._buildOrdinalMap('ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ', 1)
      },

      finnish_reduction: {
        name: 'Finnish (Reduction)',
        description: 'Finnish values reduced to 1–9.',
        map: this._buildReductionMap('ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ')
      }
    };
  }

  // ----------------------------------------------------------
  // MAP BUILDER HELPERS
  // ----------------------------------------------------------

  _buildOrdinalMap(orderedLetters, startValue, keyLetters = null) {
    const map = {};
    const keys = keyLetters ? keyLetters.split('') : orderedLetters.split('');
    orderedLetters.split('').forEach((letter, i) => {
      map[keys[i]] = startValue + i;
    });
    return map;
  }

  _buildReductionMap(orderedLetters) {
    const map = {};
    orderedLetters.split('').forEach((letter, i) => {
      let val = (i + 1) % 9;
      if (val === 0) val = 9;
      map[letter] = val;
    });
    return map;
  }

  // ----------------------------------------------------------
  // CORE CALCULATION
  // ----------------------------------------------------------

  /**
   * Calculate gematria value of a string using a named system.
   * @param {string} text - Input text (will be uppercased)
   * @param {string} system - Key from this.tables
   * @returns {number}
   */
  calculate(text, system) {
    if (!text) return 0;
    const table = this.tables[system];
    if (!table) throw new Error(`Unknown gematria system: ${system}`);

    let total = 0;
    for (const char of text) {
      const upper = char.toUpperCase();
      total += table.map[upper] || table.map[char] || 0;
    }
    return total;
  }

  /**
   * Calculate using ALL available systems for a language group.
   * @param {string} text
   * @param {string} languageGroup - 'hebrew' | 'greek' | 'latin' | 'english' | 'finnish'
   * @returns {Array<{system, name, value}>}
   */
  calculateAll(text, languageGroup) {
    const results = [];
    for (const [key, table] of Object.entries(this.tables)) {
      if (key.startsWith(languageGroup)) {
        results.push({
          system: key,
          name: table.name,
          value: this.calculate(text, key)
        });
      }
    }
    return results;
  }

  /**
   * Get value of a single character.
   */
  charValue(char, system) {
    const table = this.tables[system];
    if (!table) return 0;
    const upper = char.toUpperCase();
    return table.map[upper] || table.map[char] || 0;
  }

  /**
   * Return the gematria breakdown: each letter with its value.
   * @returns {Array<{letter, value}>}
   */
  breakdown(text, system) {
    const table = this.tables[system];
    if (!table) return [];
    return Array.from(text).map(char => {
      const upper = char.toUpperCase();
      return {
        letter: char,
        value: table.map[upper] || table.map[char] || 0
      };
    });
  }

  // ----------------------------------------------------------
  // SEARCH: find words/sequences in a verse map whose
  // gematria value matches a target value
  // ----------------------------------------------------------

  /**
   * Search all words in verseMap for a target gematria value.
   * Works on original (non-normalized) verse text so that
   * word boundaries are preserved.
   *
   * @param {Array}  verseMap   - from dataLoader.getContinuousText()
   * @param {number} targetValue
   * @param {string} system     - gematria system key
   * @param {Array}  bibleData  - books array to get raw verse text
   * @returns {Array<{word, value, system, verseRef, verseText}>}
   */
  searchByValue(verseMap, targetValue, system, rawVerses) {
    const results = [];

    for (const verseInfo of verseMap) {
      const rawText = verseInfo.text || '';
      const words = rawText.split(/\s+/).filter(w => w.length > 0);

      for (const word of words) {
        // Strip punctuation for calculation but keep original for display
        const clean = word.replace(/[^\p{L}]/gu, '');
        if (!clean) continue;

        const val = this.calculate(clean, system);
        if (val === targetValue) {
          results.push({
            word: word,
            cleanWord: clean,
            value: val,
            system: system,
            verseRef: `${verseInfo.chapter}:${verseInfo.verse}`,
            chapter: verseInfo.chapter,
            verse: verseInfo.verse,
            verseText: rawText
          });
        }
      }
    }

    return results;
  }

  /**
   * Search consecutive letter spans in normalized continuous text
   * for sequences whose gematria equals targetValue.
   * minLen / maxLen control sequence length in letters.
   *
   * @returns {Array<{sequence, value, startPosition, endPosition, verseRef}>}
   */
  searchSequencesByValue(continuousText, verseMap, targetValue, system, minLen = 1, maxLen = 10) {
    const results = [];
    const text = continuousText;

    for (let start = 0; start < text.length; start++) {
      let running = 0;
      for (let len = 1; len <= maxLen && (start + len) <= text.length; len++) {
        const char = text[start + len - 1];
        running += this.charValue(char, system);

        if (len >= minLen && running === targetValue) {
          // Find verse reference for this position
          const verseRef = this._findVerseRef(start, verseMap);
          results.push({
            sequence: text.slice(start, start + len),
            value: running,
            startPosition: start,
            endPosition: start + len - 1,
            positions: Array.from({ length: len }, (_, i) => start + i),
            verseRef: verseRef
          });
        }

        // Early termination: if running > target and all values positive, no point continuing
        if (running > targetValue) break;
      }
    }

    return results;
  }

  _findVerseRef(position, verseMap) {
    for (const v of verseMap) {
      if (position >= v.start && position <= v.end) {
        return `${v.chapter}:${v.verse}`;
      }
    }
    return '?';
  }

  // ----------------------------------------------------------
  // UTILITY
  // ----------------------------------------------------------

  /**
   * Reduce a number to a single digit (like Mispar Katan / digital root)
   */
  digitalRoot(n) {
    if (n === 0) return 0;
    return 1 + (n - 1) % 9;
  }

  /**
   * List all available systems for a language group
   */
  getSystemsForLanguage(lang) {
    return Object.entries(this.tables)
      .filter(([key]) => key.startsWith(lang))
      .map(([key, t]) => ({ key, name: t.name, description: t.description }));
  }

  /**
   * List all systems
   */
  getAllSystems() {
    return Object.entries(this.tables).map(([key, t]) => ({
      key,
      name: t.name,
      description: t.description
    }));
  }

  /**
   * Map app language key to default gematria system
   */
  defaultSystemForLanguage(appLang) {
    const defaults = {
      hebrew:  'hebrew',
      greek:   'greek',
      latin:   'latin_ordinal',
      kjv:     'english',
      finnish: 'finnish'
    };
    return defaults[appLang] || 'english';
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.GematriaEngine = GematriaEngine;
}
