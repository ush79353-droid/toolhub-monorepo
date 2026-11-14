export type ConversionDirection = 'arabic-to-roman' | 'roman-to-arabic';

export interface RomanMapEntry {
  value: number;
  symbol: string;
}

export interface RomanConversionStep {
  value: number;
  symbol: string;
  count: number;
}

export interface RomanResult {
  direction: ConversionDirection;
  input: string;
  output: string;
  arabic: number;
  roman: string;
  formula: string;
  steps: readonly RomanConversionStep[];
}

export type RomanFieldErrors = Partial<Record<'input', string>>;

export const MIN_ARABIC = 1;
export const MAX_ARABIC = 3999;
export const MAX_INPUT_LENGTH = 32;

export const ROMAN_MAP: readonly RomanMapEntry[] = Object.freeze([
  { value: 1000, symbol: 'M' },
  { value: 900, symbol: 'CM' },
  { value: 500, symbol: 'D' },
  { value: 400, symbol: 'CD' },
  { value: 100, symbol: 'C' },
  { value: 90, symbol: 'XC' },
  { value: 50, symbol: 'L' },
  { value: 40, symbol: 'XL' },
  { value: 10, symbol: 'X' },
  { value: 9, symbol: 'IX' },
  { value: 5, symbol: 'V' },
  { value: 4, symbol: 'IV' },
  { value: 1, symbol: 'I' },
]);

/** Canonical Roman numerals for 1–3999 (no empty match). */
export const ROMAN_REGEX =
  /^(?=.)M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
