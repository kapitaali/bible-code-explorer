// Search Manager - Coordinates search operations
class SearchManager {
  constructor() {
    this.currentSearch = null;
    this.isSearching = false;
  }

  async executeSearch(params) {
    if (this.isSearching) {
      throw new Error('Search already in progress');
    }

    this.isSearching = true;

    try {
      // Load text data
      const textData = await window.dataLoader.loadBookRange(
        params.language,
        params.book,
        params.chapterStart,
        params.chapterEnd
      );

      if (!textData || !textData.chapters || textData.chapters.length === 0) {
        throw new Error('No text data found for the specified range');
      }

      // Extract continuous text
      const { text, verseMap } = window.dataLoader.getContinuousText(textData);
      
      if (!text || text.length === 0) {
        throw new Error('No text available for search');
      }

      // Normalize search term
      const normalizedTerm = this.normalizeForLanguage(
        params.searchTerm,
        params.language
      );

      if (!normalizedTerm || normalizedTerm.length === 0) {
        throw new Error('Search term normalizes to empty string');
      }

      // Perform ELS search
      const engine = new ELSEngine(text);
      let results = engine.search(
        normalizedTerm,
        params.minSkip,
        params.maxSkip,
        params.includeNegative,
        params.maxResults
      );

      // If cluster mode, perform cluster analysis
      if (params.clusterMode && params.relatedTerms.length > 0) {
        const normalizedRelated = params.relatedTerms.map(t =>
          this.normalizeForLanguage(t, params.language)
        ).filter(t => t.length > 0);

        if (normalizedRelated.length > 0) {
          const analyzer = new ClusterAnalyzer(text);
          const clusters = analyzer.findClusters(
            results,
            normalizedRelated,
            params.proximityThreshold || 1000
          );
          
          // Return cluster results
          return {
            mode: 'cluster',
            clusters: clusters,
            text: text,
            verseMap: verseMap,
            params: params
          };
        }
      }

      // Return regular results
      return {
        mode: 'regular',
        results: results,
        text: text,
        verseMap: verseMap,
        params: params,
        statistics: engine.getStatistics()
      };

    } finally {
      this.isSearching = false;
    }
  }

  normalizeForLanguage(text, language) {
    if (!text) return '';
    
    switch(language) {
      case 'latin':
        return normalizeLatin(text);
      case 'kjv':
        return normalizeKJV(text);
      case 'finnish':
        return normalizeFinnish(text);
      case 'hebrew':
        return normalizeHebrew(text);
      case 'greek':
        return normalizeGreek(text);
      default:
        return text.toUpperCase().replace(/[^A-Z]/g, '');
    }
  }

  cancelSearch() {
    this.isSearching = false;
    this.currentSearch = null;
  }

  getLanguageConfig(language) {
    switch(language) {
      case 'latin':
        return window.LATIN_CONFIG;
      case 'kjv':
        return window.KJV_CONFIG;
      case 'finnish':
        return window.FINNISH_CONFIG;
      case 'hebrew':
        return window.HEBREW_CONFIG;
      case 'greek':
        return window.GREEK_CONFIG;
      default:
        return {
          name: 'Unknown',
          alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
          hasVowels: true,
          direction: 'ltr'
        };
    }
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.SearchManager = SearchManager;
}
