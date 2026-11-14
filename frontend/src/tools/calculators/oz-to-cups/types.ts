/** Which field the user last edited. */
export type CalcSource = 'flOz' | 'cups';

export type FluidOunceStandard = 'us' | 'imperial';

export type CupStandard = 'usCustomary' | 'usLegal' | 'metric' | 'imperial';

export interface OzToCupsInput {
  source: CalcSource;
  flOz: number | null;
  cups: number | null;
  flOzStandard: FluidOunceStandard;
  cupStandard: CupStandard;
}

export interface OtherUnitRow {
  unit: string;
  label: string;
  value: number;
}

export interface OzToCupsResult {
  source: CalcSource;
  flOz: number;
  cups: number;
  flOzStandard: FluidOunceStandard;
  cupStandard: CupStandard;
  volumeMl: number;
  mlPerFlOz: number;
  mlPerCup: number;
  otherUnits: readonly OtherUnitRow[];
}

export type OzToCupsFieldErrors = {
  flOz?: string;
  cups?: string;
};

/** Exact: 1 US fl oz = 29.5735295625 mL. */
export const ML_PER_US_FL_OZ = 29.5735295625;
/** Exact: 1 Imperial fl oz = 28.4130625 mL. */
export const ML_PER_IMPERIAL_FL_OZ = 28.4130625;

export const ML_PER_FL_OZ: Record<FluidOunceStandard, number> = {
  us: ML_PER_US_FL_OZ,
  imperial: ML_PER_IMPERIAL_FL_OZ,
};

/**
 * Exact milliliters per cup by standard.
 * US customary = 8 × US fl oz. Imperial cup = 10 × Imperial fl oz.
 */
export const ML_PER_CUP: Record<CupStandard, number> = {
  usCustomary: 236.5882365,
  usLegal: 240,
  metric: 250,
  imperial: 284.130625,
};

export const FL_OZ_STANDARD_OPTIONS: readonly {
  value: FluidOunceStandard;
  label: string;
  shortLabel: string;
}[] = [
  { value: 'us', label: 'US fl oz (29.5735295625 mL)', shortLabel: 'US fl oz' },
  {
    value: 'imperial',
    label: 'Imperial fl oz (28.4130625 mL)',
    shortLabel: 'Imp. fl oz',
  },
] as const;

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

/** Demo default: 8 US fl oz = 1 US customary cup. */
export const DEFAULT_OZ_TO_CUPS_INPUT: OzToCupsInput = {
  source: 'flOz',
  flOz: 8,
  cups: null,
  flOzStandard: 'us',
  cupStandard: 'usCustomary',
};

export const EMPTY_OZ_TO_CUPS_INPUT: OzToCupsInput = {
  source: 'flOz',
  flOz: null,
  cups: null,
  flOzStandard: 'us',
  cupStandard: 'usCustomary',
};
