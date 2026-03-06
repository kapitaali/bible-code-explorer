# Setup Guide for Bible Code Explorer

## Quick Start

### Step 1: Create Directory Structure

Create the following directory structure in your project:

```
bible-code-explorer/
├── index.html
├── test_json_loading.html
├── README.md
├── DATA_FORMAT_GUIDE.md
├── css/
│   ├── main.css
│   ├── layout.css
│   └── components.css
├── js/
│   ├── app.js
│   ├── core/
│   │   ├── elsEngine.js
│   │   ├── matrixGenerator.js
│   │   ├── clusterAnalyzer.js
│   │   ├── statisticsEngine.js
│   │   ├── textProcessor.js
│   │   └── searchManager.js
│   ├── languages/
│   │   ├── latinHandler.js
│   │   ├── kjvHandler.js
│   │   ├── finnishHandler.js
│   │   ├── hebrewHandler.js
│   │   └── greekHandler.js
│   ├── ui/
│   │   ├── layoutManager.js
│   │   ├── displayManager.js
│   │   ├── alignmentManager.js
│   │   └── exportManager.js
│   └── data/
│       ├── dataLoader.js
│       └── indexBuilder.js
└── data/
    └── texts/
        ├── latin_bible.json (optional - will use stub if not present)
        ├── kjv.json (optional)
        ├── finnish_bible.json (optional)
        ├── hebrew_ot.json (optional)
        └── greek_nt.json (optional)
```

### Step 2: Add Bible JSON Files (Optional)

The application works immediately with stub data, but you can add full Bible texts:

1. Create the `data/texts/` directory
2. Add JSON files following the format in `DATA_FORMAT_GUIDE.md`
3. Use the exact filenames listed above

### Step 3: Test the Application

#### Option A: Test with Stub Data (Works Immediately)
1. Open `index.html` in a modern browser
2. You'll see Genesis 1:1-3 sample data
3. Try searching for "DEUS" (Latin) or "GOD" (English)

#### Option B: Test JSON Loading
1. Open `test_json_loading.html` in a browser
2. Click "Test All Languages" button
3. Check console (F12) for detailed output
4. See which files loaded from JSON vs stub data

### Step 4: Add Full Bible Data

#### Where to Find Bible Texts

**Public Domain Sources:**
- Latin Vulgate: [Sacred Texts](http://www.sacred-texts.com/bib/vul/index.htm)
- King James: [Project Gutenberg](https://www.gutenberg.org/ebooks/10)
- Hebrew: [Tanach.us](http://www.tanach.us/)
- Greek NT: [Perseus Digital Library](http://www.perseus.tufts.edu/)

#### Converting to JSON Format

1. Download the text from a public domain source
2. Parse it into the JSON structure (see `DATA_FORMAT_GUIDE.md`)
3. Save with the correct filename in `data/texts/`

**Sample conversion script (Python):**
```python
import json

# Example: Convert KJV text file to JSON
def convert_kjv_to_json(input_file, output_file):
    bible_data = {
        "metadata": {
            "language": "english",
            "version": "King James Version",
            "alphabet": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "textDirection": "ltr",
            "hasVowels": True
        },
        "books": []
    }
    
    # Your parsing logic here
    # ...
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(bible_data, f, indent=2, ensure_ascii=False)

convert_kjv_to_json('kjv.txt', 'data/texts/kjv.json')
```

## Browser Compatibility

The application requires:
- ✅ ES6+ support (arrow functions, classes, async/await)
- ✅ Fetch API for loading JSON
- ✅ CSS Grid and Flexbox

**Tested on:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development Mode

### Running Locally

**Simple HTTP Server:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server installed)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Then open: `http://localhost:8000`

**Why you need a server:**
- The Fetch API requires HTTP/HTTPS protocol
- File:// protocol will cause CORS errors when loading JSON

### Debugging

1. **Open Browser Console** (F12 or Cmd+Option+I)
2. **Check Network Tab** to see if JSON files are loading
3. **Look for console messages:**
   - "✅ Successfully loaded..." = JSON file loaded
   - "⚠️ Failed to load... Using stub data" = Using fallback

### Common Issues

**Problem: CORS Error**
```
Access to fetch at 'file://...' from origin 'null' has been blocked by CORS policy
```
**Solution:** Use a local HTTP server (see above)

**Problem: JSON Not Loading**
```
⚠️ Failed to load latin from JSON: HTTP 404: Not Found
```
**Solution:** 
- Check file exists in `data/texts/`
- Check filename matches exactly (case-sensitive)
- Verify server is serving the `data/` directory

**Problem: Invalid JSON Structure**
```
Invalid Bible data structure
```
**Solution:**
- Validate JSON syntax (use jsonlint.com)
- Check required fields are present
- Verify books array has at least one book

## File Checklist

Before launching, verify you have:

- ✅ `index.html` - Main application
- ✅ All CSS files in `css/`
- ✅ All JavaScript files in proper directories
- ✅ `data/texts/` directory exists (even if empty)
- ✅ At least one JSON file OR rely on stub data

## Testing Checklist

1. ✅ Application loads without errors
2. ✅ Language selector works
3. ✅ Can select book and chapter range
4. ✅ Search returns results
5. ✅ Text view displays with highlighting
6. ✅ Matrix view generates correctly
7. ✅ Export buttons work
8. ✅ Console shows appropriate loading messages

## Production Deployment

### GitHub Pages
1. Push all files to GitHub repository
2. Go to Settings → Pages
3. Select branch and root directory
4. Access at: `https://username.github.io/repo-name/`

### Netlify
1. Drag and drop your project folder
2. Site is instantly live
3. Free SSL certificate included

### Static Hosting
Any static file hosting works:
- Vercel
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps

### Optimization for Production
- Minify CSS and JavaScript
- Compress JSON files (gzip)
- Add service worker for offline use
- Enable caching headers

## Performance Considerations

### Memory Usage
- Each language's Bible text is cached in memory
- A full Bible (66 books) is ~4-5 MB of JSON
- All 5 languages cached = ~20-25 MB RAM
- Consider lazy loading for mobile devices

### Load Time
- Stub data: Instant
- Small JSON (1 book): ~50-100ms
- Full Bible: ~200-500ms depending on size
- Caching makes subsequent loads instant

### Search Performance
- Genesis 1: ~10ms
- Full book: ~50-200ms
- Multiple books: ~500-1000ms
- Results limited to prevent UI freezing

## Next Steps

1. **Get it running** with stub data
2. **Test JSON loading** with test utility
3. **Add one full Bible** (start with shortest/easiest)
4. **Test searching** across multiple chapters
5. **Deploy** to your preferred platform

## Support

- Check browser console for detailed errors
- Use test utility to verify JSON loading
- Review DATA_FORMAT_GUIDE.md for format details
- All code is commented for easy understanding

## Future Enhancements

Consider adding:
- Progressive loading for large texts
- IndexedDB for persistent caching
- Web Workers for background searching
- PWA capabilities for offline use
- Additional language support
- More sophisticated text alignment
- Advanced statistical analysis

---

**Ready to start?** Open `index.html` and begin exploring!
