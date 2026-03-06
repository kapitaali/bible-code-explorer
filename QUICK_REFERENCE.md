# Quick Reference Guide

## File Loading Behavior

### What Happens When You Select a Language?

```
1. User selects "Latin" from dropdown
   ↓
2. App tries to fetch: data/texts/latin_bible.json
   ↓
3a. File EXISTS                      3b. File NOT FOUND
    ↓                                    ↓
    Load from JSON                       Use stub data
    ↓                                    ↓
    Cache in memory                      Cache stub data
    ↓                                    ↓
    Console: "✅ Successfully loaded"    Console: "⚠️ Using stub data"
```

## Console Messages Explained

### Success Messages
```
✅ Successfully loaded latin from JSON file
   Books: 66, Testament: OT
```
**Meaning:** JSON file found and loaded successfully

### Warning Messages
```
⚠️ Failed to load latin from JSON: HTTP 404: Not Found
📋 Using stub data for latin instead
```
**Meaning:** JSON file not found, using built-in sample data (app still works!)

### Error Messages
```
❌ Invalid Bible data structure
```
**Meaning:** JSON file exists but has wrong format (will fallback to stub)

## File Naming Requirements

| Language | Required Filename | Location |
|----------|------------------|----------|
| Latin | `latin_bible.json` | `data/texts/` |
| English | `kjv.json` | `data/texts/` |
| Finnish | `finnish_bible.json` | `data/texts/` |
| Hebrew | `hebrew_ot.json` | `data/texts/` |
| Greek | `greek_nt.json` | `data/texts/` |

**IMPORTANT:** Filenames are case-sensitive on some systems!

## Minimal JSON Structure

```json
{
  "metadata": {
    "language": "latin",
    "version": "Vulgate",
    "alphabet": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "textDirection": "ltr",
    "hasVowels": true
  },
  "books": [
    {
      "id": "gen",
      "name": "Genesis",
      "testament": "OT",
      "chapters": [
        {
          "number": 1,
          "verses": [
            {
              "number": 1,
              "text": "In principio creavit Deus caelum et terram"
            }
          ]
        }
      ]
    }
  ]
}
```

## Book ID Reference

### Old Testament (39 books)
```
gen, exo, lev, num, deu       - Pentateuch
jos, jdg, rut, 1sa, 2sa       - Historical
1ki, 2ki, 1ch, 2ch, ezr       - Historical (cont.)
neh, est, job, psa, pro       - Poetry/Wisdom
ecc, sng, isa, jer, lam       - Prophets
ezk, dan, hos, jol, amo       - Prophets (cont.)
oba, jon, mic, nam, hab       - Minor Prophets
zep, hag, zec, mal            - Minor Prophets (cont.)
```

### New Testament (27 books)
```
mat, mrk, luk, jhn            - Gospels
act                            - Acts
rom, 1co, 2co, gal, eph       - Pauline Epistles
php, col, 1th, 2th, 1ti       - Pauline Epistles (cont.)
2ti, tit, phm, heb            - Pauline Epistles (cont.)
jas, 1pe, 2pe, 1jn, 2jn       - General Epistles
3jn, jud, rev                 - General Epistles (cont.)
```

## Common Issues & Solutions

### Issue: Can't Load JSON
**Symptoms:** Console shows 404 error
**Solutions:**
1. Check file exists in `data/texts/`
2. Verify filename is exactly correct
3. Must use HTTP server (not file://)
4. Check browser network tab for actual URL being requested

### Issue: JSON Doesn't Validate
**Symptoms:** "Invalid Bible data structure" error
**Solutions:**
1. Validate JSON syntax at jsonlint.com
2. Ensure `metadata` and `books` objects exist
3. Verify books array is not empty
4. Check each book has required fields

### Issue: Search Returns No Results
**Symptoms:** Shows "No matches found"
**Reasons:**
1. Text might not contain the search term
2. Normalization removed your search letters
3. Skip range might be too small
4. Check normalized preview shows expected text

### Issue: Normalized Text is Empty
**Symptoms:** Search term preview shows "(empty)"
**Solutions:**
1. Enter text in search box
2. Check language has proper normalization function
3. Verify text contains valid letters for that language

## Testing Strategy

### Quick Test (No JSON Files)
1. Open `index.html`
2. Select any language
3. Search for common word (DEUS, GOD, etc.)
4. Should find results in stub data

### Full Test (With JSON Files)
1. Place JSON file in `data/texts/`
2. Open `test_json_loading.html`
3. Click "Test All Languages"
4. Check console for loading details

### Search Test
1. Load the app
2. Select: Genesis, Chapter 1-1
3. Search term: "GOD" (for English) or "DEUS" (for Latin)
4. Skip range: 1 to 50
5. Click Search
6. Should find multiple results

## Performance Expectations

| Operation | Expected Time |
|-----------|---------------|
| Load stub data | Instant (<10ms) |
| Load small JSON (1 book) | 50-100ms |
| Load full Bible (66 books) | 200-500ms |
| Simple search (1 chapter) | 10-50ms |
| Complex search (full book) | 100-500ms |
| Matrix generation | 50-200ms |

## Memory Usage

| Data Loaded | Approx Memory |
|-------------|---------------|
| One language stub | <1 MB |
| One full Bible | 4-6 MB |
| All 5 languages cached | 20-30 MB |

## Browser DevTools Tips

### Check if JSON Loaded
1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Select language from dropdown
5. Look for `latin_bible.json` request
6. Status 200 = Success, 404 = Not Found

### Check Cached Data
```javascript
// In browser console:
dataLoader.getCacheStats()
// Returns: { cachedLanguages: ['latin'], cacheSize: 1, loading: [] }
```

### Clear Cache
```javascript
// In browser console:
dataLoader.clearCache()
```

### Force Reload
```javascript
// In browser console:
dataLoader.clearCache()
dataLoader.loadBibleText('latin')
```

## URL Parameters (Future Enhancement)

Currently not implemented, but could add:
- `?lang=latin` - Auto-select language
- `?book=gen&ch=1` - Auto-load book/chapter
- `?search=deus&skip=1-50` - Auto-search

## API Reference

### DataLoader Methods
```javascript
// Load a language
await dataLoader.loadBibleText('latin')

// Get specific book range
await dataLoader.loadBookRange('latin', 'gen', 1, 3)

// Get continuous text
dataLoader.getContinuousText(bookData)

// Check cache
dataLoader.getCacheStats()

// Clear cache
dataLoader.clearCache()
```

### Search Manager
```javascript
// Execute search
await searchManager.executeSearch({
  language: 'latin',
  book: 'gen',
  chapterStart: 1,
  chapterEnd: 1,
  searchTerm: 'DEUS',
  minSkip: 1,
  maxSkip: 50,
  includeNegative: true,
  maxResults: 500
})
```

## Keyboard Shortcuts

Currently none implemented, but could add:
- `Ctrl+F` - Focus search box
- `Enter` - Start search
- `Esc` - Clear results
- `←` `→` - Navigate results

## Mobile Considerations

The app is responsive but consider:
- Smaller screen = less text visible
- Touch targets should be 44x44px minimum
- Matrix view may be too small on mobile
- Consider disabling matrix on mobile

## Deployment Checklist

Before deploying:
- [ ] All files in correct directories
- [ ] Test on local HTTP server
- [ ] Verify JSON loading (or stub fallback)
- [ ] Test search functionality
- [ ] Check all three views (Text, Matrix, Dual)
- [ ] Test export functions
- [ ] Check console for errors
- [ ] Test on target browsers
- [ ] Optimize JSON file sizes if needed
- [ ] Configure server caching headers

## Getting Help

1. Check browser console (F12)
2. Use test utility (`test_json_loading.html`)
3. Review this Quick Reference
4. Check DATA_FORMAT_GUIDE.md for JSON structure
5. Review SETUP_GUIDE.md for detailed setup

## Useful Links

- JSON Validator: https://jsonlint.com
- Regular Expression Tester: https://regex101.com
- Unicode Character Lookup: https://unicode-table.com
- HTTP Server Guide: https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server

---

**Last Updated:** January 2026
