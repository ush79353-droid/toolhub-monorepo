/** Which field the user last edited. The other field is derived. */
export type McgMgSource = 'mcg' | 'mg';

export interface McgToMgInput {
  source: McgMgSource;
  /** null while the active source field is blank or incomplete. */
  mcg: number | null;
  mg: number | null;
}

export interface OtherUnitRow {
  unit: string;
  label: string;
  value: number;
}

export interface McgToMgResult {
  source: McgMgSource;
  mcg: number;
  mg: number;
  otherUnits: readonly OtherUnitRow[];
}

export type McgToMgFieldErrors = {
  mcg?: string;
  mg?: string;
};

/** Exact: 1 mg = 1000 mcg. */
export const MICROGRAMS_PER_MILLIGRAM = 1000;
/** Exact: 1 mcg = 1000 ng. */
export const NANOGRAMS_PER_MICROGRAM = 1000;
/** Exact: 1 cg = 10 mg. */
export const MILLIGRAMS_PER_CENTIGRAM = 10;
/** Exact: 1 dg = 100 mg. */
export const MILLIGRAMS_PER_DECIGRAM = 100;
/** Exact: 1 g = 1000 mg. */
export const MILLIGRAMS_PER_GRAM = 1000;
/** Exact: 1 kg = 1000 g. */
export const GRAMS_PER_KILOGRAM = 1000;

export const MAX_ABS_VALUE = 1e15;

/** Demo default: 250 mcg = 0.25 mg. */
export const DEFAULT_MCG_TO_MG_INPUT: McgToMgInput = {
  source: 'mcg',
  mcg: 250,
  mg: null,
};

/** Reset target: clear both fields. */
export const EMPTY_MCG_TO_MG_INPUT: McgToMgInput = {
  source: 'mcg',
  mcg: null,
  mg: null,
};
