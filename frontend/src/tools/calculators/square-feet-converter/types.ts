/** Area units for the Square Feet Converter (canonical base = square meters). */
export type AreaUnit =
  | 'mm2'
  | 'cm2'
  | 'm2'
  | 'km2'
  | 'in2'
  | 'ft2'
  | 'yd2'
  | 'acre'
  | 'hectare'
  | 'mi2';

export type SqFtSource = 'squareFeet' | 'conversion';

export interface SquareFeetConverterInput {
  source: SqFtSource;
  value: number | null;
  targetUnit: AreaUnit;
}

export interface SquareFeetConverterResult {
  squareFeet: number;
  converted: number;
  targetUnit: AreaUnit;
  explanation: string;
}

export type SquareFeetConverterFieldErrors = Partial<
  Record<'squareFeet' | 'conversion' | 'targetUnit', string>
>;

/** Exact square meters in one unit (international foot / acre definitions). */
export const AREA_TO_SQUARE_METERS: Record<AreaUnit, number> = {
  mm2: 0.000001,
  cm2: 0.0001,
  m2: 1,
  km2: 1_000_000,
  in2: 0.00064516,
  ft2: 0.09290304,
  yd2: 0.83612736,
  acre: 4046.8564224,
  hectare: 10_000,
  mi2: 2_589_988.110336,
};

export const AREA_UNIT_OPTIONS: readonly { value: AreaUnit; label: string; symbol: string }[] = [
  { value: 'mm2', label: 'Square millimeters', symbol: 'mm²' },
  { value: 'cm2', label: 'Square centimeters', symbol: 'cm²' },
  { value: 'm2', label: 'Square meters', symbol: 'm²' },
  { value: 'km2', label: 'Square kilometers', symbol: 'km²' },
  { value: 'in2', label: 'Square inches', symbol: 'in²' },
  { value: 'ft2', label: 'Square feet', symbol: 'ft²' },
  { value: 'yd2', label: 'Square yards', symbol: 'yd²' },
  { value: 'acre', label: 'Acres', symbol: 'ac' },
  { value: 'hectare', label: 'Hectares', symbol: 'ha' },
  { value: 'mi2', label: 'Square miles', symbol: 'mi²' },
] as const;

export const AREA_UNIT_SYMBOL: Record<AreaUnit, string> = Object.fromEntries(
  AREA_UNIT_OPTIONS.map((u) => [u.value, u.symbol]),
) as Record<AreaUnit, string>;

export const DEFAULT_TARGET_UNIT: AreaUnit = 'm2';

export const MAX_ABS_VALUE = 1e18;
