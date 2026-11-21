export type Sex = 'female' | 'male';
export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'lb' | 'st';

export interface CalorieDeficitInput {
  sex: Sex;
  ageYears: string;
  heightValue: string;
  heightUnit: HeightUnit;
  currentWeightValue: string;
  currentWeightUnit: WeightUnit;
  targetWeightValue: string;
  targetWeightUnit: WeightUnit;
  /** ISO date yyyy-mm-dd */
  targetDate: string;
}

export interface CalorieDeficitResult {
  sex: Sex;
  ageYears: number;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  weightDeltaKg: number;
  days: number;
  /** Positive = daily energy deficit needed for loss. */
  dailyDeficitKcal: number;
  totalKcal: number;
  bmrKcal: number;
  maintenanceKcal: number;
  plannedIntakeKcal: number;
  pal: number;
  palLabel: string;
  kcalPerKg: number;
  asOfDate: string;
  targetDate: string;
  formattedDailyDeficit: string;
  formattedMaintenance: string;
  formattedPlannedIntake: string;
  disclaimer: string;
}

export type CalorieDeficitFieldErrors = {
  form?: string;
  ageYears?: string;
  heightValue?: string;
  currentWeightValue?: string;
  targetWeightValue?: string;
  targetDate?: string;
};

/** Screenshot: female selected; target date example 2027-02-21; metrics blank (no medical defaults). */
export function createDefaultInput(): CalorieDeficitInput {
  return {
    sex: 'female',
    ageYears: '',
    heightValue: '',
    heightUnit: 'cm',
    currentWeightValue: '',
    currentWeightUnit: 'kg',
    targetWeightValue: '',
    targetWeightUnit: 'kg',
    targetDate: '2027-02-21',
  };
}

export function createEmptyInput(): CalorieDeficitInput {
  return {
    sex: 'female',
    ageYears: '',
    heightValue: '',
    heightUnit: 'cm',
    currentWeightValue: '',
    currentWeightUnit: 'kg',
    targetWeightValue: '',
    targetWeightUnit: 'kg',
    targetDate: '',
  };
}

export function inputsEqual(
  a: CalorieDeficitInput,
  b: CalorieDeficitInput
): boolean {
  return (
    a.sex === b.sex &&
    a.ageYears === b.ageYears &&
    a.heightValue === b.heightValue &&
    a.heightUnit === b.heightUnit &&
    a.currentWeightValue === b.currentWeightValue &&
    a.currentWeightUnit === b.currentWeightUnit &&
    a.targetWeightValue === b.targetWeightValue &&
    a.targetWeightUnit === b.targetWeightUnit &&
    a.targetDate === b.targetDate
  );
}
