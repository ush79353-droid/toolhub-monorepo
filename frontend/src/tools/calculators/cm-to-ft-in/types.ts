/** Which field group the user last edited. */
export type CmToFtInSource = 'centimeters' | 'feetInches';

export interface CmToFtInInput {
  source: CmToFtInSource;
  centimeters: number | null;
  feet: number | null;
  inches: number | null;
}

export interface CmToFtInResult {
  source: CmToFtInSource;
  centimeters: number;
  feet: number;
  inches: number;
  mixedLabel: string;
  explanation: string;
}

export type CmToFtInFieldErrors = {
  centimeters?: string;
  feet?: string;
  inches?: string;
};

export const CM_PER_INCH = 2.54;
export const CM_PER_FOOT = 30.48;
export const INCHES_PER_FOOT = 12;
export const MAX_ABS_VALUE = 1e15;

export const DEFAULT_INPUT: CmToFtInInput = {
  source: 'centimeters',
  centimeters: null,
  feet: null,
  inches: null,
};
