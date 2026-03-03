// Hebrew Text Handler (for side-by-side display)
function normalizeHebrew(text) {
  if (!text) return '';
  
  return text
    .replace(/[\u0591-\u05C7]/g, '')  // Remove cantillation marks
    .replace(/[\u05B0-\u05BC]/g, '')  // Remove vowel points (nikud)
    .replace(/[\u05C0\u05C3\u05C6]/g, '') // Remove punctuation
    .replace(/[^\u05D0-\u05EA]/g, '') // Keep only Hebrew letters
    .replace(/ך/g, 'כ')  // Normalize final forms
    .replace(/ם/g, 'מ')
    .replace(/ן/g, 'נ')
    .replace(/ף/g, 'פ')
    .replace(/ץ/g, 'צ')
    .trim();
}

const HEBREW_ALPHABET = 'אבגדהוזחטיכלמנסעפצקרשת';

const HEBREW_CONFIG = {
  name: 'Hebrew',
  alphabet: HEBREW_ALPHABET,
  hasVowels: false,
  direction: 'rtl',
  finalForms: {
    'ך': 'כ',
    'ם': 'מ',
    'ן': 'נ',
    'ף': 'פ',
    'ץ': 'צ'
  },
  normalize: normalizeHebrew
};

// Export for global use
if (typeof window !== 'undefined') {
  window.normalizeHebrew = normalizeHebrew;
  window.HEBREW_CONFIG = HEBREW_CONFIG;
}
