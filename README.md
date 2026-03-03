# 📖 Bible Code Explorer

A multilingual web-based tool for exploring Equidistant Letter Sequences (ELS) in biblical texts. Built with vanilla JavaScript for educational and research purposes.

## ⚠️ Important Disclaimer

This tool is designed for **educational demonstration only**. Bible Code research (ELS analysis) is **not scientifically validated** and results should be interpreted with extreme skepticism. Similar patterns can be found in any sufficiently long text.

## ✨ Features

- **Multi-Language Support**
  - Latin (Vulgate)
  - King James English
  - Finnish Bible
  - Hebrew (side-by-side for Old Testament)
  - Greek (side-by-side for New Testament)

- **Search Capabilities**
  - ELS (Equidistant Letter Sequence) search with variable skip intervals
  - Forward and backward search directions
  - Cluster analysis for finding related terms in proximity
  - Configurable search parameters

- **Visualization**
  - Text view with highlighted results
  - Matrix view with auto-optimization
  - Side-by-side language comparison with word alignment
  - Interactive highlighting

- **Export & Analysis**
  - Export results to CSV
  - Export results to JSON
  - Export matrix to HTML
  - Statistical analysis tools

## 🚀 Getting Started

### Installation

1. Clone or download this repository
2. No build process required - pure vanilla JavaScript!
3. Open `index.html` in a modern web browser

### Requirements

- Modern web browser with ES6+ support
- JavaScript enabled
- Recommended: Chrome 80+, Firefox 75+, Safari 13+, or Edge 80+

## 📁 Project Structure

```
bible-code-explorer/
│
├── index.html                      # Main entry point
│
├── css/
│   ├── main.css                   # Core styles
│   ├── layout.css                 # Layout grid system
│   └── components.css             # UI components
│
├── js/
│   ├── app.js                     # Application initialization
│   │
│   ├── core/                      # Core algorithms
│   │   ├── elsEngine.js          # ELS search algorithm
│   │   ├── matrixGenerator.js    # Matrix visualization
│   │   ├── clusterAnalyzer.js    # Cluster analysis
│   │   ├── statisticsEngine.js   # Statistical tools
│   │   ├── textProcessor.js      # Text utilities
│   │   └── searchManager.js      # Search coordination
│   │
│   ├── languages/                 # Language handlers
│   │   ├── latinHandler.js       # Latin normalization
│   │   ├── kjvHandler.js         # English normalization
│   │   ├── finnishHandler.js     # Finnish normalization
│   │   ├── hebrewHandler.js      # Hebrew normalization
│   │   └── greekHandler.js       # Greek normalization
│   │
│   ├── ui/                        # User interface
│   │   ├── layoutManager.js      # Layout controller
│   │   ├── displayManager.js     # Display rendering
│   │   ├── alignmentManager.js   # Side-by-side alignment
│   │   └── exportManager.js      # Export functionality
│   │
│   └── data/                      # Data management
│       ├── dataLoader.js         # Bible text loading
│       └── indexBuilder.js       # Search indices
│
├── data/                          # Bible text data (JSON)
│   └── texts/
│       ├── latin_bible.json
│       ├── kjv.json
│       ├── finnish_bible.json
│       ├── hebrew_ot.json
│       └── greek_nt.json
│
└── README.md                      # This file
```

## 🎯 How to Use

### Basic Search

1. **Select Language**: Choose your primary language from the dropdown (top-right)
2. **Choose Text Range**: Select book and chapter range in the control panel
3. **Enter Search Term**: Type the word you want to search for
4. **Set Parameters**: Configure skip interval range (e.g., 1 to 50)
5. **Click Search**: Results will appear in the right panel

### Advanced Features

#### Cluster Search
- Enable "Cluster search mode" in Advanced Options
- Enter related terms (comma-separated)
- Set proximity threshold
- Find groups of related words appearing close together

#### Matrix View
- Switch to "Matrix View" tab after searching
- Adjust matrix width or use "Auto-optimize"
- See results in a 2D grid format

#### Side-by-Side View
- Enable "Show reference language"
- Automatically displays Hebrew for OT, Greek for NT
- Hover over words to see alignment

### Understanding Results

Each result shows:
- **Term**: The searched word
- **Skip**: The interval between letters
- **Position**: Starting position in the text
- **Sequence**: The actual letters found
- **View Button**: Click to highlight in text

## 🔧 Technical Details

### ELS Algorithm

The core algorithm searches for words at fixed intervals (skips):
1. Remove all spaces and punctuation from text
2. For each skip value (e.g., 5):
   - Start at position 0
   - Take every 5th letter
   - Check if it matches the search term
3. Repeat for all valid starting positions
4. Include negative skips (backward search)

### Text Normalization

Each language has specific normalization rules:
- **Latin**: Remove diacritics, convert to uppercase, letters only
- **English**: Uppercase, letters only
- **Finnish**: Uppercase, including Ä, Ö, Å
- **Hebrew**: Remove nikud (vowel points), normalize final forms
- **Greek**: Remove diacriticals, normalize sigma variants

### Performance Considerations

- Searches run synchronously (could use Web Workers for large searches)
- Results limited to prevent browser freezing
- Text data cached in memory
- Incremental rendering for large result sets

## 📊 Statistical Analysis

The tool provides basic statistical analysis:
- Expected frequency based on alphabet size
- Observed vs. expected counts
- Skip value distribution
- Forward/backward result counts

**Note**: These statistics are for educational purposes and do not validate the significance of findings.

## 💾 Export Options

### CSV Export
- Tabular format suitable for spreadsheets
- Includes: term, skip, positions, sequences

### JSON Export
- Complete data structure
- Includes: metadata, search parameters, results

### HTML Matrix Export
- Standalone HTML file
- Visual matrix with highlighting

## 🌐 Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🛠️ Development

### Adding New Languages

1. Create handler in `js/languages/`:
```javascript
function normalizeNewLang(text) {
  // Your normalization logic
  return normalizedText;
}

const NEW_LANG_CONFIG = {
  name: 'Language Name',
  alphabet: 'ABC...',
  hasVowels: true,
  direction: 'ltr',
  normalize: normalizeNewLang
};
```

2. Add option in `layoutManager.js`:
```html
<option value="newlang">Language Name</option>
```

3. Update `searchManager.js` normalization switch
4. Create sample data in `dataLoader.js`

### Extending Features

The modular architecture allows easy extension:
- Add new search algorithms in `js/core/`
- Create new visualizations in `js/ui/`
- Implement additional export formats in `exportManager.js`

## 📚 Educational Resources

### Understanding Bible Codes
- Bible Codes are based on finding words at fixed intervals
- The method was popularized in the 1990s
- Scientific consensus: patterns are statistically inevitable
- Similar "codes" found in any long text (Moby Dick, etc.)

### Criticisms
- **Texas Sharpshooter Fallacy**: Finding patterns after the fact
- **Multiple Testing**: Testing millions of combinations
- **Selection Bias**: Reporting hits, ignoring misses
- **No Predictive Power**: Cannot predict future events

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Additional language support
- More sophisticated word alignment
- Better statistical analysis
- Performance optimizations
- UI/UX enhancements

## 📄 License

This project is provided as-is for educational purposes.

## 🙏 Acknowledgments

- Biblical texts: Public domain sources
- ELS method: Historical kabbalistic traditions
- Statistical critique: Brendan McKay, et al.

## 📞 Support

For questions or issues:
1. Check this README
2. Review code comments
3. Open browser console for debugging

## ⚖️ Academic Notice

This tool demonstrates the ELS method but **does not endorse** Bible Code claims. The scientific community has thoroughly debunked Bible Codes as statistically meaningless. This project exists solely for:
- Understanding the methodology
- Demonstrating pattern recognition
- Educational exploration
- Statistical skepticism training

Always approach extraordinary claims with extraordinary evidence.

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Status**: Educational Demo
