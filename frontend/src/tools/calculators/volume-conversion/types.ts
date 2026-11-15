export type VolumeUnitId =
  | 'uL'
  | 'mL'
  | 'cL'
  | 'dL'
  | 'L'
  | 'hL'
  | 'kL'
  | 'mm3'
  | 'cm3'
  | 'dm3'
  | 'm3'
  | 'in3'
  | 'ft3'
  | 'yd3'
  | 'usLiquidGal'
  | 'imperialGal'
  | 'usDryGal'
  | 'usQt'
  | 'impQt'
  | 'usDryQt'
  | 'usPt'
  | 'impPt'
  | 'usDryPt'
  | 'usCup'
  | 'usLegalCup'
  | 'metricCup'
  | 'imperialCup'
  | 'usFlOz'
  | 'impFlOz'
  | 'usTbsp'
  | 'metricTbsp'
  | 'auTbsp'
  | 'usTsp'
  | 'metricTsp'
  | 'usBushel';

export type VolumeFieldId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface VolumeUnitDef {
  id: VolumeUnitId;
  symbol: string;
  name: string;
  /** Exact liters in one of this unit. */
  toLiters: number;
}

export const LITERS_PER_CUBIC_INCH = 0.016387064;
export const CUBIC_INCHES_PER_US_DRY_GALLON = 268.8025;
export const LITERS_PER_US_LIQUID_GALLON = 3.785411784;
export const LITERS_PER_IMPERIAL_GALLON = 4.54609;
export const LITERS_PER_US_DRY_GALLON =
  CUBIC_INCHES_PER_US_DRY_GALLON * LITERS_PER_CUBIC_INCH;
/** Exact: 1 US bushel = 2150.42 in³. */
export const LITERS_PER_US_BUSHEL = 2150.42 * LITERS_PER_CUBIC_INCH;
export const LITERS_PER_US_DRY_PINT = LITERS_PER_US_DRY_GALLON / 8;
export const LITERS_PER_US_DRY_QUART = LITERS_PER_US_DRY_GALLON / 4;

export const VOLUME_UNITS: readonly VolumeUnitDef[] = [
  { id: 'uL', symbol: 'µL', name: 'Microliters', toLiters: 1e-6 },
  { id: 'mL', symbol: 'mL', name: 'Milliliters', toLiters: 0.001 },
  { id: 'cL', symbol: 'cL', name: 'Centiliters', toLiters: 0.01 },
  { id: 'dL', symbol: 'dL', name: 'Deciliters', toLiters: 0.1 },
  { id: 'L', symbol: 'L', name: 'Liters', toLiters: 1 },
  { id: 'hL', symbol: 'hL', name: 'Hectoliters', toLiters: 100 },
  { id: 'kL', symbol: 'kL', name: 'Kiloliters', toLiters: 1000 },
  { id: 'mm3', symbol: 'mm³', name: 'Cubic millimeters', toLiters: 1e-6 },
  { id: 'cm3', symbol: 'cm³', name: 'Cubic centimeters', toLiters: 0.001 },
  { id: 'dm3', symbol: 'dm³', name: 'Cubic decimeters', toLiters: 1 },
  { id: 'm3', symbol: 'm³', name: 'Cubic meters', toLiters: 1000 },
  { id: 'in3', symbol: 'in³', name: 'Cubic inches', toLiters: LITERS_PER_CUBIC_INCH },
  { id: 'ft3', symbol: 'ft³', name: 'Cubic feet', toLiters: 28.316846592 },
  { id: 'yd3', symbol: 'yd³', name: 'Cubic yards', toLiters: 764.554857984 },
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
    id: 'usDryQt',
    symbol: 'US dry qt',
    name: 'US dry quart',
    toLiters: LITERS_PER_US_DRY_QUART,
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
    id: 'usDryPt',
    symbol: 'US dry pt',
    name: 'US dry pint',
    toLiters: LITERS_PER_US_DRY_PINT,
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
  {
    id: 'usTbsp',
    symbol: 'US tbsp',
    name: 'US tablespoon',
    toLiters: LITERS_PER_US_LIQUID_GALLON / 256,
  },
  { id: 'metricTbsp', symbol: 'metric tbsp', name: 'Metric tablespoon', toLiters: 0.015 },
  {
    id: 'auTbsp',
    symbol: 'AU tbsp',
    name: 'Australian metric tablespoon',
    toLiters: 0.02,
  },
  {
    id: 'usTsp',
    symbol: 'US tsp',
    name: 'US teaspoon',
    toLiters: LITERS_PER_US_LIQUID_GALLON / 768,
  },
  { id: 'metricTsp', symbol: 'metric tsp', name: 'Metric teaspoon', toLiters: 0.005 },
  {
    id: 'usBushel',
    symbol: 'US bu',
    name: 'US bushel',
    toLiters: LITERS_PER_US_BUSHEL,
  },
] as const;

export const VOLUME_UNIT_BY_ID: Record<VolumeUnitId, VolumeUnitDef> = Object.fromEntries(
  VOLUME_UNITS.map((u) => [u.id, u])
) as Record<VolumeUnitId, VolumeUnitDef>;

export const FIELD_LABELS: readonly string[] = [
  'Volume in milliliters',
  'Volume in liters',
  'Volume in gallons',
  'Volume in quarts',
  'Volume in pints',
  'Volume in cups',
  'Volume in fluid ounces',
  'Volume in tablespoons',
  'Volume in teaspoons',
] as const;

/** Units offered in each primary field's dropdown. */
export const FIELD_UNIT_OPTIONS: readonly (readonly VolumeUnitId[])[] = [
  ['mL', 'uL', 'cL', 'cm3'],
  ['L', 'dL', 'hL', 'kL', 'm3'],
  ['usLiquidGal', 'imperialGal', 'usDryGal'],
  ['usQt', 'impQt', 'usDryQt'],
  ['usPt', 'impPt', 'usDryPt'],
  ['usCup', 'usLegalCup', 'metricCup', 'imperialCup'],
  ['usFlOz', 'impFlOz'],
  ['usTbsp', 'metricTbsp', 'auTbsp'],
  ['usTsp', 'metricTsp'],
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
  VolumeUnitId,
] = [
  'mL',
  'L',
  'usLiquidGal',
  'usQt',
  'usPt',
  'usCup',
  'usFlOz',
  'usTbsp',
  'usTsp',
];

/** Units shown in More Conversion Options (derived, not primary fields). */
export const MORE_OPTION_UNITS: readonly VolumeUnitId[] = [
  'uL',
  'cL',
  'dL',
  'hL',
  'kL',
  'mm3',
  'cm3',
  'dm3',
  'm3',
  'in3',
  'ft3',
  'yd3',
  'usDryPt',
  'usDryQt',
  'usDryGal',
  'usBushel',
  'usLegalCup',
  'metricCup',
  'imperialCup',
  'metricTsp',
  'metricTbsp',
  'auTbsp',
] as const;

/** Demo: 1 liter. */
export const DEFAULT_LITERS = 1;

export const MAX_ABS_VALUE = 1e18;

export type VolumeFieldErrors = Partial<Record<VolumeFieldId, string>>;

export interface OtherUnitRow {
  unit: VolumeUnitId;
  label: string;
  symbol: string;
  value: number;
}

export interface VolumeConversionResult {
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
    VolumeUnitId,
  ];
  moreOptions: readonly OtherUnitRow[];
}
