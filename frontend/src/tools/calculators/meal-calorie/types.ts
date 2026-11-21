import type {
  ActivityId,
  HeightUnit,
  Sex,
  WeightUnit,
} from '../maintenance-calorie/types';
import {
  ACTIVITY_OPTIONS as MAINTENANCE_ACTIVITY_OPTIONS,
} from '../maintenance-calorie/types';

export type { ActivityId, HeightUnit, Sex, WeightUnit };
export { MAINTENANCE_ACTIVITY_OPTIONS as ACTIVITY_OPTIONS };

export type MealsPerDay = 'three' | 'four' | 'five';

export const MEALS_PER_DAY_OPTIONS: readonly {
  id: MealsPerDay;
  label: string;
}[] = [
  { id: 'three', label: 'Three' },
  { id: 'four', label: 'Four' },
  { id: 'five', label: 'Five' },
];

export interface MealCalorieInput {
  /** Manual daily target when `calculateRequiredCalories` is false. */
  caloriesPerDay: string;
  calculateRequiredCalories: boolean;
  mealsPerDay: MealsPerDay;
  sex: Sex;
  ageYears: string;
  heightValue: string;
  heightUnit: HeightUnit;
  weightValue: string;
  weightUnit: WeightUnit;
  activityId: ActivityId;
}

export interface MealAllocationRow {
  id: string;
  label: string;
  centerPct: number;
  centerKcal: number;
  minKcal: number;
  maxKcal: number;
  formattedCenter: string;
  formattedRange: string;
}

export interface MealCalorieResult {
  dailyKcal: number;
  formattedDaily: string;
  mealsPerDay: MealsPerDay;
  mealsPerDayLabel: string;
  rows: MealAllocationRow[];
  fromMaintenance: boolean;
  maintenanceKcal: number | null;
  maintenanceExplanation: string | null;
  explanation: string;
  disclaimer: string;
}

export type MealCalorieFieldErrors = {
  form?: string;
  caloriesPerDay?: string;
  ageYears?: string;
  heightValue?: string;
  weightValue?: string;
};

export const DEFAULT_DAILY_KCAL = 2000;

export function createDefaultInput(): MealCalorieInput {
  return {
    caloriesPerDay: String(DEFAULT_DAILY_KCAL),
    calculateRequiredCalories: false,
    mealsPerDay: 'three',
    sex: 'female',
    ageYears: '',
    heightValue: '',
    heightUnit: 'cm',
    weightValue: '',
    weightUnit: 'kg',
    activityId: 'none',
  };
}

/** Spec fixture: 2,000 kcal · three meals. */
export function createThreeMealFixtureInput(): MealCalorieInput {
  return {
    ...createDefaultInput(),
    caloriesPerDay: '2000',
    mealsPerDay: 'three',
  };
}

export function inputsEqual(a: MealCalorieInput, b: MealCalorieInput): boolean {
  return (
    a.caloriesPerDay === b.caloriesPerDay &&
    a.calculateRequiredCalories === b.calculateRequiredCalories &&
    a.mealsPerDay === b.mealsPerDay &&
    a.sex === b.sex &&
    a.ageYears === b.ageYears &&
    a.heightValue === b.heightValue &&
    a.heightUnit === b.heightUnit &&
    a.weightValue === b.weightValue &&
    a.weightUnit === b.weightUnit &&
    a.activityId === b.activityId
  );
}