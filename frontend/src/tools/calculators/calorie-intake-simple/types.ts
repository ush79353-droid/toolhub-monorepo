export type Sex = 'female' | 'male';
export type HeightUnit = 'cm' | 'm' | 'ft' | 'in';
export type WeightUnit = 'kg' | 'lb' | 'st';

/**
 * Omni Calorie Intake Calculator (Simple) PAL table.
 * Source: https://www.omnicalculator.com/health/simple-calorie-intake
 */
export const ACTIVITY_OPTIONS = [
  {
    id: 'sedentary',
    label: 'Little or no exercise',
    pal: 1.2,
  },
  {
    id: 'light',
    label: 'Light exercise 1–2 times/week',
    pal: 1.4,
  },
  {
    id: 'moderate',
    label: 'Moderate exercise 2–3 times/week',
    pal: 1.6,
  },
  {
    id: 'hard',
    label: 'Hard exercise 3–5 times/week',
    pal: 1.75,
  },
  {
    id: 'extra',
    label: 'Physical job or hard exercise 6–7 times/week',
    pal: 2.0,
  },
] as const;

export type ActivityId = (typeof ACTIVITY_OPTIONS)[number]['id'];

export interface CalorieIntakeSimpleInput {
  sex: Sex;
  ageYears: string;
  heightValue: string;
  heightUnit: HeightUnit;
  weightValue: string;
  weightUnit: WeightUnit;
  activityId: ActivityId;
}

export interface CalorieIntakeSimpleResult {
  bmrKcal: number;
  tdeeKcal: number;
  pal: number;
  activityLabel: string;
  formattedTdee: string;
  formattedBmr: string;
  explanation: string;
  disclaimer: string;
}

export type CalorieIntakeSimpleFieldErrors = {
  form?: string;
  ageYears?: string;
  heightValue?: string;
  weightValue?: string;
};

/** Screenshot defaults: Female + Light exercise; blank age/height/weight. */
export function createEmptyInput(): CalorieIntakeSimpleInput {
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

/** Omni worked example: female · 50y · 165 cm · 65 kg · light → ≈1778.4 kcal/day. */
export function createExampleInput(): CalorieIntakeSimpleInput {
  return {
    sex: 'female',
    ageYears: '50',
    heightValue: '165',
    heightUnit: 'cm',
    weightValue: '65',
    weightUnit: 'kg',
    activityId: 'light',
  };
}

export function activityById(id: ActivityId) {
  return ACTIVITY_OPTIONS.find((o) => o.id === id) ?? ACTIVITY_OPTIONS[1];
}
