/**
 * Levothyroxine Dosage Calculator — screenshot UI + clinical eligibility gate.
 *
 * Screenshot defaults: Female, 15–50, blank kg/cm, FT4 Low, heart disease No.
 * Numeric mcg/day prescribing is NOT authorized without specialist review.
 * Engine returns unavailable / clinician-review states only (ADR-023 + medical gate).
 */

export type Sex = 'female' | 'male';

export type AgeBand = '15_50' | 'over_50';

export type Ft4Level = 'low' | 'normal';

export type YesNo = 'no' | 'yes';

export type WeightUnit = 'kg' | 'lb';

export type HeightUnit = 'cm' | 'in';

export type LevothyroxineOutcome =
  | 'awaiting_inputs'
  | 'cannot_determine'
  | 'clinician_review_required';

export interface LevothyroxineDosageInput {
  sex: Sex;
  ageBand: AgeBand;
  weightText: string;
  weightUnit: WeightUnit;
  heightText: string;
  heightUnit: HeightUnit;
  ft4: Ft4Level;
  heartDisease: YesNo;
}

export interface LevothyroxineDosageResult {
  outcome: LevothyroxineOutcome;
  /** Always null — no patient-specific mcg/day until clinical approval. */
  doseMcgPerDay: number | null;
  statusHeadline: string;
  statusDetail: string;
  educationalLines: string[];
  sourceNote: string;
  disclaimer: string;
}

export type LevothyroxineDosageFieldErrors = {
  form?: string;
  weightText?: string;
  heightText?: string;
};

/** Screenshot reload defaults. */
export function createDefaultInput(): LevothyroxineDosageInput {
  return {
    sex: 'female',
    ageBand: '15_50',
    weightText: '',
    weightUnit: 'kg',
    heightText: '',
    heightUnit: 'cm',
    ft4: 'low',
    heartDisease: 'no',
  };
}

export function createEmptyInput(): LevothyroxineDosageInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: LevothyroxineDosageInput,
  b: LevothyroxineDosageInput,
): boolean {
  return (
    a.sex === b.sex &&
    a.ageBand === b.ageBand &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.ft4 === b.ft4 &&
    a.heartDisease === b.heartDisease
  );
}
