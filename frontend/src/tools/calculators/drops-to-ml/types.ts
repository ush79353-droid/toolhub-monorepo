/** Which field the user last edited. */
export type CalcSource = 'drops' | 'ml';

export interface DropsToMlInput {
  source: CalcSource;
  drops: number | null;
  ml: number | null;
  /** Assumed or calibrated drops per milliliter; must be > 0. */
  dropsPerMl: number | null;
}

export interface OtherUnitRow {
  unit: string;
  label: string;
  value: number;
}

export interface DropsToMlResult {
  source: CalcSource;
  drops: number;
  ml: number;
  dropsPerMl: number;
  mlPerDrop: number;
  factorAssumed: boolean;
  otherUnits: readonly OtherUnitRow[];
}

export type DropsToMlFieldErrors = {
  drops?: string;
  ml?: string;
  dropsPerMl?: string;
};

/** Common reference assumption: 20 drops ≈ 1 mL (not universally exact). */
export const DEFAULT_DROPS_PER_ML = 20;

/** Exact: 1 US fluid ounce = 29.5735295625 mL. */
export const ML_PER_US_FL_OZ = 29.5735295625;
/** Exact: 1 US customary cup = 236.5882365 mL. */
export const ML_PER_US_CUP = 236.5882365;

export const MAX_ABS_VALUE = 1e15;

/** Demo default: 100 drops @ 20 drops/mL ≈ 5 mL. */
export const DEFAULT_DROPS_TO_ML_INPUT: DropsToMlInput = {
  source: 'drops',
  drops: 100,
  ml: null,
  dropsPerMl: DEFAULT_DROPS_PER_ML,
};

export const EMPTY_DROPS_TO_ML_INPUT: DropsToMlInput = {
  source: 'drops',
  drops: null,
  ml: null,
  dropsPerMl: DEFAULT_DROPS_PER_ML,
};
