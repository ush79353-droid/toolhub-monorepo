/** Supported area unit ids (canonical factors are square meters per 1 unit). */
export type AreaUnitId =
  | 'mm2'
  | 'cm2'
  | 'dm2'
  | 'm2'
  | 'dam2'
  | 'hm2'
  | 'km2'
  | 'in2'
  | 'ft2'
  | 'yd2'
  | 'mi2'
  | 'a'
  | 'daa'
  | 'ha'
  | 'ac';

export type AreaFieldId = 0 | 1 | 2 | 3 | 4;

export interface AreaUnitDef {
  id: AreaUnitId;
  symbol: string;
  name: string;
  /** Exact square meters in one of this unit. */
  toSquareMeters: number;
}

export const AREA_UNITS: readonly AreaUnitDef[] = [
  { id: 'mm2', symbol: 'mm²', name: 'Square millimeters', toSquareMeters: 0.000001 },
  { id: 'cm2', symbol: 'cm²', name: 'Square centimeters', toSquareMeters: 0.0001 },
  { id: 'dm2', symbol: 'dm²', name: 'Square decimeters', toSquareMeters: 0.01 },
  { id: 'm2', symbol: 'm²', name: 'Square meters', toSquareMeters: 1 },
  { id: 'dam2', symbol: 'dam²', name: 'Square decameters', toSquareMeters: 100 },
  { id: 'hm2', symbol: 'hm²', name: 'Square hectometers', toSquareMeters: 10_000 },
  { id: 'km2', symbol: 'km²', name: 'Square kilometers', toSquareMeters: 1_000_000 },
  { id: 'in2', symbol: 'in²', name: 'Square inches', toSquareMeters: 0.00064516 },
  { id: 'ft2', symbol: 'ft²', name: 'Square feet', toSquareMeters: 0.09290304 },
  { id: 'yd2', symbol: 'yd²', name: 'Square yards', toSquareMeters: 0.83612736 },
  { id: 'mi2', symbol: 'mi²', name: 'Square miles', toSquareMeters: 2_589_988.110336 },
  { id: 'a', symbol: 'a', name: 'Ares', toSquareMeters: 100 },
  { id: 'daa', symbol: 'daa', name: 'Decares', toSquareMeters: 1_000 },
  { id: 'ha', symbol: 'ha', name: 'Hectares', toSquareMeters: 10_000 },
  { id: 'ac', symbol: 'ac', name: 'Acres', toSquareMeters: 4046.8564224 },
] as const;

export const AREA_UNIT_BY_ID: Record<AreaUnitId, AreaUnitDef> = Object.fromEntries(
  AREA_UNITS.map((u) => [u.id, u])
) as Record<AreaUnitId, AreaUnitDef>;

export const FIELD_LABELS: readonly string[] = [
  'Area in square meters',
  'Area in square feet',
  'Area in metric units',
  'Area in imperial units',
  'Area in other units',
] as const;

export const DEFAULT_FIELD_UNITS: readonly [
  AreaUnitId,
  AreaUnitId,
  AreaUnitId,
  AreaUnitId,
  AreaUnitId,
] = ['m2', 'ft2', 'cm2', 'yd2', 'a'];

/** Demo: 100 m². */
export const DEFAULT_SQUARE_METERS = 100;

export const MAX_ABS_VALUE = 1e18;

export type AreaConverterFieldErrors = Partial<Record<AreaFieldId, string>>;

export interface AreaConverterResult {
  squareMeters: number;
  /** Display values for each field in its current unit. */
  values: readonly [number, number, number, number, number];
  units: readonly [AreaUnitId, AreaUnitId, AreaUnitId, AreaUnitId, AreaUnitId];
}
