/** Extra volume units in More Conversion Options. */
export type ExtraVolumeUnit =
  | 'mL'
  | 'L'
  | 'usFlOz'
  | 'usPt'
  | 'usQt'
  | 'impFlOz'
  | 'impPt';

export const EXTRA_VOLUME_UNITS = [
  'mL',
  'L',
  'usFlOz',
  'usPt',
  'usQt',
  'impFlOz',
  'impPt',
] as const satisfies readonly ExtraVolumeUnit[];

export const EXTRA_VOLUME_LABELS: Record<ExtraVolumeUnit, string> = {
  mL: 'Milliliters',
  L: 'Liters',
  usFlOz: 'US fluid ounces',
  usPt: 'US pints',
  usQt: 'US quarts',
  impFlOz: 'UK imperial fluid ounces',
  impPt: 'UK imperial pints',
};

export const EXTRA_VOLUME_SYMBOLS: Record<ExtraVolumeUnit, string> = {
  mL: 'mL',
  L: 'L',
  usFlOz: 'US fl oz',
  usPt: 'US pt',
  usQt: 'US qt',
  impFlOz: 'imp fl oz',
  impPt: 'imp pt',
};

export type CupUnit = 'usCustomary' | 'usLegal' | 'metric' | 'imperial';

export type GallonUnit = 'usLiquid' | 'ukImperial';

export type CupsToGalSource = 'cups' | 'gallons' | ExtraVolumeUnit;

export interface CupsToGalInput {
  source: CupsToGalSource;
  /** null while the active source field is blank or incomplete. */
  value: number | null;
  cupUnit: CupUnit;
  gallonUnit: GallonUnit;
}

export interface CupsToGalResult {
  source: CupsToGalSource;
  cups: number;
  gallons: number;
  liters: number;
  cupUnit: CupUnit;
  gallonUnit: GallonUnit;
  extras: Record<ExtraVolumeUnit, number>;
  explanation: string;
}

export type CupsToGalFieldErrors = Partial<Record<CupsToGalSource, string>>;

/** Exact: 1 US liquid gallon = 3.785411784 L. */
export const LITERS_PER_US_GALLON = 3.785411784;

/** Exact: 1 UK imperial gallon = 4.54609 L. */
export const LITERS_PER_UK_GALLON = 4.54609;

/** Exact liters per cup definition. */
export const LITERS_PER_CUP: Record<CupUnit, number> = {
  usCustomary: 0.2365882365,
  usLegal: 0.24,
  metric: 0.25,
  imperial: 0.284130625,
};

export const LITERS_PER_GALLON: Record<GallonUnit, number> = {
  usLiquid: LITERS_PER_US_GALLON,
  ukImperial: LITERS_PER_UK_GALLON,
};

export const LITERS_PER_EXTRA: Record<ExtraVolumeUnit, number> = {
  mL: 0.001,
  L: 1,
  usFlOz: LITERS_PER_US_GALLON / 128,
  usPt: LITERS_PER_US_GALLON / 8,
  usQt: LITERS_PER_US_GALLON / 4,
  impFlOz: LITERS_PER_UK_GALLON / 160,
  impPt: LITERS_PER_UK_GALLON / 8,
};

export const CUP_UNIT_OPTIONS: readonly { value: CupUnit; label: string }[] = [
  { value: 'usCustomary', label: 'US cup' },
  { value: 'usLegal', label: 'US legal cup' },
  { value: 'metric', label: 'Metric cup' },
  { value: 'imperial', label: 'UK cup' },
] as const;

export const GALLON_UNIT_OPTIONS: readonly { value: GallonUnit; label: string }[] = [
  { value: 'usLiquid', label: 'US gal' },
  { value: 'ukImperial', label: 'UK gal' },
] as const;

export const CUP_UNIT_LABEL: Record<CupUnit, string> = {
  usCustomary: 'US cup',
  usLegal: 'US legal cup',
  metric: 'Metric cup',
  imperial: 'UK cup',
};

export const GALLON_UNIT_LABEL: Record<GallonUnit, string> = {
  usLiquid: 'US gal',
  ukImperial: 'UK gal',
};

export const DEFAULT_CUP_UNIT: CupUnit = 'usCustomary';
export const DEFAULT_GALLON_UNIT: GallonUnit = 'usLiquid';

export const MAX_ABS_VALUE = 1e15;
