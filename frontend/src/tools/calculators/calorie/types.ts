export type CalorieSex = 'female' | 'male';

export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'lb' | 'st';

/**
 * Omni Calorie Calculator–style PAL factors (Mifflin–St Jeor × PAL).
 * Default screenshot option: Exercise 1–2 times/week → 1.4
 */
export const ACTIVITY_OPTIONS = [
  { id: 'sedentary', label: 'Little or no exercise', pal: 1.2 },
  { id: 'light', label: 'Exercise 1–2 times/week', pal: 1.4 },
  { id: 'moderate', label: 'Exercise 2–3 times/week', pal: 1.6 },
  { id: 'hard', label: 'Exercise 4–5 times/week', pal: 1.75 },
  { id: 'extra', label: 'Exercise 6–7 times/week', pal: 2.0 },
  { id: 'athlete', label: 'Professional athlete', pal: 2.3 },
] as const;

export type ActivityId = (typeof ACTIVITY_OPTIONS)[number]['id'];

export interface CalorieInput {
  sex: CalorieSex;
  ageYears: string;
  heightValue: string;
  heightUnit: HeightUnit;
  weightValue: string;
  weightUnit: WeightUnit;
  activityId: ActivityId;
}

export interface CalorieResult {
  sex: CalorieSex;
  ageYears: number;
  heightCm: number;
  weightKg: number;
  activityId: ActivityId;
  activityLabel: string;
  pal: number;
  bmrKcal: number;
  tdeeKcal: number;
  formattedBmr: string;
  formattedTdee: string;
  explanation: string;
}

export type CalorieFieldErrors = {
  form?: string;
  ageYears?: string;
  heightValue?: string;
  weightValue?: string;
};

export function createDefaultInput(): CalorieInput {
  return {
    sex: 'female',
    ageYears: '',
    heightValue: '',
    heightUnit: 'cm',
    weightValue: '',
    weightUnit: 'kg',
    activityId: 'light',
  };
}

export function createEmptyInput(): CalorieInput {
  return createDefaultInput();
}

export function inputsEqual(a: CalorieInput, b: CalorieInput): boolean {
  return (
    a.sex === b.sex &&
    a.ageYears === b.ageYears &&
    a.heightValue === b.heightValue &&
    a.heightUnit === b.heightUnit &&
    a.weightValue === b.weightValue &&
    a.weightUnit === b.weightUnit &&
    a.activityId === b.activityId
  );
}

export function activityById(id: ActivityId) {
  return ACTIVITY_OPTIONS.find((o) => o.id === id) ?? ACTIVITY_OPTIONS[1];
}
