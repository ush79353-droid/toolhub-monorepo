export type GematriaSystem =
  | 'simple'
  | 'english'
  | 'jewish-english'
  | 'hebrew-standard';

export type JewishMode = 'auto' | 'jewish-english' | 'hebrew-standard';

export interface LetterValue {
  letter: string;
  value: number;
  counted: boolean;
}

export interface GematriaResult {
  system: GematriaSystem;
  total: number;
  letterValues: readonly LetterValue[];
  ignored: readonly string[];
  countedCount: number;
}

export interface GematriaBundle {
  inputDisplay: string;
  simple: GematriaResult | null;
  english: GematriaResult | null;
  jewishEnglish: GematriaResult | null;
  hebrewStandard: GematriaResult | null;
  jewishMode: JewishMode;
  activeJewish: GematriaResult | null;
  hasLatinLetters: boolean;
  hasHebrewLetters: boolean;
  notices: readonly string[];
}

export const MAX_GEMATRIA_INPUT_LENGTH = 500;
