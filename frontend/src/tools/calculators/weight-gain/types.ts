export type WeightGainSex = 'female' | 'male';
export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'lb' | 'st';

/** Omni Calorie / Weight Gain PAL bands. */
export const ACTIVITY_OPTIONS = [
  { id: 'sedentary', label: 'Little or no exercise', pal: 1.2 },
  { id: 'light', label: 'Light exercise 1–2 times/week', pal: 1.4 },
  { id: 'moderate', label: 'Moderate exercise 2–3 times/week', pal: 1.6 },
  { id: 'hard', label: 'Hard exercise 4–5 times/week', pal: 1.75 },
  { id: 'extra', label: 'Physical job / hard exercise 6–7 times/week', pal: 2.0 },
  { id: 'athlete', label: 'Professional athlete', pal: 2.3 },
] as const;

export type ActivityId = (typeof ACTIVITY_OPTIONS)[number]['id'];

export type GainPace = 'normal' | 'strict';

/** Normal 0.5 kg/week → +500 kcal/day; Strict 1 kg/week → +1000 kcal/day. */
export const GAIN_PACE_KG_PER_WEEK: Record<GainPace, number> = {
  normal: 0.5,
  strict: 1,
};

export const GAIN_PACE_SURPLUS_KCAL: Record<GainPace, number> = {
  normal: 500,
  strict: 1000,
};

export interface WeightGainInput {
  sex: WeightGainSex;
  heightValue: string;
  heightUnit: HeightUnit;
  weightValue: string;
  weightUnit: WeightUnit;
  ageYears: string;
  activityId: ActivityId;
  targetWeightValue: string;
  targetWeightUnit: WeightUnit;
  gainPace: GainPace;
}

export interface WeightGainResult {
  sex: WeightGainSex;
  ageYears: number;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  activityId: ActivityId;
  activityLabel: string;
  pal: number;
  gainPace: GainPace;
  kgPerWeek: number;
  surplusKcal: number;
  bmrKcal: number;
  maintenanceKcal: number;
  gainCaloriesKcal: number | null;
  weeksToGoal: number | null;
  goalFeasible: boolean;
  goalMessage: string | null;
  formattedMaintenance: string;
  formattedGainCalories: string | null;
  explanation: string;
}

export type WeightGainFieldErrors = {
  form?: string;
  heightValue?: string;
  weightValue?: string;
  ageYears?: string;
  targetWeightValue?: string;
};

export function activityById(id: ActivityId) {
  return ACTIVITY_OPTIONS.find((o) => o.id === id) ?? ACTIVITY_OPTIONS[1];
}

export function createDefaultInput(): WeightGainInput {
  return {
    sex: 'female',
    heightValue: '',
    heightUnit: 'cm',
    weightValue: '',
    weightUnit: 'kg',
    ageYears: '',
    activityId: 'light',
    targetWeightValue: '',
    targetWeightUnit: 'kg',
    gainPace: 'normal',
  };
}

export function createEmptyInput(): WeightGainInput {
  return createDefaultInput();
}

export function inputsEqual(a: WeightGainInput, b: WeightGainInput): boolean {
  return (
    a.sex === b.sex &&
    a.heightValue === b.heightValue &&
    a.heightUnit === b.heightUnit &&
    a.weightValue === b.weightValue &&
    a.weightUnit === b.weightUnit &&
    a.ageYears === b.ageYears &&
    a.activityId === b.activityId &&
    a.targetWeightValue === b.targetWeightValue &&
    a.targetWeightUnit === b.targetWeightUnit &&
    a.gainPace === b.gainPace
  );
}
