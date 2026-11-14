import {
  MAX_ARABIC,
  MIN_ARABIC,
  ROMAN_MAP,
  ROMAN_REGEX,
  type ConversionDirection,
  type RomanConversionStep,
  type RomanResult,
} from './types';

export function stripNoise(raw: string): string {
  return raw.trim().replace(/[\s_]/g, '');
}

export function normalizeRomanNumeral(value: string): string {
  return stripNoise(value).toUpperCase();
}

export function isValidArabicNumber(value: string): boolean {
  const cleaned = stripNoise(value);
  if (!/^[1-9][0-9]*$/.test(cleaned)) return false;
  const n = Number(cleaned);
  return Number.isInteger(n) && n >= MIN_ARABIC && n <= MAX_ARABIC;
}

export function isValidRomanNumeral(value: string): boolean {
  const normalized = normalizeRomanNumeral(value);
  return ROMAN_REGEX.test(normalized);
}

export function arabicToRoman(value: number): string {
  if (!Number.isInteger(value) || value < MIN_ARABIC || value > MAX_ARABIC) {
    throw new Error('Enter a whole number between 1 and 3999.');
  }
  let remaining = value;
  let roman = '';
  for (const entry of ROMAN_MAP) {
    while (remaining >= entry.value) {
      roman += entry.symbol;
      remaining -= entry.value;
    }
  }
  return roman;
}

export function getArabicToRomanSteps(value: number): RomanConversionStep[] {
  if (!Number.isInteger(value) || value < MIN_ARABIC || value > MAX_ARABIC) {
    throw new Error('Enter a whole number between 1 and 3999.');
  }
  let remaining = value;
  const steps: RomanConversionStep[] = [];
  for (const entry of ROMAN_MAP) {
    let count = 0;
    while (remaining >= entry.value) {
      count += 1;
      remaining -= entry.value;
    }
    if (count > 0) {
      steps.push({ value: entry.value, symbol: entry.symbol, count });
    }
  }
  return steps;
}

export function romanToArabic(value: string): number {
  const normalized = normalizeRomanNumeral(value);
  if (!isValidRomanNumeral(normalized)) {
    throw new Error(
      'Please enter a valid Roman numeral using I, V, X, L, C, D, and M.'
    );
  }
  let i = 0;
  let total = 0;
  while (i < normalized.length) {
    const two = normalized.slice(i, i + 2);
    const pair = ROMAN_MAP.find((entry) => entry.symbol === two);
    if (pair) {
      total += pair.value;
      i += 2;
      continue;
    }
    const one = normalized[i]!;
    const single = ROMAN_MAP.find((entry) => entry.symbol === one);
    if (!single) {
      throw new Error(
        'Please enter a valid Roman numeral using I, V, X, L, C, D, and M.'
      );
    }
    total += single.value;
    i += 1;
  }
  if (total < MIN_ARABIC || total > MAX_ARABIC) {
    throw new Error('Enter a whole number between 1 and 3999.');
  }
  return total;
}

export function getRomanToArabicSteps(value: string): RomanConversionStep[] {
  const normalized = normalizeRomanNumeral(value);
  if (!isValidRomanNumeral(normalized)) {
    throw new Error(
      'Please enter a valid Roman numeral using I, V, X, L, C, D, and M.'
    );
  }
  let i = 0;
  const steps: RomanConversionStep[] = [];
  while (i < normalized.length) {
    const two = normalized.slice(i, i + 2);
    const pair = ROMAN_MAP.find((entry) => entry.symbol === two);
    if (pair) {
      steps.push({ value: pair.value, symbol: pair.symbol, count: 1 });
      i += 2;
      continue;
    }
    const one = normalized[i]!;
    const single = ROMAN_MAP.find((entry) => entry.symbol === one)!;
    steps.push({ value: single.value, symbol: single.symbol, count: 1 });
    i += 1;
  }
  return steps;
}

export function calculateRoman(
  input: string,
  direction: ConversionDirection
): RomanResult {
  const cleaned = stripNoise(input);

  if (direction === 'arabic-to-roman') {
    if (!isValidArabicNumber(cleaned)) {
      throw new Error('Enter a whole number between 1 and 3999.');
    }
    const arabic = Number(cleaned);
    const roman = arabicToRoman(arabic);
    return {
      direction,
      input: cleaned,
      output: roman,
      arabic,
      roman,
      formula: `${arabic} = ${roman}`,
      steps: getArabicToRomanSteps(arabic),
    };
  }

  const roman = normalizeRomanNumeral(cleaned);
  if (!isValidRomanNumeral(roman)) {
    throw new Error(
      'Please enter a valid Roman numeral using I, V, X, L, C, D, and M.'
    );
  }
  const arabic = romanToArabic(roman);
  return {
    direction,
    input: roman,
    output: String(arabic),
    arabic,
    roman,
    formula: `${roman} = ${arabic}`,
    steps: getRomanToArabicSteps(roman),
  };
}
