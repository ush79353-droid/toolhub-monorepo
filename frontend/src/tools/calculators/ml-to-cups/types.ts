/** Which field the user last edited. */
export type MlCupsSource = 'ml' | 'cups';

export type CupStandard = 'usCustomary' | 'usLegal' | 'metric' | 'imperial';

export interface MlToCupsInput {
  source: MlCupsSource;
  ml: number | null;
  cups: number | null;
  cupStandard: CupStandard;
}

export interface OtherUnitRow {
  unit: string;
  label: string;
  value: number;
}

export interface MlToCupsResult {
  source: MlCupsSource;
  ml: number;
  cups: number;
  cupStandard: CupStandard;
  mlPerCup: number;
  otherUnits: readonly OtherUnitRow[];
}

export type MlToCupsFieldErrors = {
  ml?: string;
  cups?: string;
};

/**
 * Exact milliliters per cup by standard.
 * US customary: 8 × 29.5735295625 US fl oz.
 * Imperial: ½ imperial pint = 284.130625 mL.
 */
export const ML_PER_CUP: Record<CupStandard, number> = {
  usCustomary: 236.5882365,
  usLegal: 240,
  metric: 250,
  imperial: 284.130625,
};

export const CUP_STANDARD_OPTIONS: readonly {
  value: CupStandard;
  label: string;
  shortLabel: string;
}[] = [
  {
    value: 'usCustomary',
    label: 'US customary cup (236.5882365 mL)',
    shortLabel: 'US customary',
  },
  { value: 'usLegal', label: 'US legal cup (240 mL)', shortLabel: 'US legal' },
  { value: 'metric', label: 'Metric cup (250 mL)', shortLabel: 'Metric' },
  {
    value: 'imperial',
    label: 'Imperial cup (284.130625 mL)',
    shortLabel: 'Imperial',
  },
] as const;

/** Exact US customary kitchen volumes in mL. */
export const ML_PER_US_FL_OZ = 29.5735295625;
export const ML_PER_US_TBSP = 14.78676478125;
export const ML_PER_US_TSP = 4.92892159375;
export const ML_PER_US_PINT = 473.176473;
export const ML_PER_US_QUART = 946.352946;
export const ML_PER_US_GALLON = 3785.411784;

export const MAX_ABS_VALUE = 1e15;

/** Common cooking fraction presets (applied to cups field). */
export const CUP_FRACTION_PRESETS: readonly { label: string; value: number }[] = [
  { label: '1/8', value: 0.125 },
  { label: '1/4', value: 0.25 },
  { label: '1/3', value: 1 / 3 },
  { label: '1/2', value: 0.5 },
  { label: '2/3', value: 2 / 3 },
  { label: '3/4', value: 0.75 },
  { label: '1', value: 1 },
  { label: '1 1/2', value: 1.5 },
  { label: '2', value: 2 },
] as const;

/** Demo default: 2 US customary cups = 473.176473 mL. */
export const DEFAULT_ML_TO_CUPS_INPUT: MlToCupsInput = {
  source: 'cups',
  ml: null,
  cups: 2,
  cupStandard: 'usCustomary',
};

export const EMPTY_ML_TO_CUPS_INPUT: MlToCupsInput = {
  source: 'ml',
  ml: null,
  cups: null,
  cupStandard: 'usCustomary',
};
