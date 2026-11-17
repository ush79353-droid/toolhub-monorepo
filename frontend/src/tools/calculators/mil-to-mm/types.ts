export type {
  LengthUnit,
  MeterFieldErrors as MilToMmFieldErrors,
} from '../meter-converter/types';

export {
  LENGTH_UNITS,
  MAX_ABS_VALUE,
  METERS_PER_UNIT,
  UNIT_SYMBOLS,
} from '../meter-converter/types';

import type { LengthUnit } from '../meter-converter/types';

/** Primary pair: mil (thou) ↔ millimeter. */
export const PRIMARY_UNITS = ['mil', 'mm'] as const satisfies readonly LengthUnit[];

export type MilMmUnit = (typeof PRIMARY_UNITS)[number];

/** Exact: 1 mil = 0.001 in = 0.0254 mm. */
export const MM_PER_MIL = 0.0254;
/** Exact reciprocal: 5000/127 mils per mm. */
export const MILS_PER_MM = 5000 / 127;

export const UNIT_LABELS: Record<MilMmUnit, string> = {
  mil: 'Length in thousandths of an inch',
  mm: 'Length in millimeters',
};
