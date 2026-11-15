export type ForceCategory =
  | 'si'
  | 'cgs'
  | 'gravitational'
  | 'imperial'
  | 'other';

export type ForceUnitId =
  | 'uN'
  | 'mN'
  | 'N'
  | 'kN'
  | 'MN'
  | 'GN'
  | 'dyn'
  | 'kdyn'
  | 'gf'
  | 'kgf'
  | 'tf'
  | 'lbf'
  | 'ozf'
  | 'kip'
  | 'pdl'
  | 'shortTonf'
  | 'longTonf';

export type ForceFieldId = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface ForceUnitDef {
  id: ForceUnitId;
  label: string;
  symbol: string;
  newtonsPerUnit: number;
  category: ForceCategory;
}

/** Conventional standard gravity (exact). */
export const STANDARD_GRAVITY = 9.80665;
/** Exact: 1 international avoirdupois pound. */
export const KG_PER_POUND = 0.45359237;
/** Exact: international foot. */
export const METERS_PER_FOOT = 0.3048;

/** Exact: 1 lbf = lb × g₀. */
export const NEWTONS_PER_LBF = KG_PER_POUND * STANDARD_GRAVITY;
/** Exact: 1 kgf = g₀ N. */
export const NEWTONS_PER_KGF = STANDARD_GRAVITY;
/** Exact: 1 gf = kgf / 1000. */
export const NEWTONS_PER_GF = NEWTONS_PER_KGF / 1000;
/** Exact: 1 metric tonne-force = 1000 kgf. */
export const NEWTONS_PER_TF = NEWTONS_PER_KGF * 1000;
/** Exact: 1 dyne = 10⁻⁵ N = 1/100000 N. */
export const NEWTONS_PER_DYNE = 1 / 100_000;
/** Exact: 1 poundal = 1 lb·ft/s². */
export const NEWTONS_PER_POUNDAL = KG_PER_POUND * METERS_PER_FOOT;

export const FORCE_UNITS: readonly ForceUnitDef[] = [
  { id: 'uN', label: 'Micronewtons', symbol: 'µN', newtonsPerUnit: 1e-6, category: 'si' },
  { id: 'mN', label: 'Millinewtons', symbol: 'mN', newtonsPerUnit: 0.001, category: 'si' },
  { id: 'N', label: 'Newtons', symbol: 'N', newtonsPerUnit: 1, category: 'si' },
  { id: 'kN', label: 'Kilonewtons', symbol: 'kN', newtonsPerUnit: 1000, category: 'si' },
  { id: 'MN', label: 'Meganewtons', symbol: 'MN', newtonsPerUnit: 1e6, category: 'si' },
  { id: 'GN', label: 'Giganewtons', symbol: 'GN', newtonsPerUnit: 1e9, category: 'si' },
  { id: 'dyn', label: 'Dynes', symbol: 'dyn', newtonsPerUnit: NEWTONS_PER_DYNE, category: 'cgs' },
  {
    id: 'kdyn',
    label: 'Kilodynes',
    symbol: 'kdyn',
    newtonsPerUnit: NEWTONS_PER_DYNE * 1000,
    category: 'cgs',
  },
  {
    id: 'gf',
    label: 'Grams-force',
    symbol: 'gf',
    newtonsPerUnit: NEWTONS_PER_GF,
    category: 'gravitational',
  },
  {
    id: 'kgf',
    label: 'Kilograms-force',
    symbol: 'kgf',
    newtonsPerUnit: NEWTONS_PER_KGF,
    category: 'gravitational',
  },
  {
    id: 'tf',
    label: 'Metric tonnes-force',
    symbol: 'tf',
    newtonsPerUnit: NEWTONS_PER_TF,
    category: 'gravitational',
  },
  {
    id: 'lbf',
    label: 'Pounds-force',
    symbol: 'lbf',
    newtonsPerUnit: NEWTONS_PER_LBF,
    category: 'imperial',
  },
  {
    id: 'ozf',
    label: 'Ounces-force',
    symbol: 'ozf',
    newtonsPerUnit: NEWTONS_PER_LBF / 16,
    category: 'imperial',
  },
  {
    id: 'kip',
    label: 'Kip-force',
    symbol: 'kip',
    newtonsPerUnit: NEWTONS_PER_LBF * 1000,
    category: 'imperial',
  },
  {
    id: 'pdl',
    label: 'Poundals',
    symbol: 'pdl',
    newtonsPerUnit: NEWTONS_PER_POUNDAL,
    category: 'imperial',
  },
  {
    id: 'shortTonf',
    label: 'US short tons-force',
    symbol: 'tonf (US)',
    newtonsPerUnit: NEWTONS_PER_LBF * 2000,
    category: 'imperial',
  },
  {
    id: 'longTonf',
    label: 'Imperial long tons-force',
    symbol: 'tonf (Imp)',
    newtonsPerUnit: NEWTONS_PER_LBF * 2240,
    category: 'imperial',
  },
] as const;

export const FORCE_UNIT_BY_ID: Record<ForceUnitId, ForceUnitDef> = Object.fromEntries(
  FORCE_UNITS.map((u) => [u.id, u])
) as Record<ForceUnitId, ForceUnitDef>;

export const FIELD_LABELS: readonly string[] = [
  'Newtons',
  'Kilonewtons',
  'Dynes',
  'Pounds-force',
  'Grams-force',
  'Kilograms-force',
  'Tonnes-force',
] as const;

export const DEFAULT_FIELD_UNITS: readonly [
  ForceUnitId,
  ForceUnitId,
  ForceUnitId,
  ForceUnitId,
  ForceUnitId,
  ForceUnitId,
  ForceUnitId,
] = ['N', 'kN', 'dyn', 'lbf', 'gf', 'kgf', 'tf'];

/** Extra rows in More Force Units (not the seven primary fields). */
export const OTHER_UNIT_IDS: readonly ForceUnitId[] = [
  'uN',
  'mN',
  'MN',
  'GN',
  'kdyn',
  'ozf',
  'kip',
  'pdl',
  'shortTonf',
  'longTonf',
];

/** Demo: 1 N. */
export const DEFAULT_NEWTONS = 1;

export const MAX_ABS_VALUE = 1e30;

export type ForceConverterFieldErrors = Partial<Record<ForceFieldId, string>>;

export interface OtherUnitRow {
  id: ForceUnitId;
  label: string;
  symbol: string;
  value: number;
}

export interface ForceConverterResult {
  newtons: number;
  values: readonly [number, number, number, number, number, number, number];
  units: readonly [
    ForceUnitId,
    ForceUnitId,
    ForceUnitId,
    ForceUnitId,
    ForceUnitId,
    ForceUnitId,
    ForceUnitId,
  ];
  otherUnits: readonly OtherUnitRow[];
}
