export interface FertilityByAgeInput {
  /** Empty string = screenshot “Select” placeholder. */
  ageYears: string;
}

export interface FertilityByAgeResult {
  ageYears: number;
  ageBandLabel: string;
  chancePerCyclePercent: number;
  formattedPercent: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type FertilityByAgeFieldErrors = {
  form?: string;
  ageYears?: string;
};

/** Screenshot default: Age = Select (blank). */
export function createDefaultInput(): FertilityByAgeInput {
  return { ageYears: '' };
}

export function createEmptyInput(): FertilityByAgeInput {
  return createDefaultInput();
}

export function createExampleInput(): FertilityByAgeInput {
  return { ageYears: '30' };
}

export function inputsEqual(
  a: FertilityByAgeInput,
  b: FertilityByAgeInput
): boolean {
  return a.ageYears === b.ageYears;
}

/** Discrete ages offered in the dropdown (yrs). */
export const AGE_OPTIONS: readonly number[] = Array.from(
  { length: 45 - 20 + 1 },
  (_, i) => 20 + i
);
