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

export type PressureUnitField = Extract<
  PressureUnitId,
  'bar' | 'psi' | 'atm' | 'Pa' | 'kPa' | 'MPa' | 'hPa' | 'mbar' | 'mmHg' | 'Torr' | 'inHg' | 'kgfcm2'
>;

export type PressureUnitFieldErrors = Partial<Record<PressureUnitField, string>>;

/** Always-visible primary fields matching the reference layout. */
export const PRIMARY_PRESSURE_UNITS = [
  'bar',
  'psi',
  'atm',
  'Pa',
] as const satisfies readonly PressureUnitField[];

/** Collapsed “More pressure units” section. */
export const MORE_PRESSURE_UNITS = [
  'kPa',
  'MPa',
  'hPa',
  'mbar',
  'mmHg',
  'Torr',
  'inHg',
  'kgfcm2',
] as const satisfies readonly PressureUnitField[];

export const PRESSURE_UNIT_FIELDS = [
  ...PRIMARY_PRESSURE_UNITS,
  ...MORE_PRESSURE_UNITS,
] as const satisfies readonly PressureUnitField[];

export const UNIT_SYMBOLS: Record<PressureUnitField, string> = {
  bar: 'bar',
  psi: 'psi',
  atm: 'atm',
  Pa: 'Pa',
  kPa: 'kPa',
  MPa: 'MPa',
  hPa: 'hPa',
  mbar: 'mbar',
  mmHg: 'mmHg',
  Torr: 'Torr',
  inHg: 'inHg',
  kgfcm2: 'kgf/cm²',
};

export const UNIT_LABELS: Record<PressureUnitField, string> = {
  bar: 'Pressure in bars',
  psi: 'Pressure in pounds per square inch',
  atm: 'Pressure in atmospheres',
  Pa: 'Pressure in pascals',
  kPa: 'Pressure in kilopascals',
  MPa: 'Pressure in megapascals',
  hPa: 'Pressure in hectopascals',
  mbar: 'Pressure in millibars',
  mmHg: 'Pressure in millimeters of mercury',
  Torr: 'Pressure in torr',
  inHg: 'Pressure in inches of mercury',
  kgfcm2: 'Pressure in kilogram-force per square centimeter',
};

export const PASCALS_PER_PA = 1;
export const PASCALS_PER_KPA = 1_000;
export const PASCALS_PER_MPA = 1_000_000;
export const PASCALS_PER_HPA = 100;
export const PASCALS_PER_MBAR = 100;
/** Exact: 1 technical atmosphere = 1 kgf/cm². */
export const PASCALS_PER_KGFCM2 = PASCALS_PER_AT;

export {
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_INHG,
  PASCALS_PER_MMHG,
  PASCALS_PER_PSI,
  PASCALS_PER_TORR,
};

/** Demo default matching reference: 1 bar. */
export const DEFAULT_PASCALS = PASCALS_PER_BAR;

export const MAX_ABS_VALUE = 1e18;
