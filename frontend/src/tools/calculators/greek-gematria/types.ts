export interface GreekGematriaLetter {
  originalCharacter: string;
  normalizedCharacter: string;
  greekLetterName: string;
  value: number;
  counted: boolean;
}

export interface GreekGematriaResult {
  originalText: string;
  normalizedText: string;
  total: number;
  letterCount: number;
  breakdown: readonly GreekGematriaLetter[];
  ignoredCharacters: readonly string[];
  additionFormula: string;
}

export interface GreekLetterEntry {
  uppercase: string;
  lowercase: string;
  name: string;
  value: number;
}

export const MAX_GREEK_GEMATRIA_INPUT_LENGTH = 500;
