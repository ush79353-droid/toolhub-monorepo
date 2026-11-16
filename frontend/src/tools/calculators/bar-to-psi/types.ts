import {
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_MMHG,
  PASCALS_PER_PSI,
  PASCALS_PER_TORR,
} from '../pressure-conversion/types';

/** Which field the user last edited. */
export type BarPsiSource = 'primary' | 'secondary';

export type PressureUnit =
  | 'Pa'
  | 'kPa'
  | 'MPa'
  | 'bar'
  | 'mbar'
  | 'atm'
  | 'psi'
  | 'Torr'
  | 'mmHg';

export interface BarToPsiInput {
  source: BarPsiSource;
  primary: number | null;
  secondary: number | null;
  primaryUnit: PressureUnit;
  secondaryUnit: PressureUnit;
}

export interface BarToPsiResult {
  source: BarPsiSource;
  primary: number;
  secondary: number;
  primaryUnit: PressureUnit;
  secondaryUnit: PressureUnit;
  /** Always available for share/guide consistency. */
  bar: number;
  psi: number;
  explanation: string;
}

export type BarToPsiFieldErrors = {
  primary?: string;
  secondary?: string;
};

export {
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_MMHG,
  PASCALS_PER_PSI,
  PASCALS_PER_TORR,
};

export const PASCALS_PER_UNIT: Record<PressureUnit, number> = {
  Pa: 1,
  kPa: 1_000,
  MPa: 1_000_000,
  bar: PASCALS_PER_BAR,
  mbar: 100,
  atm: PASCALS_PER_ATM,
  psi: PASCALS_PER_PSI,
  Torr: PASCALS_PER_TORR,
  mmHg: PASCALS_PER_MMHG,
};

/** Exact via Pa: 1 bar / 1 psi. */
export const PSI_PER_BAR = PASCALS_PER_BAR / PASCALS_PER_PSI;

export const PRESSURE_UNIT_OPTIONS: readonly { value: PressureUnit; label: string }[] = [
  { value: 'bar', label: 'bar' },
  { value: 'psi', label: 'psi' },
  { value: 'Pa', label: 'Pa' },
  { value: 'kPa', label: 'kPa' },
  { value: 'MPa', label: 'MPa' },
  { value: 'mbar', label: 'mbar' },
  { value: 'atm', label: 'atm' },
  { value: 'Torr', label: 'Torr' },
  { value: 'mmHg', label: 'mmHg' },
] as const;

export const PRESSURE_UNIT_LABEL: Record<PressureUnit, string> = {
  Pa: 'Pa',
  kPa: 'kPa',
  MPa: 'MPa',
  bar: 'bar',
  mbar: 'mbar',
  atm: 'atm',
  psi: 'psi',
  Torr: 'Torr',
  mmHg: 'mmHg',
};

export const MAX_ABS_VALUE = 1e18;

/** Demo: 1 bar ≈ 14.503774 psi. */
export const DEFAULT_BAR_TO_PSI_INPUT: BarToPsiInput = {
  source: 'primary',
  primary: 1,
  secondary: null,
  primaryUnit: 'bar',
  secondaryUnit: 'psi',
};
