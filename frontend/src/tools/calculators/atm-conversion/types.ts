/** Which field the user last edited. Others are derived via pascals. */
export type AtmPressureUnit = 'atm' | 'bar' | 'psi' | 'Pa';

export interface AtmConversionInput {
  source: AtmPressureUnit;
  /** null while the active source field is blank or incomplete. */
  atm: number | null;
  bar: number | null;
  psi: number | null;
  Pa: number | null;
}

export interface AtmConversionResult {
  source: AtmPressureUnit;
  atm: number;
  bar: number;
  psi: number;
  Pa: number;
  /** True when the source value is negative (gauge relative, not absolute). */
  isGaugeRelative: boolean;
  explanation: string;
}

export type AtmConversionFieldErrors = {
  atm?: string;
  bar?: string;
  psi?: string;
  Pa?: string;
};

/** Exact standard atmosphere. */
export const PA_PER_ATM = 101_325;

/** Exact: 1 bar = 100_000 Pa. */
export const PA_PER_BAR = 100_000;

/**
 * Standard international pound-force per square inch in pascals.
 * Derived from exact lbf and inch definitions (task factor).
 */
export const PA_PER_PSI = 6894.757293168;

export const PRESSURE_FACTORS_PA: Record<AtmPressureUnit, number> = {
  atm: PA_PER_ATM,
  bar: PA_PER_BAR,
  psi: PA_PER_PSI,
  Pa: 1,
};

export const MAX_ABS_VALUE = 1e18;

/** Demo default: 1 atm. */
export const DEFAULT_ATM_CONVERSION_INPUT: AtmConversionInput = {
  source: 'atm',
  atm: 1,
  bar: null,
  psi: null,
  Pa: null,
};
