import {
  ENGLISH_GEMATRIA,
  HEBREW_STANDARD_GEMATRIA,
  JEWISH_ENGLISH_GEMATRIA,
  SIMPLE_GEMATRIA,
} from './mappings';
import type {
  GematriaBundle,
  GematriaResult,
  GematriaSystem,
  JewishMode,
  LetterValue,
} from './types';

export {
  SIMPLE_GEMATRIA,
  ENGLISH_GEMATRIA,
  JEWISH_ENGLISH_GEMATRIA,
  HEBREW_STANDARD_GEMATRIA,
};

const HEBREW_LETTER =
  /[\u05D0-\u05EA]/u;
const HEBREW_MARK =
  /[\u0591-\u05C7]/u;
const LATIN_LETTER = /[A-Za-z]/;

function mappingFor(system: GematriaSystem): Readonly<Record<string, number>> {
  switch (system) {
    case 'simple':
      return SIMPLE_GEMATRIA;
    case 'english':
      return ENGLISH_GEMATRIA;
    case 'jewish-english':
      return JEWISH_ENGLISH_GEMATRIA;
    case 'hebrew-standard':
      return HEBREW_STANDARD_GEMATRIA;
  }
}

export function detectScripts(text: string): {
  hasLatinLetters: boolean;
  hasHebrewLetters: boolean;
} {
  let hasLatinLetters = false;
  let hasHebrewLetters = false;
  for (const char of text) {
    if (LATIN_LETTER.test(char)) hasLatinLetters = true;
    if (HEBREW_LETTER.test(char)) hasHebrewLetters = true;
  }
  return { hasLatinLetters, hasHebrewLetters };
}

export function calculateGematria(text: string, system: GematriaSystem): GematriaResult {
  const mapping = mappingFor(system);
  const normalized = text.normalize('NFC');
  const letterValues: LetterValue[] = [];
  const ignored: string[] = [];
  let total = 0;
  let countedCount = 0;

  for (const char of normalized) {
    if (HEBREW_MARK.test(char)) {
      continue;
    }
    if (/\s/u.test(char)) {
      continue;
    }
    // Ordinary punctuation / digits — skip without listing every mark.
    if (/[\d\p{P}\p{S}]/u.test(char) && !HEBREW_LETTER.test(char) && !LATIN_LETTER.test(char)) {
      continue;
    }

    if (system === 'hebrew-standard') {
      if (HEBREW_LETTER.test(char)) {
        const value = mapping[char];
        if (value === undefined) {
          ignored.push(char);
          letterValues.push({ letter: char, value: 0, counted: false });
          continue;
        }
        total += value;
        countedCount += 1;
        letterValues.push({ letter: char, value, counted: true });
        continue;
      }
      if (LATIN_LETTER.test(char)) {
        ignored.push(char);
        letterValues.push({ letter: char, value: 0, counted: false });
        continue;
      }
      continue;
    }

    // Latin systems
    if (LATIN_LETTER.test(char)) {
      const key = char.toUpperCase();
      const value = mapping[key];
      if (value === undefined) {
        ignored.push(char);
        letterValues.push({ letter: key, value: 0, counted: false });
        continue;
      }
      total += value;
      countedCount += 1;
      letterValues.push({ letter: key, value, counted: true });
      continue;
    }

    if (HEBREW_LETTER.test(char)) {
      ignored.push(char);
      letterValues.push({ letter: char, value: 0, counted: false });
    }
  }

  return {
    system,
    total,
    letterValues,
    ignored: [...new Set(ignored)],
    countedCount,
  };
}

export function resolveJewishMode(
  mode: JewishMode,
  hasLatinLetters: boolean,
  hasHebrewLetters: boolean
): 'jewish-english' | 'hebrew-standard' | null {
  if (mode === 'jewish-english') return 'jewish-english';
  if (mode === 'hebrew-standard') return 'hebrew-standard';
  if (hasHebrewLetters && !hasLatinLetters) return 'hebrew-standard';
  if (hasLatinLetters && !hasHebrewLetters) return 'jewish-english';
  if (hasHebrewLetters && hasLatinLetters) return null;
  return null;
}

export function buildGematriaBundle(
  raw: string,
  jewishMode: JewishMode
): GematriaBundle | null {
  const trimmed = raw.trim();
  if (trimmed === '') return null;

  const { hasLatinLetters, hasHebrewLetters } = detectScripts(raw);
  const notices: string[] = [];

  const simple =
    hasLatinLetters ? calculateGematria(raw, 'simple') : null;
  const english =
    hasLatinLetters ? calculateGematria(raw, 'english') : null;
  const jewishEnglish =
    hasLatinLetters ? calculateGematria(raw, 'jewish-english') : null;
  const hebrewStandard =
    hasHebrewLetters ? calculateGematria(raw, 'hebrew-standard') : null;

  if (hasLatinLetters && !hasHebrewLetters && jewishMode === 'hebrew-standard') {
    notices.push(
      'Hebrew Standard Gematria applies to Hebrew letters. Switch to English Jewish Gematria for Latin text, or enter Hebrew characters.'
    );
  }
  if (hasHebrewLetters && !hasLatinLetters && jewishMode === 'jewish-english') {
    notices.push(
      'English Jewish Gematria applies to Latin letters. Switch to Hebrew Standard Gematria for Hebrew text.'
    );
  }
  if (hasLatinLetters && hasHebrewLetters) {
    notices.push(
      'Mixed Latin and Hebrew text detected. Simple/English use Latin letters only; choose an explicit Jewish mode for the matching alphabet. No silent transliteration is applied.'
    );
  }
  if (!hasLatinLetters && !hasHebrewLetters) {
    notices.push(
      'No Latin or Hebrew letters found. Enter a word or phrase using supported alphabets.'
    );
  }

  const resolved = resolveJewishMode(jewishMode, hasLatinLetters, hasHebrewLetters);
  let activeJewish: GematriaResult | null = null;
  if (resolved === 'jewish-english') {
    activeJewish = jewishEnglish;
    if (jewishEnglish && jewishEnglish.ignored.length > 0) {
      notices.push(
        `Ignored in English Jewish Gematria: ${jewishEnglish.ignored.join(', ')}`
      );
    }
  } else if (resolved === 'hebrew-standard') {
    activeJewish = hebrewStandard;
    if (hebrewStandard && hebrewStandard.ignored.length > 0) {
      notices.push(
        `Ignored in Hebrew Standard Gematria: ${hebrewStandard.ignored.join(', ')}`
      );
    }
  } else if (hasLatinLetters && hasHebrewLetters) {
    // auto with mixed — require explicit choice
    if (jewishMode === 'auto') {
      notices.push(
        'Select English Jewish or Hebrew Standard under Jewish Gematria for mixed-script input.'
      );
    }
  }

  if (simple && simple.ignored.length > 0) {
    notices.push(`Ignored in Simple/English: ${simple.ignored.join(', ')}`);
  }

  return {
    inputDisplay: raw,
    simple,
    english,
    jewishEnglish,
    hebrewStandard,
    jewishMode,
    activeJewish,
    hasLatinLetters,
    hasHebrewLetters,
    notices: [...new Set(notices)],
  };
}
