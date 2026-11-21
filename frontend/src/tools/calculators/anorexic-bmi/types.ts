export type UnitSystem = 'us' | 'metric' | 'other';

export type Sex = 'female' | 'male';

export type OtherHeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type OtherWeightUnit = 'kg' | 'lb' | 'st' | 'g';

export interface AnorexicBmiInput {
  unitSystem: UnitSystem;
  age: string;
  sex: Sex;
  /** Metric: height in cm. */
  heightCm: string;
  /** Metric: weight in kg. */
  weightKg: string;
  /** US: feet part of height. */
  heightFt: string;
  /** US: inches part of height. */
  heightIn: string;
  /** US: weight in pounds. */
  weightLb: string;
  /** Other: height magnitude. */
  otherHeight: string;
  otherHeightUnit: OtherHeightUnit;
  /** Other: weight magnitude. */
  otherWeight: string;
  otherWeightUnit: OtherWeightUnit;
}

export interface AnorexicBmiResult {
  bmi: number;
  formattedBmi: string;
  age: number;
  sex: Sex;
  heightMeters: number;
  weightKg: number;
  /** True when age is in the WHO adult BMI category age band (20–120). */
  adultReferenceApplicable: boolean;
  healthyRangeLabel: string | null;
  healthyRangeSource: string;
  interpretationNote: string;
  disclaimer: string;
}

export type AnorexicBmiFieldErrors = {
  form?: string;
  age?: string;
  height?: string;
  weight?: string;
};

/** Screenshot fixture defaults (metric): age 20, female, 180 cm, 60 kg → BMI ≈ 18.52. */
export function createDefaultInput(): AnorexicBmiInput {
  return {
    unitSystem: 'metric',
    age: '20',
    sex: 'female',
    heightCm: '180',
    weightKg: '60',
    heightFt: '5',
    heightIn: '11',
    weightLb: '132',
    otherHeight: '180',
    otherHeightUnit: 'cm',
    otherWeight: '60',
    otherWeightUnit: 'kg',
  };
}

export function createEmptyInput(): AnorexicBmiInput {
  return {
    unitSystem: 'metric',
    age: '',
    sex: 'female',
    heightCm: '',
    weightKg: '',
    heightFt: '',
    heightIn: '',
    weightLb: '',
    otherHeight: '',
    otherHeightUnit: 'cm',
    otherWeight: '',
    otherWeightUnit: 'kg',
  };
}

export function inputsEqual(a: AnorexicBmiInput, b: AnorexicBmiInput): boolean {
  return (
    a.unitSystem === b.unitSystem &&
    a.age === b.age &&
    a.sex === b.sex &&
    a.heightCm === b.heightCm &&
    a.weightKg === b.weightKg &&
    a.heightFt === b.heightFt &&
    a.heightIn === b.heightIn &&
    a.weightLb === b.weightLb &&
    a.otherHeight === b.otherHeight &&
    a.otherHeightUnit === b.otherHeightUnit &&
    a.otherWeight === b.otherWeight &&
    a.otherWeightUnit === b.otherWeightUnit
  );
}
