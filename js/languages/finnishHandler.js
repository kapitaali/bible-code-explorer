// Finnish Text Handler
function normalizeFinnish(text) {
  if (!text) return '';
  
  return text
    .toUpperCase()
    .replace(/[^A-ZÄÖÅ]/g, ''); // Keep Finnish letters including Ä, Ö, Å
}

const FINNISH_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÅ';

const FINNISH_CONFIG = {
  name: 'Finnish',
  alphabet: FINNISH_ALPHABET,
  hasVowels: true,
  direction: 'ltr',
  distinctLetters: ['Ä', 'Ö', 'Å'],
  caseSensitive: false,
  normalize: normalizeFinnish
};

// Export for global use
if (typeof window !== 'undefined') {
  window.normalizeFinnish = normalizeFinnish;
  window.FINNISH_CONFIG = FINNISH_CONFIG;
}
