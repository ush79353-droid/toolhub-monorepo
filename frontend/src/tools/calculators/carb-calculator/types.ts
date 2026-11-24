import type { ActivityId } from '../calorie/types';

export type CarbSex = 'male' | 'female';
export type HeightUnit = 'cm' | 'in';
export type WeightUnit = 'kg' | 'lb';

export interface CarbShareRow {
  sharePercent: number;
  carbKcalPerDay: number;
  carbGramsPerDay: number;
}

export interface CarbCalculatorInput {
  sex: CarbSex;
  ageYearsText: string;
  heightText: string;
  heightUnit: HeightUnit;
  weightText: string;
  weightUnit: WeightUnit;
  activityId: ActivityId;
  totalKcalText: string;
}

export interface CarbCalculatorResult {
  totalKcalPerDay: number | null;
  tdeeFromProfile: number | null;
  tdeeSource: string | null;
  carbRows: CarbShareRow[];
  rdaGrams: number;
  rdaKcal: number;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type CarbCalculatorFieldErrors = {
  ageYearsText?: string;
  heightText?: string;
  weightText?: string;
  totalKcalText?: string;
};

export function createDefaultInput(): CarbCalculatorInput {
  return {
    sex: 'female',
    ageYearsText: '',
    heightText: '',
    heightUnit: 'cm',
    weightText: '',
    weightUnit: 'kg',
    activityId: 'light',
    totalKcalText: '',
  };
}

export function createEmptyInput(): CarbCalculatorInput {
  return createDefaultInput();
}

export function inputsEqual(a: CarbCalculatorInput, b: CarbCalculatorInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}