/** Which field the user last edited. */
export type KpaAtmSource = 'kPa' | 'atm';

export interface KpaToAtmInput {
  source: KpaAtmSource;
  kPa: number | null;
  atm: number | null;
}

export type KpaToAtmFieldErrors = {
  kPa?: string;
  atm?: string;
};

/** Exact: 1 atm = 101,325 Pa; 1 kPa = 1,000 Pa → 1 atm = 101.325 kPa. */
export const KPA_PER_ATM = 101.325;

export const MAX_ABS_VALUE = 1e18;
