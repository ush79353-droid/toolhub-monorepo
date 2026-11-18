import type { PressureUnitId } from '../pressure-conversion/types';
import {
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_MMHG,
  PASCALS_PER_PSI,
  PASCALS_PER_TORR,
} from '../pressure-conversion/types';

export type PascalUnit = Extract<
  PressureUnitId,
  'Pa' | 'bar' | 'atm' | 'psi' | 'Torr' | 'kPa' | 'MPa' | 'mbar' | 'mmHg'
>;

export type PascalFieldErrors = Partial<Record<PascalUnit, string>>;

export const PASCAL_UNITS = [
  'Pa',
  'bar',
  'atm',
  'psi',
  'Torr',
  'kPa',
  'MPa',
  'mbar',
  'mmHg',
] as const satisfies readonly PascalUnit[];

/** Expanded by default under “Pressure in other units”. */
export const OTHER_PRESSURE_UNITS = [
  'bar',
  'atm',
  'psi',
  'Torr',
] as const satisfies readonly PascalUnit[];

/** Collapsed “More pressure units” section. */
export const MORE_PRESSURE_UNITS = [
  'kPa',
  'MPa',
  'mbar',
  'mmHg',
] as const satisfies readonly PascalUnit[];

export const UNIT_SYMBOLS: Record<PascalUnit, string> = {
  Pa: 'Pa',
  bar: 'bar',
  atm: 'atm',
  psi: 'psi',
  Torr: 'Torr',
  kPa: 'kPa',
  MPa: 'MPa',
  mbar: 'mbar',
  mmHg: 'mmHg',
};

export const UNIT_LABELS: Record<PascalUnit, string> = {
  Pa: 'Pressure in pascals',
  bar: 'Pressure in bars',
  atm: 'Pressure in atmospheres',
  psi: 'Pressure in pounds per square inch',
  Torr: 'Pressure in torr',
  kPa: 'Pressure in kilopascals',
  MPa: 'Pressure in megapascals',
  mbar: 'Pressure in millibars',
  mmHg: 'Pressure in millimeters of mercury',
};

export const PASCALS_PER_PA = 1;
export const PASCALS_PER_KPA = 1_000;
export const PASCALS_PER_MPA = 1_000_000;
export const PASCALS_PER_MBAR = 100;

export {
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_MMHG,
  PASCALS_PER_PSI,
  PASCALS_PER_TORR,
};

export const MAX_ABS_VALUE = 1e18;
