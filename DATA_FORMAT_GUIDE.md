# Bible Data JSON Format Guide

## Overview

The Bible Code Explorer reads Bible texts from JSON files stored in the `data/texts/` directory. If a JSON file is not found, the application automatically falls back to stub data built into `dataLoader.js`.

## File Naming Convention

Place your JSON files in `data/texts/` with these exact filenames:

- **Latin**: `latin_bible.json`
- **King James English**: `kjv.json`
- **Finnish**: `finnish_bible.json`
- **Hebrew**: `hebrew_ot.json` (Old Testament only)
- **Greek**: `greek_nt.json` (New Testament only)

## JSON Structure

### Root Level

```json
{
  "metadata": { ... },
  "books": [ ... ]
}
```

### Metadata Object

```json
{
  "metadata": {
    "language": "latin",
    "version": "Vulgate",
    "alphabet": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "textDirection": "ltr",
    "hasVowels": true,
    "charset": "latin",
    "source": "Public Domain Vulgate",
    "year": "~405 AD"
  }
}
```

**Required fields:**
- `language`: Language code (latin, english, finnish, hebrew, greek)
- `version`: Bible version name
- `alphabet`: All letters used in this language (uppercase)
- `textDirection`: "ltr" (left-to-right) or "rtl" (right-to-left)
- `hasVowels`: true/false

**Optional fields:**
- `charset`: Character set used
- `source`: Where the text comes from
- `year`: Publication/translation year

### Books Array

Each book must have:

```json
{
  "id": "gen",
  "name": "Genesis",
  "nativeName": "Liber Genesis",
  "testament": "OT",
  "chapters": [ ... ]
}
```

**Book ID Standards:**
- Old Testament: gen, exo, lev, num, deu, jos, jdg, rut, 1sa, 2sa, 1ki, 2ki, etc.
- New Testament: mat, mrk, luk, jhn, act, rom, 1co, 2co, gal, eph, etc.

**Testament Values:**
- `"OT"` - Old Testament
- `"NT"` - New Testament

### Chapters Array

```json
{
  "number": 1,
  "verses": [ ... ]
}
```

### Verses Array

```json
{
  "number": 1,
  "text": "In principio creavit Deus caelum et terram"
}
```

**Note:** The `normalized` field is optional. If not provided, the application will automatically normalize the text based on the language's normalization rules.

## Complete Example

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
      "nativeName": "Liber Genesis",
      "testament": "OT",
      "chapters": [
        {
          "number": 1,
          "verses": [
            {
              "number": 1,
              "text": "In principio creavit Deus caelum et terram"
            },
            {
              "number": 2,
              "text": "Terra autem erat inanis et vacua..."
            }
          ]
        },
        {
          "number": 2,
          "verses": [
            {
              "number": 1,
              "text": "Igitur perfecti sunt caeli et terra..."
            }
          ]
        }
      ]
    },
    {
      "id": "exo",
      "name": "Exodus",
      "nativeName": "Exodus",
      "testament": "OT",
      "chapters": [
        {
          "number": 1,
          "verses": [
            {
              "number": 1,
              "text": "Haec sunt nomina filiorum Israhel..."
            }
          ]
        }
      ]
    }
  ]
}
```

## Language-Specific Notes

### Latin (latin_bible.json)
- Includes diacritical marks in original text (if present)
- Application removes them during normalization
- Use classical Latin spelling

### King James English (kjv.json)
- Preserve archaic spellings (connexion, etc.)
- Include original punctuation
- Application extracts only letters during normalization

### Finnish (finnish_bible.json)
- Include Ä, Ö, Å characters
- These are treated as distinct letters, not variants

### Hebrew (hebrew_ot.json)
- Include nikud (vowel points) in original text
- Include cantillation marks if available
- Application removes them during normalization
- Text direction is RTL but stored LTR in JSON

### Greek (greek_nt.json)
- Include diacritical marks (accents, breathing marks)
- Application removes them during normalization
- Use final sigma (ς) where appropriate

## How the Application Uses This Data

1. **Loading**: When a language is selected, the app attempts to load from `data/texts/[filename].json`
2. **Validation**: The app checks that the JSON has valid structure
3. **Normalization**: If verses don't have `normalized` field, app generates it
4. **Fallback**: If JSON file doesn't exist or fails to load, app uses stub data
5. **Caching**: Successfully loaded data is cached in memory

## Validation

The application validates:
- ✅ JSON is valid and parseable
- ✅ Has `metadata` and `books` objects
- ✅ Books array is not empty
- ✅ Each book has id, chapters array
- ✅ Each chapter has verses array

## Error Handling

If a JSON file:
- **Doesn't exist**: Uses stub data, shows warning in console
- **Is malformed**: Uses stub data, shows error in console
- **Has invalid structure**: Uses stub data, shows error in console

## Console Output

When loading, you'll see:
```
📥 Attempting to load latin from: data/texts/latin_bible.json
✅ Successfully loaded latin from JSON file
   Books: 66, Testament: OT
```

Or on fallback:
```
📥 Attempting to load latin from: data/texts/latin_bible.json
⚠️ Failed to load latin from JSON: HTTP 404: Not Found
📋 Using stub data for latin instead
```

## Creating Your Own JSON Files

### Option 1: Manual Creation
1. Create a new file in `data/texts/`
2. Follow the structure above
3. Add your Bible text verse by verse

### Option 2: Script Conversion
If you have Bible data in another format, write a script to convert it to this JSON structure.

### Option 3: Use Existing Sources
Many public domain Bibles are available online. You'll need to:
1. Download the text
2. Parse it into the JSON structure
3. Ensure proper book IDs and chapter/verse numbers

## Testing Your JSON

1. Place your JSON file in `data/texts/`
2. Open the browser console (F12)
3. Select the language from the dropdown
4. Check console for loading messages
5. Try a search to verify the text is working

## Common Issues

**Problem**: "Failed to load... HTTP 404"
- **Solution**: Check filename matches exactly (case-sensitive)
- **Solution**: Ensure file is in `data/texts/` directory

**Problem**: "Invalid Bible data structure"
- **Solution**: Validate JSON syntax
- **Solution**: Check all required fields are present
- **Solution**: Ensure arrays are not empty

**Problem**: No results when searching
- **Solution**: Check that text is being normalized correctly
- **Solution**: Verify verses have content
- **Solution**: Try searching for a common word

## Performance Considerations

- Each JSON file will be loaded into memory when first accessed
- Larger Bibles (complete 66 books) will take more memory
- Consider splitting very large files if needed
- The application caches loaded data for the session

## Future Enhancements

Possible improvements to data loading:
- Lazy loading of books (load only requested books)
- Compressed JSON files
- Progressive loading for large texts
- IndexedDB for client-side persistence
- Server-side API for dynamic loading

## Need Help?

Check the browser console for detailed error messages. The application provides clear feedback about what went wrong during loading.
