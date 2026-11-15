import {
  METERS_PER_INCH,
  NEWTONS_PER_LBF,
  STANDARD_GRAVITY,
} from '../../shared/torque';

export type PressureCategory =
  | 'si'
  | 'metric'
  | 'imperial'
  | 'atmospheric'
  | 'other';

export type PressureUnitId =
  | 'Pa'
  | 'mPa'
  | 'hPa'
  | 'kPa'
  | 'MPa'
  | 'GPa'
  | 'bar'
  | 'mbar'
  | 'psi'
  | 'ksi'
  | 'psf'
  | 'atm'
  | 'at'
  | 'Torr'
  | 'mmHg'
  | 'inHg'
  | 'inH2O'
  | 'cmH2O'
  | 'kgfcm2'
  | 'Ba';

export type PressureFieldId = 0 | 1 | 2 | 3;

export interface PressureUnitDef {
  id: PressureUnitId;
  label: string;
  symbol: string;
  pascalsPerUnit: number;
  category: PressureCategory;
}

/** Exact: 1 bar = 10⁵ Pa. */
export const PASCALS_PER_BAR = 100_000;
/** Exact: 1 standard atmosphere. */
export const PASCALS_PER_ATM = 101_325;
/** Exact: 1 psi = lbf / in². */
export const PASCALS_PER_PSI = NEWTONS_PER_LBF / (METERS_PER_INCH * METERS_PER_INCH);
/** Exact: 1 Torr = 1 atm / 760. */
export const PASCALS_PER_TORR = PASCALS_PER_ATM / 760;
/**
 * Conventional mmHg (CIPM): 133.322387415 Pa.
 * Distinct from Torr (101325/760 ≈ 133.322368421 Pa).
 */
export const PASCALS_PER_MMHG = 133.322387415;
/** Conventional inHg = 25.4 × conventional mmHg. */
export const PASCALS_PER_INHG = PASCALS_PER_MMHG * 25.4;
/**
 * Conventional water column: ρ = 1000 kg/m³, g₀.
 * 1 cmH₂O = 98.0665 Pa; 1 inH₂O = 2.54 × that.
 */
export const PASCALS_PER_CMH2O = STANDARD_GRAVITY * 10;
export const PASCALS_PER_INH2O = PASCALS_PER_CMH2O * 2.54;
/** Exact: 1 technical atmosphere = 1 kgf/cm². */
export const PASCALS_PER_AT = STANDARD_GRAVITY * 10_000;
/** Exact: 1 barye = 0.1 Pa. */
export const PASCALS_PER_BA = 0.1;

export const PRESSURE_UNITS: readonly PressureUnitDef[] = [
  { id: 'Pa', label: 'Pascals', symbol: 'Pa', pascalsPerUnit: 1, category: 'si' },
  { id: 'mPa', label: 'Millipascals', symbol: 'mPa', pascalsPerUnit: 0.001, category: 'si' },
  { id: 'hPa', label: 'Hectopascals', symbol: 'hPa', pascalsPerUnit: 100, category: 'si' },
  { id: 'kPa', label: 'Kilopascals', symbol: 'kPa', pascalsPerUnit: 1000, category: 'si' },
  { id: 'MPa', label: 'Megapascals', symbol: 'MPa', pascalsPerUnit: 1e6, category: 'si' },
  { id: 'GPa', label: 'Gigapascals', symbol: 'GPa', pascalsPerUnit: 1e9, category: 'si' },
  { id: 'bar', label: 'Bars', symbol: 'bar', pascalsPerUnit: PASCALS_PER_BAR, category: 'metric' },
  {
    id: 'mbar',
    label: 'Millibars',
    symbol: 'mbar',
    pascalsPerUnit: PASCALS_PER_BAR / 1000,
    category: 'metric',
  },
  {
    id: 'psi',
    label: 'Pounds per square inch',
    symbol: 'psi',
    pascalsPerUnit: PASCALS_PER_PSI,
    category: 'imperial',
  },
  {
    id: 'ksi',
    label: 'Kilopounds per square inch',
    symbol: 'ksi',
    pascalsPerUnit: PASCALS_PER_PSI * 1000,
    category: 'imperial',
  },
  {
    id: 'psf',
    label: 'Pounds per square foot',
    symbol: 'psf',
    pascalsPerUnit: PASCALS_PER_PSI / 144,
    category: 'imperial',
  },
  {
    id: 'atm',
    label: 'Standard atmospheres',
    symbol: 'atm',
    pascalsPerUnit: PASCALS_PER_ATM,
    category: 'atmospheric',
  },
  {
    id: 'at',
    label: 'Technical atmospheres',
    symbol: 'at',
    pascalsPerUnit: PASCALS_PER_AT,
    category: 'atmospheric',
  },
  {
    id: 'Torr',
    label: 'Torr',
    symbol: 'Torr',
    pascalsPerUnit: PASCALS_PER_TORR,
    category: 'atmospheric',
  },
  {
    id: 'mmHg',
    label: 'Millimeters of mercury',
    symbol: 'mmHg',
    pascalsPerUnit: PASCALS_PER_MMHG,
    category: 'atmospheric',
  },
  {
    id: 'inHg',
    label: 'Inches of mercury',
    symbol: 'inHg',
    pascalsPerUnit: PASCALS_PER_INHG,
    category: 'atmospheric',
  },
  {
    id: 'inH2O',
    label: 'Inches of water',
    symbol: 'inH₂O',
    pascalsPerUnit: PASCALS_PER_INH2O,
    category: 'other',
  },
  {
    id: 'cmH2O',
    label: 'Centimeters of water',
    symbol: 'cmH₂O',
    pascalsPerUnit: PASCALS_PER_CMH2O,
    category: 'other',
  },
  {
    id: 'kgfcm2',
    label: 'Kilograms-force per square centimeter',
    symbol: 'kgf/cm²',
    pascalsPerUnit: PASCALS_PER_AT,
    category: 'other',
  },
  {
    id: 'Ba',
    label: 'Baryes',
    symbol: 'Ba',
    pascalsPerUnit: PASCALS_PER_BA,
    category: 'other',
  },
] as const;

export const PRESSURE_UNIT_BY_ID: Record<PressureUnitId, PressureUnitDef> = Object.fromEntries(
  PRESSURE_UNITS.map((u) => [u.id, u])
) as Record<PressureUnitId, PressureUnitDef>;

export const FIELD_LABELS: readonly string[] = [
  'Pressure in bar',
  'Pressure in pounds per square inch',
  'Pressure in atmospheres',
  'Pressure in pascals',
] as const;

export const DEFAULT_FIELD_UNITS: readonly [
  PressureUnitId,
  PressureUnitId,
  PressureUnitId,
  PressureUnitId,
] = ['bar', 'psi', 'atm', 'Pa'];

/** Extra rows in More Conversion Options (not the four primary defaults). */
export const OTHER_UNIT_IDS: readonly PressureUnitId[] = [
  'mPa',
  'hPa',
  'kPa',
  'MPa',
  'GPa',
  'mbar',
  'Torr',
  'mmHg',
  'inHg',
  'at',
  'ksi',
  'psf',
  'inH2O',
  'cmH2O',
  'kgfcm2',
  'Ba',
];

/** Demo: 1 bar. */
export const DEFAULT_PASCALS = PASCALS_PER_BAR;

export const MAX_ABS_VALUE = 1e30;

export type PressureConverterFieldErrors = Partial<Record<PressureFieldId, string>>;

export interface OtherUnitRow {
  id: PressureUnitId;
  label: string;
  symbol: string;
  value: number;
}

export interface PressureConverterResult {
  pascals: number;
  values: readonly [number, number, number, number];
  units: readonly [PressureUnitId, PressureUnitId, PressureUnitId, PressureUnitId];
  otherUnits: readonly OtherUnitRow[];
}
