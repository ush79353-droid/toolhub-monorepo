export type CupUnit = 'usCustomary' | 'usLegal' | 'metric' | 'imperial';

export type FluidOunceUnit = 'usFlOz' | 'impFlOz';

export type CupsToOzSource = 'cups' | 'ounces';

export interface CupsToOzInput {
  source: CupsToOzSource;
  /** null while the active source field is blank or incomplete. */
  value: number | null;
  cupUnit: CupUnit;
  ounceUnit: FluidOunceUnit;
}

export interface CupsToOzResult {
  source: CupsToOzSource;
  cups: number;
  ounces: number;
  liters: number;
  cupUnit: CupUnit;
  ounceUnit: FluidOunceUnit;
  explanation: string;
}

export type CupsToOzFieldErrors = {
  cups?: string;
  ounces?: string;
};

/** Exact liters per cup definition. */
export const LITERS_PER_CUP: Record<CupUnit, number> = {
  usCustomary: 0.2365882365,
  usLegal: 0.24,
  metric: 0.25,
  imperial: 0.284130625,
};

/** Exact liters per fluid ounce. */
export const LITERS_PER_FLUID_OUNCE: Record<FluidOunceUnit, number> = {
  usFlOz: 0.0295735295625,
  impFlOz: 0.0284130625,
};

export const CUP_UNIT_OPTIONS: readonly { value: CupUnit; label: string }[] = [
  { value: 'usCustomary', label: 'US cup' },
  { value: 'usLegal', label: 'US legal cup' },
  { value: 'metric', label: 'Metric cup' },
  { value: 'imperial', label: 'UK cup' },
] as const;

export const OUNCE_UNIT_OPTIONS: readonly { value: FluidOunceUnit; label: string }[] = [
  { value: 'usFlOz', label: 'US fl oz' },
  { value: 'impFlOz', label: 'imp fl oz' },
] as const;

export const CUP_UNIT_LABEL: Record<CupUnit, string> = {
  usCustomary: 'US cup',
  usLegal: 'US legal cup',
  metric: 'Metric cup',
  imperial: 'UK cup',
};

export const OUNCE_UNIT_LABEL: Record<FluidOunceUnit, string> = {
  usFlOz: 'US fl oz',
  impFlOz: 'imp fl oz',
};

export const DEFAULT_CUP_UNIT: CupUnit = 'usCustomary';
export const DEFAULT_OUNCE_UNIT: FluidOunceUnit = 'usFlOz';

export const MAX_ABS_VALUE = 1e15;
