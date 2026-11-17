export type {
  LengthUnit,
  MeterFieldErrors as MicronToMilFieldErrors,
} from '../meter-converter/types';

export {
  LENGTH_UNITS,
  MAX_ABS_VALUE,
  METERS_PER_UNIT,
  UNIT_SYMBOLS,
} from '../meter-converter/types';

import type { LengthUnit } from '../meter-converter/types';

/** Primary pair: micron (µm) ↔ mil (thou). */
export const PRIMARY_UNITS = ['um', 'mil'] as const satisfies readonly LengthUnit[];

/** Extra length units under More conversion options. */
export const OTHER_UNITS = ['mm', 'cm', 'm', 'in', 'nm'] as const satisfies readonly LengthUnit[];

/** All synced units on this calculator. */
export const MICRON_MIL_SYNC_UNITS = [
  'um',
  'mil',
  'mm',
  'cm',
  'm',
  'in',
  'nm',
] as const satisfies readonly LengthUnit[];

export type MicronMilSyncUnit = (typeof MICRON_MIL_SYNC_UNITS)[number];

/** Exact: 1 mil = 0.001 in = 25.4 µm. */
export const MICRONS_PER_MIL = 25.4;

export const UNIT_LABELS: Record<MicronMilSyncUnit, string> = {
  um: 'Length in microns',
  mil: 'Length in mils',
  mm: 'Millimeters',
  cm: 'Centimeters',
  m: 'Meters',
  in: 'Inches',
  nm: 'Nanometers',
};
