export type CupUnit = 'usCustomary' | 'usLegal' | 'metric' | 'imperial';

export type PintUnit = 'usLiquid' | 'imperial' | 'usDry';

export type PintsToCupsSource = 'pints' | 'cups';

export interface PintsToCupsInput {
  source: PintsToCupsSource;
  /** null while the active source field is blank or incomplete. */
  value: number | null;
  cupUnit: CupUnit;
  pintUnit: PintUnit;
}

export interface PintsToCupsResult {
  source: PintsToCupsSource;
  cups: number;
  pints: number;
  liters: number;
  cupUnit: CupUnit;
  pintUnit: PintUnit;
  explanation: string;
}

export type PintsToCupsFieldErrors = {
  cups?: string;
  pints?: string;
};

/** Exact liters per cup definition. */
export const LITERS_PER_CUP: Record<CupUnit, number> = {
  usCustomary: 0.2365882365,
  usLegal: 0.24,
  metric: 0.25,
  imperial: 0.284130625,
};

/** Exact liters per pint definition. */
export const LITERS_PER_PINT: Record<PintUnit, number> = {
  usLiquid: 0.473176473,
  imperial: 0.56826125,
  usDry: 0.5506104713575,
};

/** Exact mL constants for guide copy (same as liters × 1000). */
export const ML_PER_US_PINT = 473.176473;
export const ML_PER_US_CUP = 236.5882365;
export const ML_PER_IMP_PINT = 568.26125;
export const ML_PER_IMP_CUP = 284.130625;

export const CUP_UNIT_OPTIONS: readonly { value: CupUnit; label: string }[] = [
  { value: 'usCustomary', label: 'US cups' },
  { value: 'usLegal', label: 'US legal cup' },
  { value: 'metric', label: 'Metric cup' },
  { value: 'imperial', label: 'UK cups' },
] as const;

export const PINT_UNIT_OPTIONS: readonly { value: PintUnit; label: string }[] = [
  { value: 'usLiquid', label: 'US pt' },
  { value: 'imperial', label: 'imp pt' },
  { value: 'usDry', label: 'US dry pt' },
] as const;

export const CUP_UNIT_LABEL: Record<CupUnit, string> = {
  usCustomary: 'US cups',
  usLegal: 'US legal cup',
  metric: 'Metric cup',
  imperial: 'UK cups',
};

export const PINT_UNIT_LABEL: Record<PintUnit, string> = {
  usLiquid: 'US pt',
  imperial: 'imp pt',
  usDry: 'US dry pt',
};

export const DEFAULT_CUP_UNIT: CupUnit = 'usCustomary';
export const DEFAULT_PINT_UNIT: PintUnit = 'usLiquid';

/** Matching US customary: 1 US liquid pint = 2 US cups. */
export const CUPS_PER_US_PINT = 2;

export const MAX_ABS_VALUE = 1e15;
