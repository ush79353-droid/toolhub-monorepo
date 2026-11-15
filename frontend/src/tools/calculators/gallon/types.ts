export type CalcMode = 'volume' | 'waterWeight';

export type VolumeUnitId =
  | 'usLiquidGal'
  | 'imperialGal'
  | 'usDryGal'
  | 'uL'
  | 'mL'
  | 'cL'
  | 'dL'
  | 'L'
  | 'hL'
  | 'cm3'
  | 'm3'
  | 'in3'
  | 'ft3'
  | 'yd3'
  | 'usQt'
  | 'impQt'
  | 'usPt'
  | 'impPt'
  | 'usFlOz'
  | 'impFlOz'
  | 'usCup'
  | 'usLegalCup'
  | 'metricCup'
  | 'imperialCup'
  | 'usTbsp'
  | 'usTsp';

export type VolumeFieldId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type WaterSource = 'volume' | 'massKg' | 'massLb';

export interface VolumeUnitDef {
  id: VolumeUnitId;
  symbol: string;
  name: string;
  /** Exact liters in one of this unit. */
  toLiters: number;
}

/** Exact: 1 in³ = 16.387064 mL = 0.016387064 L. */
export const LITERS_PER_CUBIC_INCH = 0.016387064;
/** Exact US dry gallon = 268.8025 in³. */
export const CUBIC_INCHES_PER_US_DRY_GALLON = 268.8025;

export const LITERS_PER_US_LIQUID_GALLON = 3.785411784;
export const LITERS_PER_IMPERIAL_GALLON = 4.54609;
export const LITERS_PER_US_DRY_GALLON =
  CUBIC_INCHES_PER_US_DRY_GALLON * LITERS_PER_CUBIC_INCH; // 4.40488377086

/** Exact: 1 lb = 0.45359237 kg. */
export const KILOGRAMS_PER_POUND = 0.45359237;

/**
 * Approximate water density for simple calculations.
 * Not exact at every temperature; labeled approximate in the UI.
 */
export const APPROX_WATER_DENSITY_KG_PER_L = 1;

export const VOLUME_UNITS: readonly VolumeUnitDef[] = [
  {
    id: 'usLiquidGal',
    symbol: 'US gal',
    name: 'US liquid gallon',
    toLiters: LITERS_PER_US_LIQUID_GALLON,
  },
  {
    id: 'imperialGal',
    symbol: 'Imp. gal',
    name: 'Imperial gallon',
    toLiters: LITERS_PER_IMPERIAL_GALLON,
  },
  {
    id: 'usDryGal',
    symbol: 'US dry gal',
    name: 'US dry gallon',
    toLiters: LITERS_PER_US_DRY_GALLON,
  },
  { id: 'uL', symbol: 'µL', name: 'Microliters', toLiters: 1e-6 },
  { id: 'mL', symbol: 'mL', name: 'Milliliters', toLiters: 0.001 },
  { id: 'cL', symbol: 'cL', name: 'Centiliters', toLiters: 0.01 },
  { id: 'dL', symbol: 'dL', name: 'Deciliters', toLiters: 0.1 },
  { id: 'L', symbol: 'L', name: 'Liters', toLiters: 1 },
  { id: 'hL', symbol: 'hL', name: 'Hectoliters', toLiters: 100 },
  { id: 'cm3', symbol: 'cm³', name: 'Cubic centimeters', toLiters: 0.001 },
  { id: 'm3', symbol: 'm³', name: 'Cubic meters', toLiters: 1000 },
  { id: 'in3', symbol: 'in³', name: 'Cubic inches', toLiters: LITERS_PER_CUBIC_INCH },
  { id: 'ft3', symbol: 'ft³', name: 'Cubic feet', toLiters: 28.316846592 },
  { id: 'yd3', symbol: 'yd³', name: 'Cubic yards', toLiters: 764.554857984 },
  {
    id: 'usQt',
    symbol: 'US qt',
    name: 'US liquid quart',
    toLiters: LITERS_PER_US_LIQUID_GALLON / 4,
  },
  {
    id: 'impQt',
    symbol: 'Imp. qt',
    name: 'Imperial quart',
    toLiters: LITERS_PER_IMPERIAL_GALLON / 4,
  },
  {
    id: 'usPt',
    symbol: 'US pt',
    name: 'US liquid pint',
    toLiters: LITERS_PER_US_LIQUID_GALLON / 8,
  },
  {
    id: 'impPt',
    symbol: 'Imp. pt',
    name: 'Imperial pint',
    toLiters: LITERS_PER_IMPERIAL_GALLON / 8,
  },
  {
    id: 'usFlOz',
    symbol: 'US fl oz',
    name: 'US fluid ounce',
    toLiters: LITERS_PER_US_LIQUID_GALLON / 128,
  },
  {
    id: 'impFlOz',
    symbol: 'Imp. fl oz',
    name: 'Imperial fluid ounce',
    toLiters: LITERS_PER_IMPERIAL_GALLON / 160,
  },
  { id: 'usCup', symbol: 'US cup', name: 'US customary cup', toLiters: 0.2365882365 },
  { id: 'usLegalCup', symbol: 'US legal cup', name: 'US legal cup', toLiters: 0.24 },
  { id: 'metricCup', symbol: 'metric cup', name: 'Metric cup', toLiters: 0.25 },
  {
    id: 'imperialCup',
    symbol: 'Imp. cup',
    name: 'Imperial cup',
    toLiters: 0.284130625,
  },
  {
    id: 'usTbsp',
    symbol: 'tbsp',
    name: 'US tablespoon',
    toLiters: LITERS_PER_US_LIQUID_GALLON / 128 / 2,
  },
  {
    id: 'usTsp',
    symbol: 'tsp',
    name: 'US teaspoon',
    toLiters: LITERS_PER_US_LIQUID_GALLON / 128 / 6,
  },
] as const;

export const VOLUME_UNIT_BY_ID: Record<VolumeUnitId, VolumeUnitDef> = Object.fromEntries(
  VOLUME_UNITS.map((u) => [u.id, u])
) as Record<VolumeUnitId, VolumeUnitDef>;

export const FIELD_LABELS: readonly string[] = [
  'Gallons',
  'Liters and metric volume',
  'Cubic meters / centimeters',
  'Cubic feet, inches, yards',
  'Quarts',
  'Pints',
  'Fluid ounces',
  'Cups and spoons',
] as const;

/** Units offered in each field's dropdown. */
export const FIELD_UNIT_OPTIONS: readonly (readonly VolumeUnitId[])[] = [
  ['usLiquidGal', 'imperialGal', 'usDryGal'],
  ['L', 'mL', 'cL', 'dL', 'hL', 'uL'],
  ['m3', 'cm3'],
  ['ft3', 'in3', 'yd3'],
  ['usQt', 'impQt'],
  ['usPt', 'impPt'],
  ['usFlOz', 'impFlOz'],
  ['usCup', 'usLegalCup', 'metricCup', 'imperialCup', 'usTbsp', 'usTsp'],
] as const;

export const DEFAULT_FIELD_UNITS: readonly [
  VolumeUnitId,
  VolumeUnitId,
  VolumeUnitId,
  VolumeUnitId,
  VolumeUnitId,
  VolumeUnitId,
  VolumeUnitId,
  VolumeUnitId,
] = ['usLiquidGal', 'L', 'm3', 'ft3', 'usQt', 'usPt', 'usFlOz', 'usCup'];

/** Demo: 1 US liquid gallon. */
export const DEFAULT_LITERS = LITERS_PER_US_LIQUID_GALLON;

export const MAX_ABS_VALUE = 1e18;

export type VolumeFieldErrors = Partial<Record<VolumeFieldId, string>>;

export interface VolumeResult {
  liters: number;
  values: readonly [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ];
  units: readonly [
    VolumeUnitId,
    VolumeUnitId,
    VolumeUnitId,
    VolumeUnitId,
    VolumeUnitId,
    VolumeUnitId,
    VolumeUnitId,
    VolumeUnitId,
  ];
}

export interface WaterWeightInput {
  source: WaterSource;
  volume: number | null;
  volumeUnit: VolumeUnitId;
  densityKgPerL: number | null;
  massKg: number | null;
  massLb: number | null;
}

export interface WaterWeightResult {
  source: WaterSource;
  volume: number;
  volumeUnit: VolumeUnitId;
  volumeLiters: number;
  densityKgPerL: number;
  densityApproximate: boolean;
  massKg: number;
  massLb: number;
}

export type WaterFieldErrors = {
  volume?: string;
  densityKgPerL?: string;
  massKg?: string;
  massLb?: string;
};

export const WATER_VOLUME_UNIT_OPTIONS: readonly VolumeUnitId[] = [
  'usLiquidGal',
  'imperialGal',
  'usDryGal',
  'L',
  'mL',
  'ft3',
] as const;

export const DEFAULT_WATER_INPUT: WaterWeightInput = {
  source: 'volume',
  volume: 1,
  volumeUnit: 'usLiquidGal',
  densityKgPerL: APPROX_WATER_DENSITY_KG_PER_L,
  massKg: null,
  massLb: null,
};

export const EMPTY_WATER_INPUT: WaterWeightInput = {
  source: 'volume',
  volume: null,
  volumeUnit: 'usLiquidGal',
  densityKgPerL: APPROX_WATER_DENSITY_KG_PER_L,
  massKg: null,
  massLb: null,
};
