// Latin (Vulgate) Text Handler
function normalizeLatin(text) {
  if (!text) return '';
  
  return text
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[ÀÁÂÃÄÅ]/g, 'A')
    .replace(/[ÈÉÊË]/g, 'E')
    .replace(/[ÌÍÎÏ]/g, 'I')
    .replace(/[ÒÓÔÕÖ]/g, 'O')
    .replace(/[ÙÚÛÜ]/g, 'U')
    .replace(/Æ/g, 'AE')
    .replace(/Œ/g, 'OE')
    .replace(/[^A-Z]/g, ''); // Remove all non-letters
}

const LATIN_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const LATIN_CONFIG = {
  name: 'Latin',
  alphabet: LATIN_ALPHABET,
  hasVowels: true,
  direction: 'ltr',
  allowSpellingVariants: true,
  caseSensitive: false,
  normalize: normalizeLatin
};

// Export for global use
if (typeof window !== 'undefined') {
  window.normalizeLatin = normalizeLatin;
  window.LATIN_CONFIG = LATIN_CONFIG;
}
