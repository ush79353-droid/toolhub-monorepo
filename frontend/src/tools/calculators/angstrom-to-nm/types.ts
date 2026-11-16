/** Which field the user last edited. Others are derived from nanometers. */
export type AngstromNmSource = 'angstroms' | 'nanometers' | 'mils';

export interface AngstromToNmInput {
  source: AngstromNmSource;
  /** null while the active source field is blank or incomplete. */
  angstroms: number | null;
  nanometers: number | null;
  mils: number | null;
}

export interface AngstromToNmResult {
  source: AngstromNmSource;
  angstroms: number;
  nanometers: number;
  mils: number;
  explanation: string;
}

export type AngstromToNmFieldErrors = {
  angstroms?: string;
  nanometers?: string;
  mils?: string;
};

/** Exact: 1 nm = 10 Å. */
export const ANGSTROMS_PER_NANOMETER = 10;

/** Exact: 1 mil = 1/1000 international inch = 25,400 nm. */
export const NANOMETERS_PER_MIL = 25_400;

export const MAX_ABS_VALUE = 1e18;

/** Demo default: 14 Å = 1.4 nm. */
export const DEFAULT_ANGSTROM_TO_NM_INPUT: AngstromToNmInput = {
  source: 'angstroms',
  angstroms: 14,
  nanometers: null,
  mils: null,
};
