/** Which pressure field the user last edited. */
export type BarPsigSource = 'bar' | 'psig';

/** Absolute bar(a) needs atm offset; gauge bar(g) does not. */
export type PressureReference = 'absolute' | 'gauge';

export interface BarToPsigInput {
  source: BarPsigSource;
  bar: number | null;
  psig: number | null;
  reference: PressureReference;
  atmosphericBar: number | null;
}

export interface BarToPsigResult {
  source: BarPsigSource;
  bar: number;
  psig: number;
  reference: PressureReference;
  atmosphericBar: number;
  explanation: string;
}

export type BarToPsigFieldErrors = {
  bar?: string;
  psig?: string;
  atmosphericBar?: string;
};

/** Task/authoritative factor: 1 bar ≈ 14.5037738007 psi (pressure difference). */
export const PSI_PER_BAR = 14.5037738007;

/** Exact: 1 standard atmosphere = 1.01325 bar. */
export const STANDARD_ATMOSPHERIC_BAR = 1.01325;

/** ≈ 14.6959488 psi at standard atmosphere. */
export const STANDARD_ATMOSPHERIC_PSI = STANDARD_ATMOSPHERIC_BAR * PSI_PER_BAR;

export const MAX_ABS_VALUE = 1e18;

/** Demo: 10 bar(a) ≈ 130.34 PSIG at standard atmosphere. */
export const DEFAULT_BAR_TO_PSIG_INPUT: BarToPsigInput = {
  source: 'bar',
  bar: 10,
  psig: null,
  reference: 'absolute',
  atmosphericBar: STANDARD_ATMOSPHERIC_BAR,
};
