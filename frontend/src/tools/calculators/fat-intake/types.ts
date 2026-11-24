import type { ActivityId } from '../calorie/types';

export type FatSex = 'female' | 'male';
export type HeightUnit = 'cm' | 'in';
export type WeightUnit = 'kg' | 'lb';

export interface FatShareRow {
  sharePercent: number;
  fatKcalPerDay: number;
  fatGramsPerDay: number;
}

export interface FatIntakeInput {
  sex: FatSex;
  ageYearsText: string;
  heightText: string;
  heightUnit: HeightUnit;
  weightText: string;
  weightUnit: WeightUnit;
  activityId: ActivityId;
  caloriesText: string;
}

export interface FatIntakeResult {
  totalKcalPerDay: number | null;
  tdeeFromProfile: number | null;
  tdeeSource: string | null;
  fatRows: FatShareRow[];
  /** Saturated-fat upper guidance (<10% of energy), grams/day. */
  saturatedFatMaxGrams: number | null;
  saturatedFatMaxKcal: number | null;
  saturatedSharePercent: number;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type FatIntakeFieldErrors = {
  ageYearsText?: string;
  heightText?: string;
  weightText?: string;
  caloriesText?: string;
};

/** Screenshot defaults: Female; blank height/weight/age/calories; Exercise 1–2 times/week. */
export function createDefaultInput(): FatIntakeInput {
  return {
    sex: 'female',
    ageYearsText: '',
    heightText: '',
    heightUnit: 'cm',
    weightText: '',
    weightUnit: 'kg',
    activityId: 'light',
    caloriesText: '',
  };
}

export function createEmptyInput(): FatIntakeInput {
  return createDefaultInput();
}

export function inputsEqual(a: FatIntakeInput, b: FatIntakeInput): boolean {
  return (
    a.sex === b.sex &&
    a.ageYearsText === b.ageYearsText &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.activityId === b.activityId &&
    a.caloriesText === b.caloriesText
  );
}
