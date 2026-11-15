export type MassCategory =
  | 'metric'
  | 'imperial'
  | 'troy'
  | 'scientific'
  | 'other';

export type MassUnitId =
  | 'pg'
  | 'ng'
  | 'ug'
  | 'mg'
  | 'cg'
  | 'dg'
  | 'g'
  | 'dag'
  | 'hg'
  | 'kg'
  | 't'
  | 'gr'
  | 'dr'
  | 'oz'
  | 'lb'
  | 'st'
  | 'cwtUS'
  | 'cwtImp'
  | 'shortTon'
  | 'longTon'
  | 'ozt'
  | 'troyLb'
  | 'ct'
  | 'u';

export type WeightFieldId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface MassUnitDef {
  id: MassUnitId;
  label: string;
  symbol: string;
  /** Exact kilograms in one of this unit, except `u` (CODATA approx.). */
  kilogramsPerUnit: number;
  category: MassCategory;
  /** When true, factor is experimental / CODATA — not exact by definition. */
  approximate?: boolean;
}

/** Exact: 1 international avoirdupois pound. */
export const KG_PER_POUND = 0.45359237;
/** Exact: 1 avoirdupois ounce = lb / 16. */
export const KG_PER_OUNCE = KG_PER_POUND / 16;
/** Exact: 1 stone = 14 lb. */
export const KG_PER_STONE = KG_PER_POUND * 14;
/** Exact: 1 grain = lb / 7000. */
export const KG_PER_GRAIN = KG_PER_POUND / 7000;
/** Exact: 1 avoirdupois dram = oz / 16. */
export const KG_PER_DRAM = KG_PER_OUNCE / 16;
/** Exact: 1 US short ton = 2000 lb. */
export const KG_PER_SHORT_TON = KG_PER_POUND * 2000;
/** Exact: 1 Imperial long ton = 2240 lb. */
export const KG_PER_LONG_TON = KG_PER_POUND * 2240;
/** Exact: 1 US hundredweight = 100 lb. */
export const KG_PER_CWT_US = KG_PER_POUND * 100;
/** Exact: 1 Imperial hundredweight = 112 lb. */
export const KG_PER_CWT_IMP = KG_PER_POUND * 112;
/** Exact: 1 troy ounce = 31.1034768 g. */
export const KG_PER_TROY_OUNCE = 0.0311034768;
/** Exact: 1 troy pound = 12 troy ounces. */
export const KG_PER_TROY_POUND = KG_PER_TROY_OUNCE * 12;
/** Exact: 1 metric carat = 0.2 g. */
export const KG_PER_CARAT = 0.0002;
/**
 * CODATA 2022 atomic mass unit (dalton): 1.66053906892×10⁻²⁷ kg.
 * Experimental constant — not an exact definition.
 */
export const KG_PER_ATOMIC_MASS_UNIT = 1.66053906892e-27;

export const MASS_UNITS: readonly MassUnitDef[] = [
  { id: 'pg', label: 'Picograms', symbol: 'pg', kilogramsPerUnit: 1e-15, category: 'scientific' },
  { id: 'ng', label: 'Nanograms', symbol: 'ng', kilogramsPerUnit: 1e-12, category: 'scientific' },
  { id: 'ug', label: 'Micrograms', symbol: 'µg', kilogramsPerUnit: 1e-9, category: 'metric' },
  { id: 'mg', label: 'Milligrams', symbol: 'mg', kilogramsPerUnit: 1e-6, category: 'metric' },
  { id: 'cg', label: 'Centigrams', symbol: 'cg', kilogramsPerUnit: 1e-5, category: 'metric' },
  { id: 'dg', label: 'Decigrams', symbol: 'dg', kilogramsPerUnit: 1e-4, category: 'metric' },
  { id: 'g', label: 'Grams', symbol: 'g', kilogramsPerUnit: 0.001, category: 'metric' },
  { id: 'dag', label: 'Decagrams', symbol: 'dag', kilogramsPerUnit: 0.01, category: 'metric' },
  { id: 'hg', label: 'Hectograms', symbol: 'hg', kilogramsPerUnit: 0.1, category: 'metric' },
  { id: 'kg', label: 'Kilograms', symbol: 'kg', kilogramsPerUnit: 1, category: 'metric' },
  { id: 't', label: 'Metric tonnes', symbol: 't', kilogramsPerUnit: 1000, category: 'metric' },
  { id: 'gr', label: 'Grains', symbol: 'gr', kilogramsPerUnit: KG_PER_GRAIN, category: 'imperial' },
  { id: 'dr', label: 'Drams', symbol: 'dr', kilogramsPerUnit: KG_PER_DRAM, category: 'imperial' },
  {
    id: 'oz',
    label: 'Avoirdupois ounces',
    symbol: 'oz',
    kilogramsPerUnit: KG_PER_OUNCE,
    category: 'imperial',
  },
  {
    id: 'lb',
    label: 'Pounds',
    symbol: 'lb',
    kilogramsPerUnit: KG_PER_POUND,
    category: 'imperial',
  },
  {
    id: 'st',
    label: 'Stones',
    symbol: 'st',
    kilogramsPerUnit: KG_PER_STONE,
    category: 'imperial',
  },
  {
    id: 'cwtUS',
    label: 'US hundredweight',
    symbol: 'cwt (US)',
    kilogramsPerUnit: KG_PER_CWT_US,
    category: 'imperial',
  },
  {
    id: 'cwtImp',
    label: 'Imperial hundredweight',
    symbol: 'cwt (Imp)',
    kilogramsPerUnit: KG_PER_CWT_IMP,
    category: 'imperial',
  },
  {
    id: 'shortTon',
    label: 'US short tons',
    symbol: 'US ton',
    kilogramsPerUnit: KG_PER_SHORT_TON,
    category: 'imperial',
  },
  {
    id: 'longTon',
    label: 'Imperial long tons',
    symbol: 'long ton',
    kilogramsPerUnit: KG_PER_LONG_TON,
    category: 'imperial',
  },
  {
    id: 'ozt',
    label: 'Troy ounces',
    symbol: 'oz t',
    kilogramsPerUnit: KG_PER_TROY_OUNCE,
    category: 'troy',
  },
  {
    id: 'troyLb',
    label: 'Troy pounds',
    symbol: 'lb t',
    kilogramsPerUnit: KG_PER_TROY_POUND,
    category: 'troy',
  },
  {
    id: 'ct',
    label: 'Metric carats',
    symbol: 'ct',
    kilogramsPerUnit: KG_PER_CARAT,
    category: 'other',
  },
  {
    id: 'u',
    label: 'Atomic mass units (u / Da)',
    symbol: 'u',
    kilogramsPerUnit: KG_PER_ATOMIC_MASS_UNIT,
    category: 'scientific',
    approximate: true,
  },
] as const;

export const MASS_UNIT_BY_ID: Record<MassUnitId, MassUnitDef> = Object.fromEntries(
  MASS_UNITS.map((u) => [u.id, u])
) as Record<MassUnitId, MassUnitDef>;

export const FIELD_LABELS: readonly string[] = [
  'Mass in milligrams',
  'Mass in grams',
  'Mass in kilograms',
  'Mass in ounces',
  'Mass in pounds',
  'Mass in stones',
  'Mass in tonnes',
  'Mass in troy ounces',
] as const;

export const DEFAULT_FIELD_UNITS: readonly [
  MassUnitId,
  MassUnitId,
  MassUnitId,
  MassUnitId,
  MassUnitId,
  MassUnitId,
  MassUnitId,
  MassUnitId,
] = ['mg', 'g', 'kg', 'oz', 'lb', 'st', 't', 'ozt'];

/** Extra rows in More Conversion Options (not the eight primary fields). */
export const OTHER_UNIT_IDS: readonly MassUnitId[] = [
  'pg',
  'ng',
  'ug',
  'cg',
  'dg',
  'dag',
  'hg',
  'gr',
  'dr',
  'cwtUS',
  'cwtImp',
  'shortTon',
  'longTon',
  'troyLb',
  'ct',
  'u',
];

/** Demo: 1 kg. */
export const DEFAULT_KILOGRAMS = 1;

export const MAX_ABS_VALUE = 1e30;

export type WeightConverterFieldErrors = Partial<Record<WeightFieldId, string>>;

export interface OtherUnitRow {
  id: MassUnitId;
  label: string;
  symbol: string;
  value: number;
  approximate?: boolean;
}

export interface WeightConverterResult {
  kilograms: number;
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
    MassUnitId,
    MassUnitId,
    MassUnitId,
    MassUnitId,
    MassUnitId,
    MassUnitId,
    MassUnitId,
    MassUnitId,
  ];
  otherUnits: readonly OtherUnitRow[];
}
