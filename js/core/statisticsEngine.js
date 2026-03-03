// Statistical Analysis Engine
class StatisticsEngine {
  /**
   * Calculate expected frequency of a term in random text
   */
  calculateExpectedFrequency(term, textLength, alphabet) {
    const termLength = term.length;
    const alphabetSize = alphabet.length;
    
    // Probability of any specific letter sequence
    const probability = Math.pow(1 / alphabetSize, termLength);
    
    // Expected number of occurrences in text
    const expected = textLength * probability;
    
    return {
      probability: probability,
      expected: expected,
      termLength: termLength,
      textLength: textLength,
      alphabetSize: alphabetSize
    };
  }

  /**
   * Calculate basic statistics for search results
   */
  analyzeResults(results, textLength, alphabet) {
    if (!results || results.length === 0) {
      return {
        count: 0,
        message: 'No results to analyze'
      };
    }

    const term = results[0].term;
    const expected = this.calculateExpectedFrequency(term, textLength, alphabet);
    
    const skips = results.map(r => r.skip);
    const absSkips = skips.map(s => Math.abs(s));
    
    return {
      observedCount: results.length,
      expectedCount: expected.expected.toFixed(6),
      ratio: (results.length / expected.expected).toFixed(2),
      term: term,
      termLength: term.length,
      textLength: textLength,
      alphabetSize: alphabet.length,
      averageSkip: (absSkips.reduce((a, b) => a + b, 0) / absSkips.length).toFixed(2),
      minSkip: Math.min(...absSkips),
      maxSkip: Math.max(...absSkips),
      forwardCount: results.filter(r => r.skip > 0).length,
      backwardCount: results.filter(r => r.skip < 0).length,
      interpretation: this.interpretResults(results.length, expected.expected)
    };
  }

  interpretResults(observed, expected) {
    const ratio = observed / expected;
    
    if (expected < 0.000001) {
      return 'Term is very rare - statistical analysis not meaningful';
    } else if (ratio > 100) {
      return 'Observed count is significantly higher than expected';
    } else if (ratio > 10) {
      return 'Observed count is notably higher than expected';
    } else if (ratio > 2) {
      return 'Observed count is moderately higher than expected';
    } else if (ratio >= 0.5) {
      return 'Observed count is within expected range';
    } else {
      return 'Observed count is lower than expected';
    }
  }

  /**
   * Simple randomization test (scramble text and compare)
   */
  async runSimpleRandomizationTest(originalText, searchTerm, skipRange, iterations = 100) {
    const results = [];
    const engine = new ELSEngine(originalText);
    
    for (let i = 0; i < iterations; i++) {
      // Scramble text
      const scrambled = this.scrambleText(originalText);
      
      // Create new engine with scrambled text
      const scrambledEngine = new ELSEngine(scrambled);
      
      // Run same search
      const searchResults = scrambledEngine.search(
        searchTerm,
        skipRange.min,
        skipRange.max,
        true,
        1000
      );
      
      results.push(searchResults.length);
    }

    return this.analyzeRandomizationResults(results);
  }

  scrambleText(text) {
    const arr = text.split('');
    // Fisher-Yates shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  }

  analyzeRandomizationResults(results) {
    if (results.length === 0) {
      return null;
    }

    const sum = results.reduce((a, b) => a + b, 0);
    const mean = sum / results.length;
    
    const squaredDiffs = results.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / results.length;
    const stdDev = Math.sqrt(variance);
    
    return {
      iterations: results.length,
      mean: mean.toFixed(2),
      variance: variance.toFixed(2),
      stdDev: stdDev.toFixed(2),
      min: Math.min(...results),
      max: Math.max(...results),
      distribution: results
    };
  }

  /**
   * Calculate p-value (what proportion of randomized texts had >= observed count)
   */
  calculatePValue(observedCount, randomizationResults) {
    if (!randomizationResults || !randomizationResults.distribution) {
      return null;
    }

    const exceedingCount = randomizationResults.distribution.filter(
      count => count >= observedCount
    ).length;
    
    const pValue = exceedingCount / randomizationResults.distribution.length;
    
    return {
      pValue: pValue.toFixed(4),
      exceedingCount: exceedingCount,
      totalIterations: randomizationResults.distribution.length,
      significant: pValue < 0.05,
      interpretation: pValue < 0.05 
        ? 'Statistically significant (p < 0.05)' 
        : 'Not statistically significant'
    };
  }

  /**
   * Generate a statistical report
   */
  generateReport(actualResults, textLength, alphabet, randomizationResults = null) {
    const basicStats = this.analyzeResults(actualResults, textLength, alphabet);
    
    const report = {
      basicStatistics: basicStats,
      randomizationTest: null,
      pValue: null
    };

    if (randomizationResults) {
      report.randomizationTest = randomizationResults;
      report.pValue = this.calculatePValue(actualResults.length, randomizationResults);
    }

    return report;
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.StatisticsEngine = StatisticsEngine;
}
