export type {
  LengthUnit,
  MeterFieldErrors as MilToInchFieldErrors,
} from '../meter-converter/types';

export {
  LENGTH_UNITS,
  MAX_ABS_VALUE,
  METERS_PER_UNIT,
  UNIT_SYMBOLS,
} from '../meter-converter/types';

import type { LengthUnit } from '../meter-converter/types';

/** Primary pair only: mil (thou) ↔ inch. */
export const PRIMARY_UNITS = ['mil', 'in'] as const satisfies readonly LengthUnit[];

export type MilInchUnit = (typeof PRIMARY_UNITS)[number];

/** Exact: 1 mil = 0.001 international inch. */
export const MILS_PER_INCH = 1000;
export const INCHES_PER_MIL = 0.001;
/** Exact SI: 1 mil = 0.0254 mm (clarifies mil ≠ millimeter). */
export const MM_PER_MIL = 0.0254;

export const UNIT_LABELS: Record<MilInchUnit, string> = {
  mil: 'Thousandths of an inch',
  in: 'Inches',
};
