import type { AreaUnit } from '../square-feet-converter/types';
import { AREA_TO_SQUARE_METERS } from '../square-feet-converter/types';

export type { AreaUnit };
export { AREA_TO_SQUARE_METERS };

export type SquareYardFieldErrors = Partial<Record<AreaUnit, string>>;

export const SQUARE_YARD_UNITS = [
  'yd2',
  'ft2',
  'm2',
  'acre',
  'in2',
  'cm2',
  'mm2',
  'km2',
  'mi2',
  'hectare',
] as const satisfies readonly AreaUnit[];

/** Always visible primary unit. */
export const PRIMARY_UNITS = ['yd2'] as const satisfies readonly AreaUnit[];

/** Conversion for common units (expanded by default). */
export const COMMON_UNITS = ['ft2', 'm2', 'acre'] as const satisfies readonly AreaUnit[];

/** Conversion for other units (collapsed by default). */
export const OTHER_UNITS = [
  'in2',
  'cm2',
  'mm2',
  'km2',
  'mi2',
  'hectare',
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
  m2: 'Square meters',
  km2: 'Square kilometers',
  in2: 'Square inches',
  ft2: 'Square feet',
  yd2: 'Square yards',
  acre: 'Acres',
  hectare: 'Hectares',
  mi2: 'Square miles',
};

/** Exact: 1 yd = 0.9144 m ⇒ 1 yd² = (0.9144)² m². */
export const SQUARE_METERS_PER_SQUARE_YARD = 0.83612736;
export const SQUARE_FEET_PER_SQUARE_YARD = 9;
export const SQUARE_INCHES_PER_SQUARE_YARD = 1296;
export const SQUARE_YARDS_PER_ACRE = 4840;

export const MAX_ABS_VALUE = 1e18;
