import type { AreaUnit } from '../square-feet-converter/types';
import { AREA_TO_SQUARE_METERS } from '../square-feet-converter/types';

export type { AreaUnit };
export { AREA_TO_SQUARE_METERS };

export type SquareMeterFieldErrors = Partial<Record<AreaUnit, string>>;

export const SQUARE_METER_UNITS = [
  'm2',
  'ft2',
  'in2',
  'yd2',
  'cm2',
  'mm2',
  'km2',
  'acre',
  'hectare',
  'mi2',
] as const satisfies readonly AreaUnit[];

/** Always visible primary pair. */
export const PRIMARY_UNITS = ['m2', 'ft2'] as const satisfies readonly AreaUnit[];

/** Expandable Other Area Units. */
export const OTHER_AREA_UNITS = [
  'in2',
  'yd2',
  'cm2',
  'mm2',
  'km2',
  'acre',
  'hectare',
  'mi2',
] as const satisfies readonly AreaUnit[];

export const UNIT_SYMBOLS: Record<AreaUnit, string> = {
  mm2: 'mm²',
  cm2: 'cm²',
  m2: 'm²',
  km2: 'km²',
  in2: 'in²',
  ft2: 'ft²',
  yd2: 'yd²',
  acre: 'ac',
  hectare: 'ha',
  mi2: 'mi²',
};

export const UNIT_LABELS: Record<AreaUnit, string> = {
  mm2: 'Square millimeters',
  cm2: 'Square centimeters',
  m2: 'Area in square meters',
  km2: 'Square kilometers',
  in2: 'Square inches',
  ft2: 'Area in square feet',
  yd2: 'Square yards',
  acre: 'Acres',
  hectare: 'Hectares',
  mi2: 'Square miles',
};

export const MAX_ABS_VALUE = 1e18;
