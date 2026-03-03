// Main Application Entry Point
class BibleCodeApp {
  constructor() {
    this.dataLoader = null;
    this.searchManager = null;
    this.layoutManager = null;
    this.displayManager = null;
    this.alignmentManager = null;
    this.exportManager = null;
  }

  async initialize() {
    console.log('🚀 Initializing Bible Code Explorer...');

    try {
      // Initialize all managers
      this.dataLoader = new DataLoader();
      this.searchManager = new SearchManager();
      this.layoutManager = new LayoutManager();
      this.displayManager = new DisplayManager();
      this.alignmentManager = new AlignmentManager();
      this.exportManager = new ExportManager();

      // Make managers globally accessible
      window.dataLoader = this.dataLoader;
      window.searchManager = this.searchManager;
      window.layoutManager = this.layoutManager;
      window.displayManager = this.displayManager;
      window.alignmentManager = this.alignmentManager;
      window.exportManager = this.exportManager;

      // Setup UI
      this.layoutManager.initializeLayout();

      // Preload default texts
      await this.preloadDefaultTexts();

      // Add matrix width change listener
      this.setupMatrixListener();

      console.log('✅ Application ready!');
      this.showWelcomeMessage();

    } catch (error) {
      console.error('❌ Failed to initialize application:', error);
      document.getElementById('app').innerHTML = `
        <div style="padding: 2rem; text-align: center;">
          <h1 style="color: #e74c3c;">⚠️ Initialization Error</h1>
          <p>Failed to start the application. Please refresh the page.</p>
          <p style="color: #666; font-size: 0.9rem;">${error.message}</p>
        </div>
      `;
    }
  }

  async preloadDefaultTexts() {
    try {
      console.log('📥 Preloading default Bible texts...');
      
      // Preload Latin (most commonly used)
      await this.dataLoader.loadBibleText('latin');
      console.log('✓ Latin Vulgate loaded');
      
      // Preload others in background
      setTimeout(async () => {
        await this.dataLoader.loadBibleText('kjv');
        console.log('✓ King James English loaded');
        
        await this.dataLoader.loadBibleText('finnish');
        console.log('✓ Finnish Bible loaded');
        
        await this.dataLoader.loadBibleText('hebrew');
        console.log('✓ Hebrew text loaded');
        
        await this.dataLoader.loadBibleText('greek');
        console.log('✓ Greek text loaded');
      }, 500);
      
    } catch (error) {
      console.error('Warning: Failed to preload some texts:', error);
    }
  }

  setupMatrixListener() {
    const matrixWidthInput = document.getElementById('matrix-width');
    if (matrixWidthInput) {
      matrixWidthInput.addEventListener('change', () => {
        if (window.layoutManager.currentResults) {
          window.layoutManager.updateMatrixView();
        }
      });
    }
  }

  showWelcomeMessage() {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              📖 BIBLE CODE EXPLORER v1.0                    ║
║                                                              ║
║  A multilingual ELS (Equidistant Letter Sequence) tool      ║
║  for educational and research purposes.                      ║
║                                                              ║
║  Supported Languages:                                        ║
║  • Latin (Vulgate)                                          ║
║  • King James English                                        ║
║  • Finnish                                                   ║
║  • Hebrew (side-by-side for OT)                             ║
║  • Greek (side-by-side for NT)                              ║
║                                                              ║
║  Features:                                                   ║
║  ✓ ELS Search with variable skip intervals                  ║
║  ✓ Matrix visualization                                     ║
║  ✓ Cluster analysis for related terms                       ║
║  ✓ Side-by-side language comparison                         ║
║  ✓ Export to CSV, JSON, and HTML                            ║
║  ✓ Statistical analysis tools                               ║
║                                                              ║
║  Get started by:                                            ║
║  1. Select a language from the dropdown                     ║
║  2. Choose a text range (book and chapters)                 ║
║  3. Enter a search term                                     ║
║  4. Click "Search" to find ELS patterns                     ║
║                                                              ║
║  Note: This tool is for educational demonstration.          ║
║  Bible Code research is not scientifically validated.       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `);
  }

  // Utility method to check if running in development mode
  isDevelopment() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1';
  }

  // Error handler
  handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    
    const statusIndicator = document.getElementById('status-indicator');
    if (statusIndicator) {
      statusIndicator.textContent = `Error: ${error.message}`;
      statusIndicator.style.color = '#e74c3c';
      
      setTimeout(() => {
        statusIndicator.textContent = 'Ready';
        statusIndicator.style.color = '';
      }, 5000);
    }
  }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM loaded, starting application...');
  
  const app = new BibleCodeApp();
  window.app = app; // Make app instance globally accessible for debugging
  
  app.initialize().catch(error => {
    console.error('Fatal error during initialization:', error);
  });
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('⏸️ Page hidden');
  } else {
    console.log('▶️ Page visible');
  }
});

// Handle errors globally
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  if (window.app) {
    window.app.handleError(event.error, 'Global');
  }
});

// Log unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  if (window.app) {
    window.app.handleError(event.reason, 'Promise');
  }
});
