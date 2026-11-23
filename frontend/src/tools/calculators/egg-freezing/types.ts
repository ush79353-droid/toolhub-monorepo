/**
 * Egg Freezing Calculator — screenshot defaults (blank age + blank mature eggs).
 * Age is age at freezing / retrieval for the Goldman 2017 model.
 */

export interface EggFreezingInput {
  /** Age at oocyte freezing (years). */
  ageYears: string;
  /** Number of frozen mature (MII) oocytes. */
  matureEggs: string;
}

export interface EggFreezingResult {
  ageYears: number;
  matureEggs: number;
  /** Modeled probability of ≥1 live birth (0–1). */
  probabilityAtLeastOne: number;
  /** Display percent, e.g. "69" or ">99". */
  percentDisplay: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type EggFreezingFieldErrors = {
  form?: string;
  ageYears?: string;
  matureEggs?: string;
};

export function createDefaultInput(): EggFreezingInput {
  return { ageYears: '', matureEggs: '' };
}

export function createEmptyInput(): EggFreezingInput {
  return createDefaultInput();
}

/** Published fixture: age 35 · 10 mature eggs → ≈69% (Goldman Table SII). */
export function createExampleInput(): EggFreezingInput {
  return { ageYears: '35', matureEggs: '10' };
}

export function inputsEqual(a: EggFreezingInput, b: EggFreezingInput): boolean {
  return a.ageYears === b.ageYears && a.matureEggs === b.matureEggs;
}
