// Greek Text Handler (for side-by-side display)
function normalizeGreek(text) {
  if (!text) return '';
  
  return text
    .toUpperCase()
    .normalize('NFD')  // Decompose combined characters
    .replace(/[\u0300-\u036F]/g, '')  // Remove diacritical marks
    .replace(/Σ|ς/g, 'Σ')  // Normalize sigma forms
    .replace(/[^Α-ΩϜ]/g, '');  // Keep only Greek letters
}

const GREEK_ALPHABET = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ';

const GREEK_CONFIG = {
  name: 'Greek',
  alphabet: GREEK_ALPHABET,
  hasVowels: true,
  direction: 'ltr',
  removeDiacritics: true,
  sigma: 'unify', // Treat Σ and ς as same letter
  normalize: normalizeGreek
};

// Export for global use
if (typeof window !== 'undefined') {
  window.normalizeGreek = normalizeGreek;
  window.GREEK_CONFIG = GREEK_CONFIG;
}
