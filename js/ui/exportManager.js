// Export Manager - Handles data export functionality
class ExportManager {
  exportToCSV(results) {
    if (!results || results.length === 0) {
      alert('No results to export');
      return;
    }

    let csv = '';
    
    // Check if cluster results or regular results
    if (results[0].primary) {
      // Cluster results
      csv = 'Primary Term,Primary Skip,Primary Position,Related Terms,Compactness,Proximity Score\n';
      
      results.forEach(cluster => {
        const relatedTerms = cluster.related.map(r => 
          `${r.term}(${r.matches.length})`
        ).join(';');
        
        csv += `"${cluster.primary.term}",`;
        csv += `${cluster.primary.skip},`;
        csv += `${cluster.primary.startPosition},`;
        csv += `"${relatedTerms}",`;
        csv += `${cluster.compactness},`;
        csv += `${cluster.proximityScore}\n`;
      });
    } else {
      // Regular results
      csv = 'Term,Skip,Start Position,End Position,Sequence,Letter Positions\n';
      
      results.forEach(result => {
        csv += `"${result.term}",`;
        csv += `${result.skip},`;
        csv += `${result.startPosition},`;
        csv += `${result.endPosition},`;
        csv += `"${result.sequence}",`;
        csv += `"${result.positions.join(';')}"\n`;
      });
    }

    this.downloadFile(csv, 'bible-code-results.csv', 'text/csv');
  }

  exportToJSON(resultsData) {
    if (!resultsData) {
      alert('No results to export');
      return;
    }

    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        mode: resultsData.mode,
        searchParams: resultsData.params
      },
      results: resultsData.mode === 'cluster' ? resultsData.clusters : resultsData.results,
      statistics: resultsData.statistics || null
    };

    const json = JSON.stringify(exportData, null, 2);
    this.downloadFile(json, 'bible-code-results.json', 'application/json');
  }

  exportMatrixToHTML(matrix, highlightedResults, width) {
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bible Code Matrix Export</title>
  <style>
    body {
      font-family: 'Courier New', monospace;
      padding: 20px;
      background: #f5f5f5;
    }
    h1 {
      font-family: 'Segoe UI', sans-serif;
      color: #2c3e50;
    }
    .matrix-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow-x: auto;
    }
    .matrix {
      display: inline-grid;
      grid-template-columns: repeat(${width}, 1fr);
      gap: 2px;
      background: #bdc3c7;
      padding: 2px;
    }
    .matrix-cell {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      font-size: 14px;
    }
    .highlighted {
      background: #f39c12;
      color: white;
      font-weight: bold;
    }
    .info {
      margin-top: 20px;
      padding: 15px;
      background: #ecf0f1;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <h1>📖 Bible Code Matrix</h1>
  <div class="info">
    <strong>Export Date:</strong> ${new Date().toLocaleString()}<br>
    <strong>Matrix Width:</strong> ${width} columns<br>
    <strong>Highlighted Results:</strong> ${highlightedResults.length}
  </div>
  <div class="matrix-container">
    <div class="matrix">
`;

    // Build highlight set
    const highlightSet = new Set();
    highlightedResults.forEach(result => {
      result.positions.forEach(pos => highlightSet.add(pos));
    });

    // Build matrix
    for (const row of matrix) {
      for (let col = 0; col < row.letters.length; col++) {
        const position = row.startPosition + col;
        const isHighlighted = highlightSet.has(position);
        html += `<span class="matrix-cell ${isHighlighted ? 'highlighted' : ''}" title="Position: ${position}">${row.letters[col]}</span>`;
      }
    }

    html += `
    </div>
  </div>
</body>
</html>
`;

    this.downloadFile(html, 'bible-code-matrix.html', 'text/html');
  }

  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType + ';charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.ExportManager = ExportManager;
}
