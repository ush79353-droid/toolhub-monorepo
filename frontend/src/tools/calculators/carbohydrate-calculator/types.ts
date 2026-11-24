import type { CarbShareRow } from '../carb-calculator/types';

export type UnitSystem = 'us' | 'metric' | 'other';
export type CarbSex = 'male' | 'female';
export type EquationChoice = 'mifflin' | 'harris';

export type OtherHeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type OtherWeightUnit = 'kg' | 'lb' | 'st' | 'g';

export const CARBOHYDRATE_ACTIVITY_OPTIONS = [
  { id: 'sedentary', label: 'Sedentary: little or no exercise', pal: 1.2 },
  {
    id: 'light',
    label: 'Light: exercise 1–3 times/week',
    pal: 1.55,
  },
  { id: 'moderate', label: 'Moderate: exercise 4–5 times/week', pal: 1.75 },
  { id: 'intense', label: 'Intense exercise', pal: 2.0 },
  { id: 'very_intense', label: 'Very intense exercise', pal: 2.4 },
] as const;

export type CarbohydrateActivityId =
  (typeof CARBOHYDRATE_ACTIVITY_OPTIONS)[number]['id'];

export interface CarbohydrateCalculatorInput {
  unitSystem: UnitSystem;
  ageYearsText: string;
  sex: CarbSex;
  heightCm: string;
  weightKg: string;
  heightFt: string;
  heightIn: string;
  weightLb: string;
  otherHeight: string;
  otherHeightUnit: OtherHeightUnit;
  otherWeight: string;
  otherWeightUnit: OtherWeightUnit;
  activityId: CarbohydrateActivityId;
  equation: EquationChoice;
  settingsOpen: boolean;
  isSubmitted: boolean;
}

export interface CarbohydrateCalculatorResult {
  maintenanceKcalPerDay: number | null;
  carbRows: CarbShareRow[];
  equationLabel: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type CarbohydrateCalculatorFieldErrors = {
  form?: string;
  ageYearsText?: string;
  height?: string;
  weight?: string;
};

export function createDefaultInput(): CarbohydrateCalculatorInput {
  return {
    unitSystem: 'metric',
    ageYearsText: '25',
    sex: 'male',
    heightCm: '180',
    weightKg: '60',
    heightFt: '5',
    heightIn: '11',
    weightLb: '132',
    otherHeight: '180',
    otherHeightUnit: 'cm',
    otherWeight: '60',
    otherWeightUnit: 'kg',
    activityId: 'light',
    equation: 'mifflin',
    settingsOpen: false,
    isSubmitted: false,
  };
}

export function createEmptyInput(): CarbohydrateCalculatorInput {
  const d = createDefaultInput();
  return {
    ...d,
    ageYearsText: '',
    heightCm: '',
    weightKg: '',
    heightFt: '',
    heightIn: '',
    weightLb: '',
    otherHeight: '',
    otherWeight: '',
    isSubmitted: false,
  };
}

export function inputsEqual(
  a: CarbohydrateCalculatorInput,
  b: CarbohydrateCalculatorInput,
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}