// King James English Text Handler
function normalizeKJV(text) {
  if (!text) return '';
  
  return text
    .toUpperCase()
    .replace(/[^A-Z]/g, ''); // Keep only A-Z letters
}

const KJV_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const KJV_CONFIG = {
  name: 'King James English',
  alphabet: KJV_ALPHABET,
  hasVowels: true,
  direction: 'ltr',
  preserveArchaicSpelling: true,
  caseSensitive: false,
  normalize: normalizeKJV
};

// Export for global use
if (typeof window !== 'undefined') {
  window.normalizeKJV = normalizeKJV;
  window.KJV_CONFIG = KJV_CONFIG;
}
