/**
 * Levothyroxine Dosage Calculator — screenshot UI + typed eligibility engine.
 *
 * Screenshot defaults: Female, 15–50, blank kg/cm, FT4 Low, heart disease No.
 * Educational mcg/day teaching estimate is emitted only for the verified
 * healthy-adult overt-hypothyroidism teaching branch (FDA 1.6 mcg/kg ×
 * min(actual, Devine IBW)). All other branches stay gated.
 */

export type Sex = 'female' | 'male';

export type AgeBand = '15_50' | 'over_50';

export type Ft4Level = 'low' | 'normal';

export type YesNo = 'no' | 'yes';

export type WeightUnit = 'kg' | 'lb';

export type HeightUnit = 'cm' | 'in';

export type LevothyroxineOutcome =
  | 'awaiting_inputs'
  | 'unsupported_population'
  | 'insufficient_clinical_information'
  | 'clinician_review_required'
  | 'approved_estimate_available';

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
  /**
   * Educational teaching mcg/day for the approved healthy-adult overt branch only.
   * Null for all gated outcomes — never a personal prescription.
   */
  doseMcgPerDay: number | null;
  statusHeadline: string;
  statusDetail: string;
  educationalLines: string[];
  weightKg: number | null;
  idealBodyWeightKg: number | null;
  dosingWeightKg: number | null;
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
