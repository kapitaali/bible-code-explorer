#!/bin/bash

# Bible Code Explorer - Directory Setup Script
# Creates the required directory structure for the application

echo "📖 Bible Code Explorer - Directory Setup"
echo "========================================="
echo ""

# Create main directories
echo "Creating directory structure..."

mkdir -p css
mkdir -p js/core
mkdir -p js/languages
mkdir -p js/ui
mkdir -p js/data
mkdir -p data/texts

echo "✅ Created css/"
echo "✅ Created js/core/"
echo "✅ Created js/languages/"
echo "✅ Created js/ui/"
echo "✅ Created js/data/"
echo "✅ Created data/texts/"

echo ""
echo "📁 Directory structure created successfully!"
echo ""
echo "Next steps:"
echo "1. Add all JavaScript files to their respective directories"
echo "2. Add CSS files to css/ directory"
echo "3. Place index.html in the root directory"
echo "4. (Optional) Add Bible JSON files to data/texts/"
echo ""
echo "The application will work with stub data even without JSON files."
echo ""
echo "To test, open index.html in a web browser."
echo "For JSON loading test, open test_json_loading.html"
echo ""
echo "For detailed setup instructions, see SETUP_GUIDE.md"
echo ""

# Create a simple .gitignore
cat > .gitignore << 'EOL'
# Bible Code Explorer .gitignore

# Large Bible JSON files (optional - remove if you want to commit them)
data/texts/*.json

# OS files
.DS_Store
Thumbs.db

# Editor files
.vscode/
.idea/
*.swp
*.swo
*~

# Logs
*.log

# Temporary files
*.tmp
*.temp
EOL

echo "✅ Created .gitignore file"
echo ""

# Create a simple README for the data directory
cat > data/texts/README.md << 'EOL'
# Bible Text Data Directory

Place your Bible JSON files here:

- `latin_bible.json` - Latin Vulgate
- `kjv.json` - King James Version
- `finnish_bible.json` - Finnish Bible
- `hebrew_ot.json` - Hebrew Old Testament
- `greek_nt.json` - Greek New Testament

## File Not Required

The application includes stub data and will work without these files.
If JSON files are not found, stub data will be used automatically.

## Adding Your Own Bible Texts

See `DATA_FORMAT_GUIDE.md` in the root directory for the required JSON structure.

## Sample Files

Sample JSON structure files are included in the project documentation.
EOL

echo "✅ Created data/texts/README.md"
echo ""
echo "========================================="
echo "🎉 Setup complete!"
echo "========================================="
