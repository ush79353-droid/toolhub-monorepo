import type { ActivityId } from '../calorie/types';

/** Screenshot: Male/Female initially unselected. */
export type FiberSex = 'male' | 'female' | '';
export type HeightUnit = 'cm' | 'in';
export type WeightUnit = 'kg' | 'lb';
/** Energy display unit; fiber math always normalizes to kcal. */
export type EnergyUnit = 'kcal' | 'kJ';
export type FiberMassUnit = 'g';

export interface FiberInput {
  sex: FiberSex;
  ageYearsText: string;
  heightText: string;
  heightUnit: HeightUnit;
  weightText: string;
  weightUnit: WeightUnit;
  activityId: ActivityId;
  /** Optional override for recommended daily energy; blank → profile TDEE when available. */
  caloriesText: string;
  energyUnit: EnergyUnit;
  fiberUnit: FiberMassUnit;
}

export interface FiberResult {
  /** Active energy base in kcal/day used for the energy-scaled fiber target. */
  totalKcalPerDay: number | null;
  /** Mifflin–St Jeor × PAL when profile is complete; distinct from calorie override. */
  tdeeFromProfile: number | null;
  tdeeSource: string | null;
  /** Energy-scaled optimum: 14 g total fiber per 1,000 kcal (IOM basis). */
  energyScaledFiberG: number | null;
  /**
   * Age/sex Adequate Intake (AI) from IOM DRI total fiber tables — kept distinct
   * from the energy-scaled estimate.
   */
  aiFiberG: number | null;
  aiLabel: string | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type FiberFieldErrors = {
  sex?: string;
  ageYearsText?: string;
  heightText?: string;
  weightText?: string;
  caloriesText?: string;
};

/** Screenshot defaults: sex unselected; blank H/W/age/calories; Exercise 1–2 times/week. */
export function createDefaultInput(): FiberInput {
  return {
    sex: '',
    ageYearsText: '',
    heightText: '',
    heightUnit: 'cm',
    weightText: '',
    weightUnit: 'kg',
    activityId: 'light',
    caloriesText: '',
    energyUnit: 'kcal',
    fiberUnit: 'g',
  };
}

export function createEmptyInput(): FiberInput {
  return createDefaultInput();
}

export function inputsEqual(a: FiberInput, b: FiberInput): boolean {
  return (
    a.sex === b.sex &&
    a.ageYearsText === b.ageYearsText &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.activityId === b.activityId &&
    a.caloriesText === b.caloriesText &&
    a.energyUnit === b.energyUnit &&
    a.fiberUnit === b.fiberUnit
  );
}
