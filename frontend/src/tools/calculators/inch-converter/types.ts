export type {
  LengthUnit,
  MeterFieldErrors as InchFieldErrors,
} from '../meter-converter/types';

export {
  LENGTH_UNITS,
  MAX_ABS_VALUE,
  METERS_PER_LIGHT_YEAR,
  METERS_PER_NAUTICAL_MILE,
  METERS_PER_SOLAR_RADIUS,
  METERS_PER_UNIT,
  OTHER_PRIMARY,
  UNIT_SYMBOLS,
} from '../meter-converter/types';

import type { LengthUnit } from '../meter-converter/types';
import { UNIT_LABELS as BASE_LABELS } from '../meter-converter/types';

/** Metric fields under the Metric accordion. */
export const METRIC_PRIMARY = ['mm', 'cm', 'm', 'km'] as const satisfies readonly LengthUnit[];

/** Imperial/US fields excluding inches (primary). */
export const IMPERIAL_PRIMARY = ['ft', 'yd', 'mi'] as const satisfies readonly LengthUnit[];

/** Units synced for results preview. */
export const INCH_SYNC_UNITS = [
  'in',
  'mm',
  'cm',
  'm',
  'km',
  'ft',
  'yd',
  'mi',
  'nmi',
  'solarRadius',
  'ly',
] as const satisfies readonly LengthUnit[];

/** Screenshot-aligned labels (mm/cm/m/km include unit in parentheses). */
export const UNIT_LABELS: Record<LengthUnit, string> = {
  ...BASE_LABELS,
  mm: 'Length in millimeters (mm)',
  cm: 'Length in centimeters (cm)',
  m: 'Length in meters (m)',
  km: 'Length in kilometers (km)',
  mi: 'Length in miles',
  nmi: 'Length in nautical miles',
  solarRadius: 'Length in sun radii',
  ly: 'Length in light years',
};
