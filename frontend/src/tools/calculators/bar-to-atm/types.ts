/** Which field the user last edited. The other field is derived. */
export type BarAtmSource = 'bar' | 'atm';

export interface BarToAtmInput {
  source: BarAtmSource;
  /** null while the active source field is blank or incomplete. */
  bar: number | null;
  atm: number | null;
}

export interface BarToAtmResult {
  source: BarAtmSource;
  bar: number;
  atm: number;
  explanation: string;
}

export type BarToAtmFieldErrors = {
  bar?: string;
  atm?: string;
};

/** Exact: 1 bar = 100,000 Pa. */
export const PA_PER_BAR = 100_000;

/** Exact standard atmosphere in pascals. */
export const PA_PER_ATM = 101_325;

/** Exact: 1 atm = 1.01325 bar. */
export const BAR_PER_ATM = PA_PER_ATM / PA_PER_BAR;

export const MAX_ABS_VALUE = 1e18;

/** Demo default: 1 bar ≈ 0.986923 atm. */
export const DEFAULT_BAR_TO_ATM_INPUT: BarToAtmInput = {
  source: 'bar',
  bar: 1,
  atm: null,
};
