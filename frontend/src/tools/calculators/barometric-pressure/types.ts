import {
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_INHG,
  PASCALS_PER_MMHG,
  PASCALS_PER_PSI,
  PASCALS_PER_TORR,
  PRESSURE_UNITS,
  PRESSURE_UNIT_BY_ID,
  type OtherUnitRow,
  type PressureFieldId,
  type PressureUnitId,
} from '../pressure-conversion/types';

export type {
  OtherUnitRow,
  PressureFieldId,
  PressureUnitId,
};

export {
  PASCALS_PER_ATM,
  PASCALS_PER_BAR,
  PASCALS_PER_INHG,
  PASCALS_PER_MMHG,
  PASCALS_PER_PSI,
  PASCALS_PER_TORR,
  PRESSURE_UNITS,
  PRESSURE_UNIT_BY_ID,
};

/** Task factors (Pa per unit). Torr ≠ conventional mmHg. */
export const PRESSURE_TO_PASCALS = {
  Pa: 1,
  kPa: 1000,
  hPa: 100,
  MPa: 1_000_000,
  bar: PASCALS_PER_BAR,
  mbar: 100,
  atm: PASCALS_PER_ATM,
  psi: PASCALS_PER_PSI,
  Torr: PASCALS_PER_TORR,
  mmHg: PASCALS_PER_MMHG,
  inHg: PASCALS_PER_INHG,
  kgf_cm2: 98_066.5,
} as const;

export type BarometricPressureUnitId = keyof typeof PRESSURE_TO_PASCALS;

export type BarometricFieldErrors = Partial<Record<PressureFieldId, string>>;

export interface BarometricPressureResult {
  pascals: number;
  sourceField: PressureFieldId;
  values: readonly [number, number, number, number];
  units: readonly [PressureUnitId, PressureUnitId, PressureUnitId, PressureUnitId];
  otherUnits: readonly OtherUnitRow[];
}

/** Screenshot / task order: atm, bar, Pa, psi. */
export const FIELD_LABELS: readonly string[] = [
  'Pressure in atmospheres',
  'Pressure in bar',
  'Pressure in pascals',
  'Pressure in pounds per square inch',
] as const;

export const DEFAULT_FIELD_UNITS: readonly [
  PressureUnitId,
  PressureUnitId,
  PressureUnitId,
  PressureUnitId,
] = ['atm', 'bar', 'Pa', 'psi'];

/** Extra rows beyond the four primary defaults. */
export const OTHER_UNIT_IDS: readonly PressureUnitId[] = [
  'hPa',
  'kPa',
  'MPa',
  'mbar',
  'Torr',
  'mmHg',
  'inHg',
  'kgfcm2',
];

/** Demo: 1 atm. */
export const DEFAULT_PASCALS = PASCALS_PER_ATM;

export const MAX_ABS_VALUE = 1e30;
