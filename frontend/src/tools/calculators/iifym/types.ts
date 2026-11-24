export type IifymSex = 'female' | 'male';
export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'lb' | 'st';

/**
 * Omni IIFYM activity × Mifflin–St Jeor PAL bands.
 * Screenshot default: Light exercise 1-2 times/week → 1.4
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

export type GoalMode = 'maintain' | 'change';
export type ChangePace = 'normal' | 'strict';

/** Normal 0.5 kg/week → ±500 kcal/day; Strict 1 kg/week → ±1000 kcal/day. */
export const PACE_KG_PER_WEEK: Record<ChangePace, number> = {
  normal: 0.5,
  strict: 1,
};

export const PACE_DELTA_KCAL: Record<ChangePace, number> = {
  normal: 500,
  strict: 1000,
};

/** USDA Dietary Guidelines / AMDR energy shares (must sum conceptually as ranges). */
export const PROTEIN_SHARE = { min: 10, max: 35 } as const;
export const CARB_SHARE = { min: 45, max: 65 } as const;
export const FAT_SHARE = { min: 20, max: 35 } as const;

export interface MacroRangeGrams {
  proteinMinG: number;
  proteinMaxG: number;
  carbMinG: number;
  carbMaxG: number;
  fatMinG: number;
  fatMaxG: number;
}

export interface IifymInput {
  sex: IifymSex;
  heightValue: string;
  heightUnit: HeightUnit;
  weightValue: string;
  weightUnit: WeightUnit;
  ageYears: string;
  activityId: ActivityId;
  goalMode: GoalMode;
  targetWeightValue: string;
  targetWeightUnit: WeightUnit;
  changePace: ChangePace;
}

export interface IifymResult {
  sex: IifymSex;
  ageYears: number;
  heightCm: number;
  weightKg: number;
  activityId: ActivityId;
  activityLabel: string;
  pal: number;
  goalMode: GoalMode;
  bmrKcal: number;
  maintenanceKcal: number;
  formattedMaintenance: string;
  /** Target daily intake (maintenance, or ± pace delta when changing). */
  targetKcal: number;
  formattedTarget: string;
  macros: MacroRangeGrams;
  changeDirection: 'lose' | 'gain' | null;
  targetWeightKg: number | null;
  kgPerWeek: number | null;
  deltaKcal: number | null;
  weeksToGoal: number | null;
  goalMessage: string | null;
  explanation: string;
  disclaimer: string;
}

export type IifymFieldErrors = {
  form?: string;
  heightValue?: string;
  weightValue?: string;
  ageYears?: string;
  targetWeightValue?: string;
};

export function activityById(id: ActivityId) {
  return ACTIVITY_OPTIONS.find((o) => o.id === id) ?? ACTIVITY_OPTIONS[1];
}

/** Screenshot defaults: Female; blank height/weight/age; Light exercise; Maintain. */
export function createDefaultInput(): IifymInput {
  return {
    sex: 'female',
    heightValue: '',
    heightUnit: 'cm',
    weightValue: '',
    weightUnit: 'kg',
    ageYears: '',
    activityId: 'light',
    goalMode: 'maintain',
    targetWeightValue: '',
    targetWeightUnit: 'kg',
    changePace: 'normal',
  };
}

export function createEmptyInput(): IifymInput {
  return createDefaultInput();
}

export function inputsEqual(a: IifymInput, b: IifymInput): boolean {
  return (
    a.sex === b.sex &&
    a.heightValue === b.heightValue &&
    a.heightUnit === b.heightUnit &&
    a.weightValue === b.weightValue &&
    a.weightUnit === b.weightUnit &&
    a.ageYears === b.ageYears &&
    a.activityId === b.activityId &&
    a.goalMode === b.goalMode &&
    a.targetWeightValue === b.targetWeightValue &&
    a.targetWeightUnit === b.targetWeightUnit &&
    a.changePace === b.changePace
  );
}
