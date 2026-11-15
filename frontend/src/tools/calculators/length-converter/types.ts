export type LengthCategory = 'metric' | 'imperial' | 'nautical' | 'scientific';

export type LengthUnitId =
  | 'nm'
  | 'um'
  | 'mm'
  | 'cm'
  | 'dm'
  | 'm'
  | 'dam'
  | 'hm'
  | 'km'
  | 'in'
  | 'ft'
  | 'yd'
  | 'mi'
  | 'thou'
  | 'fur'
  | 'ch'
  | 'rd'
  | 'ftm'
  | 'nmi'
  | 'cable'
  | 'angstrom'
  | 'pm'
  | 'au'
  | 'ly'
  | 'pc';

export type LengthFieldId = 0 | 1 | 2 | 3 | 4 | 5;

export interface LengthUnitDef {
  id: LengthUnitId;
  label: string;
  symbol: string;
  factorToMeters: number;
  category: LengthCategory;
}

/** Exact SI / international definitions. */
export const SPEED_OF_LIGHT_MPS = 299_792_458;
/** Julian year in seconds (365.25 days). */
export const JULIAN_YEAR_SECONDS = 365.25 * 24 * 3600;
/** 1 ly = c × Julian year. */
export const METERS_PER_LIGHT_YEAR = SPEED_OF_LIGHT_MPS * JULIAN_YEAR_SECONDS;
/** 1 AU exact. */
export const METERS_PER_AU = 149_597_870_700;
/** 1 pc = (648000/π) AU. */
export const METERS_PER_PARSEC = (648_000 / Math.PI) * METERS_PER_AU;
/** International cable = 1/10 nmi. */
export const METERS_PER_CABLE = 185.2;

export const LENGTH_UNITS: readonly LengthUnitDef[] = [
  { id: 'nm', label: 'Nanometers', symbol: 'nm', factorToMeters: 1e-9, category: 'metric' },
  { id: 'um', label: 'Micrometers', symbol: 'µm', factorToMeters: 1e-6, category: 'metric' },
  { id: 'mm', label: 'Millimeters', symbol: 'mm', factorToMeters: 0.001, category: 'metric' },
  { id: 'cm', label: 'Centimeters', symbol: 'cm', factorToMeters: 0.01, category: 'metric' },
  { id: 'dm', label: 'Decimeters', symbol: 'dm', factorToMeters: 0.1, category: 'metric' },
  { id: 'm', label: 'Meters', symbol: 'm', factorToMeters: 1, category: 'metric' },
  { id: 'dam', label: 'Decameters', symbol: 'dam', factorToMeters: 10, category: 'metric' },
  { id: 'hm', label: 'Hectometers', symbol: 'hm', factorToMeters: 100, category: 'metric' },
  { id: 'km', label: 'Kilometers', symbol: 'km', factorToMeters: 1000, category: 'metric' },
  { id: 'in', label: 'Inches', symbol: 'in', factorToMeters: 0.0254, category: 'imperial' },
  { id: 'ft', label: 'Feet', symbol: 'ft', factorToMeters: 0.3048, category: 'imperial' },
  { id: 'yd', label: 'Yards', symbol: 'yd', factorToMeters: 0.9144, category: 'imperial' },
  { id: 'mi', label: 'Miles', symbol: 'mi', factorToMeters: 1609.344, category: 'imperial' },
  { id: 'thou', label: 'Thou / mil', symbol: 'thou', factorToMeters: 0.0000254, category: 'imperial' },
  { id: 'fur', label: 'Furlongs', symbol: 'fur', factorToMeters: 201.168, category: 'imperial' },
  { id: 'ch', label: 'Chains', symbol: 'ch', factorToMeters: 20.1168, category: 'imperial' },
  { id: 'rd', label: 'Rods', symbol: 'rd', factorToMeters: 5.0292, category: 'imperial' },
  { id: 'ftm', label: 'Fathoms', symbol: 'ftm', factorToMeters: 1.8288, category: 'imperial' },
  { id: 'nmi', label: 'Nautical miles', symbol: 'nmi', factorToMeters: 1852, category: 'nautical' },
  {
    id: 'cable',
    label: 'Cables (1/10 nmi)',
    symbol: 'cable',
    factorToMeters: METERS_PER_CABLE,
    category: 'nautical',
  },
  {
    id: 'angstrom',
    label: 'Ångströms',
    symbol: 'Å',
    factorToMeters: 1e-10,
    category: 'scientific',
  },
  { id: 'pm', label: 'Picometers', symbol: 'pm', factorToMeters: 1e-12, category: 'scientific' },
  { id: 'au', label: 'Astronomical units', symbol: 'AU', factorToMeters: METERS_PER_AU, category: 'scientific' },
  {
    id: 'ly',
    label: 'Light-years',
    symbol: 'ly',
    factorToMeters: METERS_PER_LIGHT_YEAR,
    category: 'scientific',
  },
  {
    id: 'pc',
    label: 'Parsecs',
    symbol: 'pc',
    factorToMeters: METERS_PER_PARSEC,
    category: 'scientific',
  },
] as const;

export const LENGTH_UNIT_BY_ID: Record<LengthUnitId, LengthUnitDef> = Object.fromEntries(
  LENGTH_UNITS.map((u) => [u.id, u])
) as Record<LengthUnitId, LengthUnitDef>;

export const FIELD_LABELS: readonly string[] = [
  'Length in meters',
  'Length in kilometers',
  'Length in centimeters',
  'Length in feet',
  'Length in inches',
  'Length in miles',
] as const;

export const DEFAULT_FIELD_UNITS: readonly [
  LengthUnitId,
  LengthUnitId,
  LengthUnitId,
  LengthUnitId,
  LengthUnitId,
  LengthUnitId,
] = ['m', 'km', 'cm', 'ft', 'in', 'mi'];

/** Extra rows in the expandable Other Units section. */
export const OTHER_UNIT_IDS: readonly LengthUnitId[] = [
  'mm',
  'um',
  'nm',
  'yd',
  'nmi',
  'fur',
  'ch',
  'au',
  'ly',
  'pc',
];

/** Demo: 100 m. */
export const DEFAULT_METERS = 100;

export const MAX_ABS_VALUE = 1e30;

export type LengthConverterFieldErrors = Partial<Record<LengthFieldId, string>>;

export interface OtherUnitRow {
  id: LengthUnitId;
  label: string;
  symbol: string;
  value: number;
}

export interface LengthConverterResult {
  meters: number;
  values: readonly [number, number, number, number, number, number];
  units: readonly [
    LengthUnitId,
    LengthUnitId,
    LengthUnitId,
    LengthUnitId,
    LengthUnitId,
    LengthUnitId,
  ];
  otherUnits: readonly OtherUnitRow[];
}
