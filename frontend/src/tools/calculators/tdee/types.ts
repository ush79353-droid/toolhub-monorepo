/** TDEE = Mifflin–St Jeor BMR × PAL (educational). */

export type Sex = 'male' | 'female';
export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'lb' | 'st';
export type EnergyUnit = 'kcal' | 'kJ';

/**
 * Omni-style PAL bands matching screenshot “Light exercise 1-2 times/week”.
 * Same factors as IIFYM sibling (pal 1.4 for light).
 */
export const ACTIVITY_OPTIONS = [
  { id: 'sedentary', label: 'Little/no exercise (sedentary lifestyle)', pal: 1.2 },
  { id: 'light', label: 'Light exercise 1-2 times/week', pal: 1.4 },
  { id: 'moderate', label: 'Moderate exercise 2-3 times/week', pal: 1.6 },
  { id: 'hard', label: 'Hard exercise 4-5 times/week', pal: 1.75 },
  { id: 'extra', label: 'Physical job or hard exercise 6-7 times/week', pal: 2.0 },
  { id: 'athlete', label: 'Professional athlete', pal: 2.3 },
] as const;

export type ActivityId = (typeof ACTIVITY_OPTIONS)[number]['id'];

export interface TdeeInput {
  sex: Sex;
  ageYearsText: string;
  heightText: string;
  heightUnit: HeightUnit;
  weightText: string;
  weightUnit: WeightUnit;
  activityId: ActivityId;
  energyUnit: EnergyUnit;
}

export interface TdeeResult {
  bmrKcal: number | null;
  tdeeKcal: number | null;
  bmrDisplay: string;
  tdeeDisplay: string;
  pal: number | null;
  ageExtrapolated: boolean;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type TdeeFieldErrors = {
  ageYearsText?: string;
  heightText?: string;
  weightText?: string;
};

export function activityById(id: ActivityId) {
  return ACTIVITY_OPTIONS.find((o) => o.id === id) ?? ACTIVITY_OPTIONS[1];
}

export function createDefaultInput(): TdeeInput {
  return {
    sex: 'male',
    ageYearsText: '',
    heightText: '',
    heightUnit: 'cm',
    weightText: '',
    weightUnit: 'kg',
    activityId: 'light',
    energyUnit: 'kcal',
  };
}

export function createEmptyInput(): TdeeInput {
  return createDefaultInput();
}

export function inputsEqual(a: TdeeInput, b: TdeeInput): boolean {
  return (
    a.sex === b.sex &&
    a.ageYearsText === b.ageYearsText &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.activityId === b.activityId &&
    a.energyUnit === b.energyUnit
  );
}
