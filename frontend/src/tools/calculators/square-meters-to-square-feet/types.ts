/** Extra equivalence units (m² and ft² are the primary pair). */
export type OtherAreaUnit =
  | 'mm2'
  | 'cm2'
  | 'km2'
  | 'in2'
  | 'yd2'
  | 'acre'
  | 'hectare'
  | 'mi2';

export type M2Ft2Source = 'squareMeters' | 'squareFeet' | 'other';

export interface SquareMetersToSquareFeetInput {
  source: M2Ft2Source;
  value: number | null;
  otherUnit: OtherAreaUnit;
}

export interface SquareMetersToSquareFeetResult {
  squareMeters: number;
  squareFeet: number;
  otherValue: number;
  otherUnit: OtherAreaUnit;
  explanation: string;
}

export type SquareMetersToSquareFeetFieldErrors = Partial<
  Record<'squareMeters' | 'squareFeet' | 'other' | 'otherUnit', string>
>;

/** Exact international foot: 1 ft² = 0.09290304 m². */
export const SQUARE_METERS_PER_SQUARE_FOOT = 0.09290304;
export const SQUARE_FEET_PER_SQUARE_METER = 1 / SQUARE_METERS_PER_SQUARE_FOOT;

export const OTHER_AREA_OPTIONS: readonly {
  value: OtherAreaUnit;
  label: string;
  symbol: string;
}[] = [
  { value: 'mm2', label: 'Square millimeters', symbol: 'mm²' },
  { value: 'cm2', label: 'Square centimeters', symbol: 'cm²' },
  { value: 'km2', label: 'Square kilometers', symbol: 'km²' },
  { value: 'in2', label: 'Square inches', symbol: 'in²' },
  { value: 'yd2', label: 'Square yards', symbol: 'yd²' },
  { value: 'acre', label: 'Acres', symbol: 'ac' },
  { value: 'hectare', label: 'Hectares', symbol: 'ha' },
  { value: 'mi2', label: 'Square miles', symbol: 'mi²' },
] as const;

export const OTHER_UNIT_SYMBOL: Record<OtherAreaUnit, string> = Object.fromEntries(
  OTHER_AREA_OPTIONS.map((u) => [u.value, u.symbol]),
) as Record<OtherAreaUnit, string>;

export const DEFAULT_OTHER_UNIT: OtherAreaUnit = 'cm2';

export const MAX_ABS_VALUE = 1e18;
