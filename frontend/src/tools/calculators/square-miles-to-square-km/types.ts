/** Extra equivalence units (mi² and km² are the primary pair). */
export type OtherAreaUnit =
  | 'mm2'
  | 'cm2'
  | 'm2'
  | 'in2'
  | 'ft2'
  | 'yd2'
  | 'acre'
  | 'hectare';

export type Mi2Km2Source = 'squareMiles' | 'squareKilometers' | 'other';

export interface SquareMilesToSquareKmInput {
  source: Mi2Km2Source;
  value: number | null;
  otherUnit: OtherAreaUnit;
}

export interface SquareMilesToSquareKmResult {
  squareMiles: number;
  squareKilometers: number;
  otherValue: number;
  otherUnit: OtherAreaUnit;
  explanation: string;
}

export type SquareMilesToSquareKmFieldErrors = Partial<
  Record<'squareMiles' | 'squareKilometers' | 'other' | 'otherUnit', string>
>;

/** Exact: 1 mi = 1.609344 km ⇒ 1 mi² = (1.609344)² km². */
export const SQUARE_KILOMETERS_PER_SQUARE_MILE = 2.589988110336;
export const SQUARE_MILES_PER_SQUARE_KILOMETER = 1 / SQUARE_KILOMETERS_PER_SQUARE_MILE;

export const OTHER_AREA_OPTIONS: readonly {
  value: OtherAreaUnit;
  label: string;
  symbol: string;
}[] = [
  { value: 'mm2', label: 'Square millimeters', symbol: 'mm²' },
  { value: 'cm2', label: 'Square centimeters', symbol: 'cm²' },
  { value: 'm2', label: 'Square meters', symbol: 'm²' },
  { value: 'in2', label: 'Square inches', symbol: 'in²' },
  { value: 'ft2', label: 'Square feet', symbol: 'ft²' },
  { value: 'yd2', label: 'Square yards', symbol: 'yd²' },
  { value: 'acre', label: 'Acres', symbol: 'ac' },
  { value: 'hectare', label: 'Hectares', symbol: 'ha' },
] as const;

export const OTHER_UNIT_SYMBOL: Record<OtherAreaUnit, string> = Object.fromEntries(
  OTHER_AREA_OPTIONS.map((u) => [u.value, u.symbol]),
) as Record<OtherAreaUnit, string>;

export const DEFAULT_OTHER_UNIT: OtherAreaUnit = 'm2';

export const MAX_ABS_VALUE = 1e18;
