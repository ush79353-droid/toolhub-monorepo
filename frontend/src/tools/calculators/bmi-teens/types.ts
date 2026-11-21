export type Sex = 'female' | 'male';
export type SexSelection = Sex | '';

export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'lb' | 'st';

export type TeenBmiCategoryId =
  | 'underweight'
  | 'healthy'
  | 'overweight'
  | 'obesity';

export interface BmiTeensInput {
  height: string;
  heightUnit: HeightUnit;
  weight: string;
  weightUnit: WeightUnit;
  /** Expanded by default per screenshot. */
  calculateOpen: boolean;
  /** Expanded by default per screenshot. */
  healthOpen: boolean;
  /** Unselected by default (screenshot). */
  sex: SexSelection;
  /** Blank by default; valid range 10–20 years. */
  age: string;
}

export interface TeenBmiCategory {
  id: TeenBmiCategoryId;
  label: string;
  rangeLabel: string;
}

export type InterpretationStatus =
  | 'needs_demographics'
  | 'age_out_of_range'
  | 'ready';

export interface BmiTeensResult {
  heightMeters: number;
  weightKg: number;
  bmi: number;
  bmiPrime: number;
  formattedBmi: string;
  formattedBmiPrime: string;
  sex: Sex | null;
  ageYears: number | null;
  interpretationStatus: InterpretationStatus;
  interpretationNote: string;
  /** Present only when sex + in-range age allow CDC LMS. */
  percentile: number | null;
  zScore: number | null;
  formattedPercentile: string | null;
  category: TeenBmiCategory | null;
  classificationSource: string;
  disclaimer: string;
}

export type BmiTeensFieldErrors = {
  form?: string;
  height?: string;
  weight?: string;
  sex?: string;
  age?: string;
};

/** Screenshot defaults: blank H/W/BMI/Prime; sex unselected; blank age 10–20. */
export function createDefaultInput(): BmiTeensInput {
  return {
    height: '',
    heightUnit: 'cm',
    weight: '',
    weightUnit: 'kg',
    calculateOpen: true,
    healthOpen: true,
    sex: '',
    age: '',
  };
}

export function createEmptyInput(): BmiTeensInput {
  return createDefaultInput();
}

/** Independent fixture: male 15y · 170 cm · 60 kg. */
export function createExampleInput(): BmiTeensInput {
  return {
    height: '170',
    heightUnit: 'cm',
    weight: '60',
    weightUnit: 'kg',
    calculateOpen: true,
    healthOpen: true,
    sex: 'male',
    age: '15',
  };
}

export function inputsEqual(a: BmiTeensInput, b: BmiTeensInput): boolean {
  return (
    a.height === b.height &&
    a.heightUnit === b.heightUnit &&
    a.weight === b.weight &&
    a.weightUnit === b.weightUnit &&
    a.calculateOpen === b.calculateOpen &&
    a.healthOpen === b.healthOpen &&
    a.sex === b.sex &&
    a.age === b.age
  );
}

export function hasBmiTeensChanges(input: BmiTeensInput): boolean {
  return !inputsEqual(input, createDefaultInput());
}
