export type {
  LengthUnit,
  MeterFieldErrors as MmToFootFieldErrors,
} from '../meter-converter/types';

export {
  LENGTH_UNITS,
  MAX_ABS_VALUE,
  METERS_PER_UNIT,
  UNIT_SYMBOLS,
  UNIT_LABELS,
} from '../meter-converter/types';

import type { LengthUnit } from '../meter-converter/types';
import { METERS_PER_UNIT } from '../meter-converter/types';

/** Exact international foot in millimeters. */
export const MM_PER_FOOT = METERS_PER_UNIT.ft / METERS_PER_UNIT.mm; // 304.8

export const PRIMARY_UNITS = ['mm', 'ft'] as const satisfies readonly LengthUnit[];
export type PrimaryUnit = (typeof PRIMARY_UNITS)[number];

/** Selectable third unit (exclude mm/ft). */
export const OTHER_UNITS = [
  'cm',
  'm',
  'km',
  'in',
  'yd',
  'mi',
  'um',
] as const satisfies readonly LengthUnit[];

export type OtherLengthUnit = (typeof OTHER_UNITS)[number];
export const DEFAULT_OTHER_UNIT: OtherLengthUnit = 'cm';

export type ActiveField = PrimaryUnit | OtherLengthUnit;

export const PRIMARY_LABELS: Record<PrimaryUnit, string> = {
  mm: 'Millimeter (Metric)',
  ft: 'Foot (Imperial)',
};
