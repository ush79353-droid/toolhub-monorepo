/** Which field the user last edited. The other field is derived. */
export type AtmPaSource = 'atm' | 'pascals';

export interface AtmToPascalsInput {
  source: AtmPaSource;
  /** null while the active source field is blank or incomplete. */
  atm: number | null;
  pascals: number | null;
}

export interface AtmToPascalsResult {
  source: AtmPaSource;
  atm: number;
  pascals: number;
  explanation: string;
}

export type AtmToPascalsFieldErrors = {
  atm?: string;
  pascals?: string;
};

/** Exact standard atmosphere in pascals. */
export const PA_PER_ATM = 101_325;

export const MAX_ABS_VALUE = 1e18;

/** Demo default: 1 atm = 101,325 Pa. */
export const DEFAULT_ATM_TO_PASCALS_INPUT: AtmToPascalsInput = {
  source: 'atm',
  atm: 1,
  pascals: null,
};
