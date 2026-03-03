// Cluster Analysis for Related Terms
class ClusterAnalyzer {
  constructor(text) {
    this.text = text;
  }

  /**
   * Find clusters of related terms in proximity
   * @param {Array} primaryResults - ELS results for main term
   * @param {Array} relatedTerms - Terms to search near primary
   * @param {number} proximityThreshold - Maximum distance (in characters)
   */
  findClusters(primaryResults, relatedTerms, proximityThreshold = 1000) {
    const clusters = [];

    if (!relatedTerms || relatedTerms.length === 0) {
      return clusters;
    }

    for (const primary of primaryResults) {
      const cluster = {
        primary: primary,
        related: [],
        centerPosition: this.calculateCenter(primary.positions),
        compactness: 0,
        proximityScore: 0
      };

      // Search for each related term near this primary result
      for (const relatedTerm of relatedTerms) {
        if (!relatedTerm || relatedTerm.trim().length === 0) continue;
        
        const nearbyMatches = this.findNearbyMatches(
          primary,
          relatedTerm.trim(),
          proximityThreshold
        );
        
        if (nearbyMatches.length > 0) {
          cluster.related.push({
            term: relatedTerm.trim(),
            matches: nearbyMatches
          });
        }
      }

      // Only include clusters with at least one related term
      if (cluster.related.length > 0) {
        cluster.compactness = this.calculateClusterCompactness(cluster);
        cluster.proximityScore = this.calculateProximityScore(cluster, proximityThreshold);
        clusters.push(cluster);
      }
    }

    // Sort by compactness (tighter clusters first)
    return clusters.sort((a, b) => a.compactness - b.compactness);
  }

  calculateCenter(positions) {
    if (!positions || positions.length === 0) return 0;
    return Math.floor(
      positions.reduce((sum, pos) => sum + pos, 0) / positions.length
    );
  }

  findNearbyMatches(primaryResult, relatedTerm, threshold) {
    const matches = [];
    const centerPos = this.calculateCenter(primaryResult.positions);
    
    // Quick search with various skips around the primary result
    const engine = new ELSEngine(this.text);
    const searchResults = engine.search(relatedTerm, 1, 100, true, 100);
    
    // Filter to only those within threshold
    for (const result of searchResults) {
      const resultCenter = this.calculateCenter(result.positions);
      const distance = Math.abs(resultCenter - centerPos);
      
      if (distance <= threshold) {
        matches.push({
          ...result,
          distanceFromPrimary: distance
        });
      }
    }
    
    return matches;
  }

  calculateClusterCompactness(cluster) {
    // Measure how tightly packed all terms are
    const allPositions = [
      ...cluster.primary.positions,
      ...cluster.related.flatMap(r => 
        r.matches.flatMap(m => m.positions)
      )
    ];

    if (allPositions.length === 0) return Infinity;

    const min = Math.min(...allPositions);
    const max = Math.max(...allPositions);
    
    return max - min;
  }

  calculateProximityScore(cluster, threshold) {
    // Higher score = closer together (inverse of average distance)
    if (cluster.related.length === 0) return 0;
    
    const distances = cluster.related.flatMap(r =>
      r.matches.map(m => m.distanceFromPrimary)
    );
    
    const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
    
    // Normalize to 0-100 scale
    return Math.max(0, 100 * (1 - avgDistance / threshold));
  }

  /**
   * Generate a summary of the cluster
   */
  getClusterSummary(cluster) {
    return {
      primaryTerm: cluster.primary.term,
      primarySkip: cluster.primary.skip,
      primaryPosition: cluster.primary.startPosition,
      relatedTermsCount: cluster.related.length,
      relatedTerms: cluster.related.map(r => r.term),
      totalMatches: cluster.related.reduce((sum, r) => sum + r.matches.length, 0),
      compactness: cluster.compactness,
      proximityScore: cluster.proximityScore.toFixed(2)
    };
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.ClusterAnalyzer = ClusterAnalyzer;
}
