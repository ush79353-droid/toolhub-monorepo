/** Extra equivalence units (ft² and acres are the primary pair). */
export type OtherAreaUnit =
  | 'mm2'
  | 'cm2'
  | 'm2'
  | 'km2'
  | 'in2'
  | 'yd2'
  | 'hectare'
  | 'mi2';

export type SqFtAcresSource = 'squareFeet' | 'acres' | 'other';

export interface SquareFeetToAcresInput {
  source: SqFtAcresSource;
  value: number | null;
  otherUnit: OtherAreaUnit;
}

export interface SquareFeetToAcresResult {
  squareFeet: number;
  acres: number;
  otherValue: number;
  otherUnit: OtherAreaUnit;
  explanation: string;
}

export type SquareFeetToAcresFieldErrors = Partial<
  Record<'squareFeet' | 'acres' | 'other' | 'otherUnit', string>
>;

/** Exact international acre in square feet. */
export const SQUARE_FEET_PER_ACRE = 43_560;

export const OTHER_AREA_OPTIONS: readonly {
  value: OtherAreaUnit;
  label: string;
  symbol: string;
}[] = [
  { value: 'mm2', label: 'Square millimeters', symbol: 'mm²' },
  { value: 'cm2', label: 'Square centimeters', symbol: 'cm²' },
  { value: 'm2', label: 'Square meters', symbol: 'm²' },
  { value: 'km2', label: 'Square kilometers', symbol: 'km²' },
  { value: 'in2', label: 'Square inches', symbol: 'in²' },
  { value: 'yd2', label: 'Square yards', symbol: 'yd²' },
  { value: 'hectare', label: 'Hectares', symbol: 'ha' },
  { value: 'mi2', label: 'Square miles', symbol: 'mi²' },
] as const;

export const OTHER_UNIT_SYMBOL: Record<OtherAreaUnit, string> = Object.fromEntries(
  OTHER_AREA_OPTIONS.map((u) => [u.value, u.symbol]),
) as Record<OtherAreaUnit, string>;

export const DEFAULT_OTHER_UNIT: OtherAreaUnit = 'm2';

export const MAX_ABS_VALUE = 1e18;
