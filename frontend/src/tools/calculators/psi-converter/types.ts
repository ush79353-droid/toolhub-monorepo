import type { PressureUnitId } from '../pressure-conversion/types';
import {
  PASCALS_PER_ATM,
  PASCALS_PER_AT,
  PASCALS_PER_BAR,
  PASCALS_PER_INHG,
  PASCALS_PER_MMHG,
  PASCALS_PER_PSI,
  PASCALS_PER_TORR,
} from '../pressure-conversion/types';

export type PsiUnit = Extract<
  PressureUnitId,
  'psi' | 'bar' | 'atm' | 'Pa' | 'kPa' | 'MPa' | 'hPa' | 'mbar' | 'Torr' | 'mmHg' | 'inHg' | 'kgfcm2'
>;

export type PsiFieldErrors = Partial<Record<PsiUnit, string>>;

export const PSI_UNITS = [
  'psi',
  'bar',
  'atm',
  'Pa',
  'kPa',
  'MPa',
  'hPa',
  'mbar',
  'Torr',
  'mmHg',
  'inHg',
  'kgfcm2',
] as const satisfies readonly PsiUnit[];

/** Expanded by default under “Pressure in Other Units”. */
export const OTHER_PRESSURE_UNITS = ['bar', 'atm', 'Pa'] as const satisfies readonly PsiUnit[];

/** Collapsed “More Pressure Units” section. */
export const MORE_PRESSURE_UNITS = [
  'kPa',
  'MPa',
  'hPa',
  'mbar',
  'Torr',
  'mmHg',
  'inHg',
  'kgfcm2',
] as const satisfies readonly PsiUnit[];

export const UNIT_SYMBOLS: Record<PsiUnit, string> = {
  psi: 'psi',
  bar: 'bar',
  atm: 'atm',
  Pa: 'Pa',
  kPa: 'kPa',
  MPa: 'MPa',
  hPa: 'hPa',
  mbar: 'mbar',
  Torr: 'Torr',
  mmHg: 'mmHg',
  inHg: 'inHg',
  kgfcm2: 'kgf/cm²',
};

export const UNIT_LABELS: Record<PsiUnit, string> = {
  psi: 'Pressure in pounds per square inch',
  bar: 'Pressure in bar',
  atm: 'Pressure in atmospheres',
  Pa: 'Pressure in Pascals',
  kPa: 'Pressure in kilopascals',
  MPa: 'Pressure in megapascals',
  hPa: 'Pressure in hectopascals',
  mbar: 'Pressure in millibars',
  Torr: 'Pressure in torr',
  mmHg: 'Pressure in millimeters of mercury',
  inHg: 'Pressure in inches of mercury',
  kgfcm2: 'Pressure in kilogram-force per square centimeter',
};

export const PASCALS_PER_PA = 1;
export const PASCALS_PER_KPA = 1_000;
export const PASCALS_PER_MPA = 1_000_000;
export const PASCALS_PER_HPA = 100;
export const PASCALS_PER_MBAR = 100;
export const PASCALS_PER_KGFCM2 = PASCALS_PER_AT;

export {
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_INHG,
  PASCALS_PER_MMHG,
  PASCALS_PER_PSI,
  PASCALS_PER_TORR,
};

/** Demo default matching reference: 1 psi. */
export const DEFAULT_PASCALS = PASCALS_PER_PSI;

export const MAX_ABS_VALUE = 1e18;
