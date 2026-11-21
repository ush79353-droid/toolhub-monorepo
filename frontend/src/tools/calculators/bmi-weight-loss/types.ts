export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'lb' | 'st';
export type Sex = 'female' | 'male';

/** Which target field the user last edited (drives bidirectional sync). */
export type TargetEditField = 'bmi' | 'prime' | 'weight';

export type WhoBmiCategoryId =
  | 'severe_thinness'
  | 'moderate_thinness'
  | 'mild_thinness'
  | 'normal'
  | 'overweight'
  | 'obese_i'
  | 'obese_ii'
  | 'obese_iii';

export interface WhoBmiCategory {
  id: WhoBmiCategoryId;
  label: string;
  rangeLabel: string;
}

export type WeightChangeKind = 'loss' | 'gain' | 'same';

export type TargetSafety =
  | 'ok'
  | 'underweight_warn'
  | 'severe_thinness_reject'
  | 'high_warn';

export type PercentileStatus =
  | 'not_requested'
  | 'need_age_sex'
  | 'adult_no_cdc'
  | 'out_of_range'
  | 'ready'
  | 'unavailable';

export interface BmiWeightLossInput {
  height: string;
  heightUnit: HeightUnit;
  weight: string;
  weightUnit: WeightUnit;
  /** Editable target BMI (kg/m²). */
  targetBmi: string;
  /** Editable target BMI Prime (= target BMI / 25). */
  targetPrime: string;
  /** Editable target weight in targetWeightUnit. */
  targetWeight: string;
  targetWeightUnit: WeightUnit;
  /** Last authoritative target field for bidirectional sync. */
  lastTargetEdit: TargetEditField | null;
  /** Optional CDC BMI-for-age panel (collapsed by default in UI). */
  sex: Sex | '';
  age: string;
}

export interface BmiWeightLossResult {
  heightMeters: number;
  weightKg: number;
  bmi: number;
  bmiPrime: number;
  formattedBmi: string;
  formattedBmiPrime: string;
  category: WhoBmiCategory | null;
  targetBmi: number | null;
  targetPrime: number | null;
  targetWeightKg: number | null;
  formattedTargetBmi: string | null;
  formattedTargetPrime: string | null;
  formattedTargetWeight: string | null;
  weightChangeKg: number | null;
  weightChangeKind: WeightChangeKind | null;
  formattedWeightChange: string | null;
  targetSafety: TargetSafety | null;
  targetSafetyNote: string | null;
  percentileStatus: PercentileStatus;
  percentile: number | null;
  formattedPercentile: string | null;
  percentileNote: string | null;
  classificationSource: string;
  disclaimer: string;
}

export type BmiWeightLossFieldErrors = {
  form?: string;
  height?: string;
  weight?: string;
  targetBmi?: string;
  targetPrime?: string;
  targetWeight?: string;
  age?: string;
  sex?: string;
};

/** Screenshot defaults: blank height/weight/targets; cm + kg. */
export function createDefaultInput(): BmiWeightLossInput {
  return {
    height: '',
    heightUnit: 'cm',
    weight: '',
    weightUnit: 'kg',
    targetBmi: '',
    targetPrime: '',
    targetWeight: '',
    targetWeightUnit: 'kg',
    lastTargetEdit: null,
    sex: '',
    age: '',
  };
}

export function createEmptyInput(): BmiWeightLossInput {
  return createDefaultInput();
}

/** Fixture: 175 cm · 85 kg · target BMI 22 → ~67.4 kg · ~17.6 kg to lose. */
export function createExampleInput(): BmiWeightLossInput {
  return {
    height: '175',
    heightUnit: 'cm',
    weight: '85',
    weightUnit: 'kg',
    targetBmi: '22',
    targetPrime: '0.88',
    targetWeight: '67.375',
    targetWeightUnit: 'kg',
    lastTargetEdit: 'bmi',
    sex: '',
    age: '',
  };
}

export function inputsEqual(a: BmiWeightLossInput, b: BmiWeightLossInput): boolean {
  return (
    a.height === b.height &&
    a.heightUnit === b.heightUnit &&
    a.weight === b.weight &&
    a.weightUnit === b.weightUnit &&
    a.targetBmi === b.targetBmi &&
    a.targetPrime === b.targetPrime &&
    a.targetWeight === b.targetWeight &&
    a.targetWeightUnit === b.targetWeightUnit &&
    a.lastTargetEdit === b.lastTargetEdit &&
    a.sex === b.sex &&
    a.age === b.age
  );
}
