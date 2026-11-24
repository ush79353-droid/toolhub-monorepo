import type { ActivityId } from '../calorie/types';

export type ProteinSex = 'female' | 'male';
export type HeightUnit = 'cm' | 'in';
export type WeightUnit = 'kg' | 'lb';

/** Screenshot: General recommendations vs Recommendations for sport. */
export type ProteinMode = 'general' | 'sport';

/**
 * Sport training focus — hidden unless mode === 'sport'.
 * g/kg bands are labeled ACSM teaching ranges (see calculation.ts).
 */
export type SportFocus = 'endurance' | 'strength' | 'athletic';

export interface ProteinShareRow {
  sharePercent: number;
  proteinKcalPerDay: number;
  proteinGramsPerDay: number;
}

export interface ProteinGPerKgBand {
  minGPerKg: number;
  maxGPerKg: number;
  minGramsPerDay: number;
  maxGramsPerDay: number;
  label: string;
  sourceLabel: string;
}

export interface ProteinInput {
  sex: ProteinSex;
  ageYearsText: string;
  heightText: string;
  heightUnit: HeightUnit;
  weightText: string;
  weightUnit: WeightUnit;
  activityId: ActivityId;
  caloriesText: string;
  mode: ProteinMode;
  sportFocus: SportFocus;
}

export interface ProteinResult {
  totalKcalPerDay: number | null;
  tdeeFromProfile: number | null;
  tdeeSource: string | null;
  weightKg: number | null;
  /** IOM RDA g/kg for the resolved life-stage (general mode). */
  rdaGPerKg: number | null;
  rdaGramsPerDay: number | null;
  amdrRows: ProteinShareRow[];
  sportBand: ProteinGPerKgBand | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type ProteinFieldErrors = {
  ageYearsText?: string;
  heightText?: string;
  weightText?: string;
  caloriesText?: string;
};

/** Screenshot defaults: Female; blank height/weight/age/calories; Exercise 1–2 times/week; General. */
export function createDefaultInput(): ProteinInput {
  return {
    sex: 'female',
    ageYearsText: '',
    heightText: '',
    heightUnit: 'cm',
    weightText: '',
    weightUnit: 'kg',
    activityId: 'light',
    caloriesText: '',
    mode: 'general',
    sportFocus: 'athletic',
  };
}

export function createEmptyInput(): ProteinInput {
  return createDefaultInput();
}

export function inputsEqual(a: ProteinInput, b: ProteinInput): boolean {
  return (
    a.sex === b.sex &&
    a.ageYearsText === b.ageYearsText &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.activityId === b.activityId &&
    a.caloriesText === b.caloriesText &&
    a.mode === b.mode &&
    a.sportFocus === b.sportFocus
  );
}
