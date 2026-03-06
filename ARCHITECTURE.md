# Bible Code Explorer - Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface (HTML)                     │
│                          index.html                              │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ├─── CSS Styling
                                 │    ├─ main.css
                                 │    ├─ layout.css
                                 │    └─ components.css
                                 │
                                 └─── JavaScript Application
                                      │
        ┌─────────────────────────────┴─────────────────────────────┐
        │                                                             │
        │                     app.js (Main Entry)                    │
        │                    BibleCodeApp Class                      │
        │                                                             │
        └─────────────────────────────┬─────────────────────────────┘
                                      │
        ┌─────────────────────────────┴─────────────────────────────┐
        │                                                             │
        │                  UI Layer (js/ui/)                         │
        │                                                             │
        │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
        │  │ Layout       │  │ Display      │  │ Alignment    │   │
        │  │ Manager      │  │ Manager      │  │ Manager      │   │
        │  └──────────────┘  └──────────────┘  └──────────────┘   │
        │                                                             │
        │  ┌──────────────┐                                         │
        │  │ Export       │                                         │
        │  │ Manager      │                                         │
        │  └──────────────┘                                         │
        │                                                             │
        └─────────────────────────────┬─────────────────────────────┘
                                      │
        ┌─────────────────────────────┴─────────────────────────────┐
        │                                                             │
        │                Core Logic Layer (js/core/)                 │
        │                                                             │
        │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
        │  │ ELS          │  │ Matrix       │  │ Cluster      │   │
        │  │ Engine       │  │ Generator    │  │ Analyzer     │   │
        │  └──────────────┘  └──────────────┘  └──────────────┘   │
        │                                                             │
        │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
        │  │ Statistics   │  │ Text         │  │ Search       │   │
        │  │ Engine       │  │ Processor    │  │ Manager      │   │
        │  └──────────────┘  └──────────────┘  └──────────────┘   │
        │                                                             │
        └─────────────────────────────┬─────────────────────────────┘
                                      │
        ┌─────────────────────────────┴─────────────────────────────┐
        │                                                             │
        │              Language Layer (js/languages/)                │
        │                                                             │
        │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
        │  │ Latin    │ │ KJV      │ │ Finnish  │ │ Hebrew   │    │
        │  │ Handler  │ │ Handler  │ │ Handler  │ │ Handler  │    │
        │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
        │                                                             │
        │  ┌──────────┐                                              │
        │  │ Greek    │                                              │
        │  │ Handler  │                                              │
        │  └──────────┘                                              │
        │                                                             │
        └─────────────────────────────┬─────────────────────────────┘
                                      │
        ┌─────────────────────────────┴─────────────────────────────┐
        │                                                             │
        │               Data Layer (js/data/)                        │
        │                                                             │
        │  ┌──────────────────────┐  ┌──────────────────────┐      │
        │  │ DataLoader           │  │ IndexBuilder         │      │
        │  │                      │  │                      │      │
        │  │ • Load JSON files    │  │ • Build indices      │      │
        │  │ • Fallback to stubs  │  │ • Optimize searches  │      │
        │  │ • Cache management   │  │ • Memory management  │      │
        │  └──────────────────────┘  └──────────────────────┘      │
        │                                                             │
        └─────────────────────────────┬─────────────────────────────┘
                                      │
                                      │
        ┌─────────────────────────────┴─────────────────────────────┐
        │                                                             │
        │                  Data Sources                              │
        │                                                             │
        │  ┌────────────────────────────────────────┐               │
        │  │  JSON Files (data/texts/)              │               │
        │  │                                         │               │
        │  │  • latin_bible.json   (optional)       │               │
        │  │  • kjv.json           (optional)       │               │
        │  │  • finnish_bible.json (optional)       │               │
        │  │  • hebrew_ot.json     (optional)       │               │
        │  │  • greek_nt.json      (optional)       │               │
        │  └────────────────────────────────────────┘               │
        │                        │                                    │
        │                        │ If not found                       │
        │                        ↓                                    │
        │  ┌────────────────────────────────────────┐               │
        │  │  Stub Data (built into dataLoader.js)  │               │
        │  │                                         │               │
        │  │  • Genesis 1:1-3 for all languages     │               │
        │  │  • Ensures app always works            │               │
        │  └────────────────────────────────────────┘               │
        │                                                             │
        └─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Search Operation Flow

```
User Input (Search Form)
    ↓
LayoutManager.performSearch()
    ↓
SearchManager.executeSearch()
    ↓
    ├─→ DataLoader.loadBookRange()
    │       ↓
    │   DataLoader.loadBibleText()
    │       ↓
    │   ┌─ Check cache → Found? → Return cached
    │   │                  ↓ Not found
    │   └─ Fetch JSON → Success? → Normalize → Cache → Return
    │                      ↓ Failure
    │                   Use stub → Cache → Return
    │       ↓
    │   Return: { text, verseMap }
    │
    └─→ Language normalization
    │
    └─→ ELSEngine.search()
    │       ↓
    │   For each skip value:
    │       ↓
    │   searchWithSkip()
    │       ↓
    │   matchesAtPosition()
    │       ↓
    │   Collect results
    │
    └─→ Optional: ClusterAnalyzer.findClusters()
    │
    └─→ Return results
        ↓
LayoutManager.displayResults()
    ↓
DisplayManager.renderText()
DisplayManager.highlightPositions()
```

## Component Responsibilities

### UI Layer

| Component | Responsibility | Key Methods |
|-----------|----------------|-------------|
| **LayoutManager** | Overall UI coordination, event handling | `initializeLayout()`, `performSearch()`, `displayResults()` |
| **DisplayManager** | Text rendering, highlighting | `renderText()`, `highlightPositions()`, `renderMatrix()` |
| **AlignmentManager** | Side-by-side language view | `alignTexts()`, `renderDualPane()` |
| **ExportManager** | Data export functionality | `exportToCSV()`, `exportToJSON()` |

### Core Logic Layer

| Component | Responsibility | Key Methods |
|-----------|----------------|-------------|
| **ELSEngine** | Core ELS search algorithm | `search()`, `searchWithSkip()`, `matchesAtPosition()` |
| **MatrixGenerator** | 2D matrix visualization | `generateMatrix()`, `findOptimalWidth()` |
| **ClusterAnalyzer** | Related term clustering | `findClusters()`, `findNearbyMatches()` |
| **StatisticsEngine** | Statistical analysis | `analyzeResults()`, `calculateExpectedFrequency()` |
| **TextProcessor** | Text manipulation utilities | `normalize()`, `analyzeFrequencies()`, `getContext()` |
| **SearchManager** | Search coordination | `executeSearch()`, `normalizeForLanguage()` |

### Language Layer

| Component | Responsibility | Key Methods |
|-----------|----------------|-------------|
| **latinHandler** | Latin text normalization | `normalizeLatin()` |
| **kjvHandler** | English text normalization | `normalizeKJV()` |
| **finnishHandler** | Finnish text normalization | `normalizeFinnish()` |
| **hebrewHandler** | Hebrew text normalization | `normalizeHebrew()` |
| **greekHandler** | Greek text normalization | `normalizeGreek()` |

### Data Layer

| Component | Responsibility | Key Methods |
|-----------|----------------|-------------|
| **DataLoader** | Bible text loading, caching | `loadBibleText()`, `fetchBibleData()`, `getContinuousText()` |
| **IndexBuilder** | Search optimization indices | `buildNGramIndex()`, `buildCharacterIndex()` |

## Data Models

### Bible Data Structure

```javascript
{
  metadata: {
    language: string,
    version: string,
    alphabet: string,
    textDirection: 'ltr' | 'rtl',
    hasVowels: boolean
  },
  books: [
    {
      id: string,
      name: string,
      nativeName: string,
      testament: 'OT' | 'NT',
      chapters: [
        {
          number: number,
          verses: [
            {
              number: number,
              text: string,
              normalized: string (optional)
            }
          ]
        }
      ]
    }
  ]
}
```

### Search Result Structure

```javascript
{
  term: string,
  skip: number,
  startPosition: number,
  endPosition: number,
  positions: number[],
  sequence: string
}
```

### Cluster Result Structure

```javascript
{
  primary: SearchResult,
  related: [
    {
      term: string,
      matches: SearchResult[]
    }
  ],
  centerPosition: number,
  compactness: number,
  proximityScore: number
}
```

## State Management

### Application State

```javascript
{
  // LayoutManager
  currentView: 'text' | 'matrix' | 'dual',
  selectedLanguages: {
    primary: string,
    secondary: string | null
  },
  currentResults: SearchResults | null,
  
  // DataLoader
  cache: Map<string, BibleData>,
  loadingPromises: Map<string, Promise>,
  
  // DisplayManager
  highlightedPositions: Set<number>
}
```

## Memory Management

### Cache Strategy

```
First Load:
  User → Select Language → Not in cache
    ↓
  Fetch from server/file
    ↓
  Store in Map<language, data>
    ↓
  Return to user

Subsequent Access:
  User → Select Language → Found in cache
    ↓
  Return immediately (no network request)
```

### Memory Footprint

```
Stub Data (built-in):     ~5 MB
Single Full Bible:        ~5 MB
All 5 Languages Cached:   ~25 MB
Search Results (typical): ~0.1-1 MB
UI Elements:              ~2-5 MB
Total (worst case):       ~35-40 MB
```

## Error Handling Strategy

```
Try Operation
    ↓
    ├─→ Success → Continue
    │
    └─→ Failure
        ↓
        ├─→ Log to console (detailed)
        ├─→ Show user-friendly message
        ├─→ Attempt fallback (if available)
        └─→ Update UI status indicator
```

## Performance Optimization

### Load Time Optimization
- Cache loaded Bible texts
- Lazy initialization of heavy components
- Progressive loading (when implemented)

### Search Optimization
- Result limiting (max results parameter)
- Early termination when limit reached
- Efficient string matching algorithms

### Rendering Optimization
- Virtual scrolling (not yet implemented)
- Incremental rendering for large results
- Debounced search input

## Security Considerations

### Current Implementation
- ✅ No eval() usage
- ✅ No innerHTML with user data
- ✅ Sanitized text display
- ✅ No external dependencies
- ✅ Client-side only (no server risk)

### Future Considerations
- Content Security Policy (CSP)
- Subresource Integrity (SRI)
- CORS configuration for production

## Browser Compatibility

### Required APIs
- ES6+ (Classes, Arrow Functions, Promises, Async/Await)
- Fetch API
- Map, Set
- CSS Grid, Flexbox
- LocalStorage (not currently used)

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Testing Architecture

### Manual Testing
- `test_json_loading.html` - JSON load verification
- Browser console - Detailed logging
- Network tab - File loading inspection

### Future Automated Testing
Could add:
- Unit tests (Jest, Mocha)
- Integration tests (Cypress, Playwright)
- Performance tests (Lighthouse)

## Deployment Architecture

### Static Hosting (Current)
```
CDN / Static Host
    │
    ├─ HTML, CSS, JS files
    ├─ Bible JSON files (optional)
    └─ All assets cached by browser
```

### Future: Dynamic Loading
```
API Server
    │
    ├─ GET /api/bible/{language}
    ├─ GET /api/bible/{language}/{book}
    └─ GET /api/search
        ↓
    Client App (Progressive Web App)
```

## Extension Points

### Easy to Add
- New languages (add handler + JSON)
- New export formats (extend ExportManager)
- New visualizations (extend DisplayManager)

### Medium Effort
- Server-side API
- User authentication
- Saved searches
- Custom Bible versions

### Major Effort
- Real-time collaboration
- Advanced AI analysis
- 3D visualizations
- Mobile native apps

---

**This architecture prioritizes:**
- Simplicity (vanilla JS, no build step)
- Modularity (clear separation of concerns)
- Flexibility (easy to extend)
- Reliability (graceful fallbacks)
- Performance (caching, optimization)
