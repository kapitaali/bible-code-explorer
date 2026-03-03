// Data Loader for Bible Texts
class DataLoader {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
    this.sampleData = this.createSampleData();
  }

  /**
   * Create sample Bible data for demonstration
   * In production, this would load from JSON files
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

  async loadBibleText(language) {
    // Check cache first
    if (this.cache.has(language)) {
      return this.cache.get(language);
    }

    // Check if already loading
    if (this.loadingPromises.has(language)) {
      return this.loadingPromises.get(language);
    }

    // For now, return sample data
    // In production, this would fetch from server
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        const data = this.sampleData[language];
        if (data) {
          this.cache.set(language, data);
          resolve(data);
        } else {
          resolve(null);
        }
        this.loadingPromises.delete(language);
      }, 100); // Simulate network delay
    });

    this.loadingPromises.set(language, promise);
    return promise;
  }

  async loadBookRange(language, bookId, startChapter, endChapter) {
    const fullText = await this.loadBibleText(language);
    if (!fullText) return null;
    
    const book = fullText.books.find(b => b.id === bookId);
    if (!book) return null;
    
    return {
      ...book,
      chapters: book.chapters.filter(ch => 
        ch.number >= startChapter && ch.number <= endChapter
      )
    };
  }

  getContinuousText(bibleData) {
    if (!bibleData || !bibleData.chapters) return '';
    
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

  getTestament(bookId) {
    // Simple mapping - in production would be more comprehensive
    const otBooks = ['gen', 'exo', 'lev', 'num', 'deu'];
    return otBooks.includes(bookId) ? 'OT' : 'NT';
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.DataLoader = DataLoader;
}
