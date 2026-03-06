// Data Loader for Bible Texts
class DataLoader {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
    this.sampleData = this.createSampleData();
    this.dataDirectory = 'data/texts/';
  }

  /**
   * Create sample Bible data for fallback/demonstration
   * Used when JSON files are not available
   */
  createSampleData() {
    const sampleData = {
      latin: {
        metadata: {
          language: 'latin',
          version: 'Vulgate',
          alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
          textDirection: 'ltr',
          hasVowels: true
        },
        books: [
          {
            id: 'gen',
            name: 'Genesis',
            nativeName: 'Liber Genesis',
            testament: 'OT',
            chapters: [
              {
                number: 1,
                verses: [
                  {
                    number: 1,
                    text: 'In principio creavit Deus caelum et terram',
                    normalized: normalizeLatin('In principio creavit Deus caelum et terram')
                  },
                  {
                    number: 2,
                    text: 'Terra autem erat inanis et vacua et tenebrae super faciem abyssi et spiritus Dei ferebatur super aquas',
                    normalized: normalizeLatin('Terra autem erat inanis et vacua et tenebrae super faciem abyssi et spiritus Dei ferebatur super aquas')
                  },
                  {
                    number: 3,
                    text: 'Dixitque Deus fiat lux et facta est lux',
                    normalized: normalizeLatin('Dixitque Deus fiat lux et facta est lux')
                  }
                ]
              }
            ]
          }
        ]
      },
      kjv: {
        metadata: {
          language: 'english',
          version: 'King James',
          alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
          textDirection: 'ltr',
          hasVowels: true
        },
        books: [
          {
            id: 'gen',
            name: 'Genesis',
            nativeName: 'Genesis',
            testament: 'OT',
            chapters: [
              {
                number: 1,
                verses: [
                  {
                    number: 1,
                    text: 'In the beginning God created the heaven and the earth',
                    normalized: normalizeKJV('In the beginning God created the heaven and the earth')
                  },
                  {
                    number: 2,
                    text: 'And the earth was without form and void and darkness was upon the face of the deep And the Spirit of God moved upon the face of the waters',
                    normalized: normalizeKJV('And the earth was without form and void and darkness was upon the face of the deep And the Spirit of God moved upon the face of the waters')
                  },
                  {
                    number: 3,
                    text: 'And God said Let there be light and there was light',
                    normalized: normalizeKJV('And God said Let there be light and there was light')
                  }
                ]
              }
            ]
          }
        ]
      },
      finnish: {
        metadata: {
          language: 'finnish',
          version: 'Finnish Bible',
          alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÅ',
          textDirection: 'ltr',
          hasVowels: true
        },
        books: [
          {
            id: 'gen',
            name: 'Genesis',
            nativeName: '1. Mooseksen kirja',
            testament: 'OT',
            chapters: [
              {
                number: 1,
                verses: [
                  {
                    number: 1,
                    text: 'Alussa loi Jumala taivaan ja maan',
                    normalized: normalizeFinnish('Alussa loi Jumala taivaan ja maan')
                  },
                  {
                    number: 2,
                    text: 'Ja maa oli autio ja tyhjä ja pimeys oli syvyyden päällä ja Jumalan Henki liikkui vetten päällä',
                    normalized: normalizeFinnish('Ja maa oli autio ja tyhjä ja pimeys oli syvyyden päällä ja Jumalan Henki liikkui vetten päällä')
                  },
                  {
                    number: 3,
                    text: 'Ja Jumala sanoi Tulkoon valkeus ja valkeus tuli',
                    normalized: normalizeFinnish('Ja Jumala sanoi Tulkoon valkeus ja valkeus tuli')
                  }
                ]
              }
            ]
          }
        ]
      },
      hebrew: {
        metadata: {
          language: 'hebrew',
          version: 'Hebrew Bible',
          alphabet: 'אבגדהוזחטיכלמנסעפצקרשת',
          textDirection: 'rtl',
          hasVowels: false
        },
        books: [
          {
            id: 'gen',
            name: 'Genesis',
            nativeName: 'בראשית',
            testament: 'OT',
            chapters: [
              {
                number: 1,
                verses: [
                  {
                    number: 1,
                    text: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ',
                    normalized: normalizeHebrew('בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ')
                  },
                  {
                    number: 2,
                    text: 'וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ וְחֹשֶׁךְ עַל־פְּנֵי תְהוֹם וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל־פְּנֵי הַמָּיִם',
                    normalized: normalizeHebrew('וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ וְחֹשֶׁךְ עַל־פְּנֵי תְהוֹם וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל־פְּנֵי הַמָּיִם')
                  },
                  {
                    number: 3,
                    text: 'וַיֹּאמֶר אֱלֹהִים יְהִי אוֹר וַיְהִי־אוֹר',
                    normalized: normalizeHebrew('וַיֹּאמֶר אֱלֹהִים יְהִי אוֹר וַיְהִי־אוֹר')
                  }
                ]
              }
            ]
          }
        ]
      },
      greek: {
        metadata: {
          language: 'greek',
          version: 'Greek New Testament',
          alphabet: 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ',
          textDirection: 'ltr',
          hasVowels: true
        },
        books: [
          {
            id: 'mat',
            name: 'Matthew',
            nativeName: 'Κατά Ματθαίον',
            testament: 'NT',
            chapters: [
              {
                number: 1,
                verses: [
                  {
                    number: 1,
                    text: 'Βίβλος γενέσεως Ἰησοῦ Χριστοῦ υἱοῦ Δαυὶδ υἱοῦ Ἀβραάμ',
                    normalized: normalizeGreek('Βίβλος γενέσεως Ἰησοῦ Χριστοῦ υἱοῦ Δαυὶδ υἱοῦ Ἀβραάμ')
                  }
                ]
              }
            ]
          }
        ]
      }
    };

    return sampleData;
  }

  /**
   * Get the filename for a language's Bible data
   */
  getFilename(language) {
    const filenameMap = {
      'latin': 'latin_bible.json',
      'kjv': 'kjv.json',
      'finnish': 'finnish_bible.json',
      'hebrew': 'hebrew_ot.json',
      'greek': 'greek_nt.json'
    };
    return filenameMap[language] || `${language}_bible.json`;
  }

  /**
   * Load Bible text from JSON file, with fallback to sample data
   */
  async loadBibleText(language) {
    // Check cache first
    if (this.cache.has(language)) {
      console.log(`✓ Using cached data for ${language}`);
      return this.cache.get(language);
    }

    // Check if already loading
    if (this.loadingPromises.has(language)) {
      return this.loadingPromises.get(language);
    }

    // Create loading promise
    const promise = this.fetchBibleData(language);
    this.loadingPromises.set(language, promise);

    try {
      const data = await promise;
      this.cache.set(language, data);
      return data;
    } finally {
      this.loadingPromises.delete(language);
    }
  }

  /**
   * Fetch Bible data from JSON file with fallback to stub data
   */
  async fetchBibleData(language) {
    const filename = this.getFilename(language);
    const url = `${this.dataDirectory}${filename}`;

    console.log(`📥 Attempting to load ${language} from: ${url}`);

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Validate the loaded data
      if (!this.validateBibleData(data)) {
        throw new Error('Invalid Bible data structure');
      }

      // Normalize verses if not already normalized
      this.ensureNormalizedText(data, language);

      console.log(`✅ Successfully loaded ${language} from JSON file`);
      console.log(`   Books: ${data.books.length}, Testament: ${data.books[0]?.testament || 'Unknown'}`);
      
      return data;

    } catch (error) {
      console.warn(`⚠️ Failed to load ${language} from JSON: ${error.message}`);
      console.log(`📋 Using stub data for ${language} instead`);
      
      // Fallback to sample data
      const stubData = this.sampleData[language];
      
      if (stubData) {
        return stubData;
      } else {
        throw new Error(`No data available for language: ${language}`);
      }
    }
  }

  /**
   * Validate Bible data structure
   */
  validateBibleData(data) {
    if (!data || typeof data !== 'object') {
      return false;
    }

    if (!data.metadata || !data.books || !Array.isArray(data.books)) {
      return false;
    }

    if (data.books.length === 0) {
      return false;
    }

    // Check first book structure
    const firstBook = data.books[0];
    if (!firstBook.id || !firstBook.chapters || !Array.isArray(firstBook.chapters)) {
      return false;
    }

    return true;
  }

  /**
   * Ensure all verses have normalized text
   */
  ensureNormalizedText(data, language) {
    // Get the appropriate normalization function
    let normalizeFunc;
    switch(language) {
      case 'latin':
        normalizeFunc = normalizeLatin;
        break;
      case 'kjv':
        normalizeFunc = normalizeKJV;
        break;
      case 'finnish':
        normalizeFunc = normalizeFinnish;
        break;
      case 'hebrew':
        normalizeFunc = normalizeHebrew;
        break;
      case 'greek':
        normalizeFunc = normalizeGreek;
        break;
      default:
        normalizeFunc = (text) => text.toUpperCase().replace(/[^A-Z]/g, '');
    }

    // Process all verses
    for (const book of data.books) {
      for (const chapter of book.chapters) {
        for (const verse of chapter.verses) {
          if (!verse.normalized || verse.normalized.length === 0) {
            verse.normalized = normalizeFunc(verse.text || '');
          }
        }
      }
    }
  }

  /**
   * Load a specific book range from the Bible
   */
  async loadBookRange(language, bookId, startChapter, endChapter) {
    const fullText = await this.loadBibleText(language);
    if (!fullText) return null;
    
    const book = fullText.books.find(b => b.id === bookId);
    if (!book) {
      console.warn(`Book ${bookId} not found in ${language} Bible`);
      return null;
    }
    
    return {
      ...book,
      chapters: book.chapters.filter(ch => 
        ch.number >= startChapter && ch.number <= endChapter
      )
    };
  }

  /**
   * Extract continuous normalized text from Bible data
   */
  getContinuousText(bibleData) {
    if (!bibleData || !bibleData.chapters) return { text: '', verseMap: [] };
    
    let continuous = '';
    const verseMap = [];
    let currentPosition = 0;

    for (const chapter of bibleData.chapters) {
      for (const verse of chapter.verses) {
        const normalized = verse.normalized || '';
        const startPos = currentPosition;
        const endPos = currentPosition + normalized.length - 1;
        
        verseMap.push({
          start: startPos,
          end: endPos,
          book: bibleData.id,
          chapter: chapter.number,
          verse: verse.number,
          text: verse.text
        });
        
        continuous += normalized;
        currentPosition += normalized.length;
      }
    }

    return { text: continuous, verseMap: verseMap };
  }

  /**
   * Determine testament from book ID
   */
  getTestament(bookId) {
    // Old Testament books
    const otBooks = [
      'gen', 'exo', 'lev', 'num', 'deu', 'jos', 'jdg', 'rut', '1sa', '2sa',
      '1ki', '2ki', '1ch', '2ch', 'ezr', 'neh', 'est', 'job', 'psa', 'pro',
      'ecc', 'sng', 'isa', 'jer', 'lam', 'ezk', 'dan', 'hos', 'jol', 'amo',
      'oba', 'jon', 'mic', 'nam', 'hab', 'zep', 'hag', 'zec', 'mal'
    ];
    
    // New Testament books
    const ntBooks = [
      'mat', 'mrk', 'luk', 'jhn', 'act', 'rom', '1co', '2co', 'gal', 'eph',
      'php', 'col', '1th', '2th', '1ti', '2ti', 'tit', 'phm', 'heb', 'jas',
      '1pe', '2pe', '1jn', '2jn', '3jn', 'jud', 'rev'
    ];
    
    return otBooks.includes(bookId) ? 'OT' : 
           ntBooks.includes(bookId) ? 'NT' : 'OT'; // Default to OT
  }

  /**
   * Get available books for a language
   */
  async getAvailableBooks(language) {
    try {
      const data = await this.loadBibleText(language);
      if (!data || !data.books) return [];
      
      return data.books.map(book => ({
        id: book.id,
        name: book.name,
        nativeName: book.nativeName,
        testament: book.testament,
        chapterCount: book.chapters.length
      }));
    } catch (error) {
      console.error(`Failed to get books for ${language}:`, error);
      return [];
    }
  }

  /**
   * Clear cache (useful for development/debugging)
   */
  clearCache() {
    this.cache.clear();
    this.loadingPromises.clear();
    console.log('📦 Cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      cachedLanguages: Array.from(this.cache.keys()),
      cacheSize: this.cache.size,
      loading: Array.from(this.loadingPromises.keys())
    };
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.DataLoader = DataLoader;
}
