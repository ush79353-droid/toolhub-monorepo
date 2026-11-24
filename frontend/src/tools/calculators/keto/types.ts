export type KetoSex = 'female' | 'male';
export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'lb' | 'st';
export type MacroMassUnit = 'g' | 'oz';

/**
 * Activity × Mifflin–St Jeor PAL bands (same educational bands as sibling macro tools).
 * Screenshot default label: Exercise 1-2 times/week → 1.4
 */
export const ACTIVITY_OPTIONS = [
  { id: 'sedentary', label: 'Little/no exercise (sedentary lifestyle)', pal: 1.2 },
  { id: 'light', label: 'Exercise 1-2 times/week', pal: 1.4 },
  { id: 'moderate', label: 'Exercise 2-3 times/week', pal: 1.6 },
  { id: 'hard', label: 'Exercise 4-5 times/week', pal: 1.75 },
  { id: 'extra', label: 'Physical job or hard exercise 6-7 times/week', pal: 2.0 },
  { id: 'athlete', label: 'Professional athlete', pal: 2.3 },
] as const;

export type ActivityId = (typeof ACTIVITY_OPTIONS)[number]['id'];

/** Screenshot diet pace radios. */
export type DietPace = 'normal' | 'strict';

/** Normal 0.5 kg/week → ±500 kcal/day; Strict 1 kg/week → ±1000 kcal/day. */
export const PACE_KG_PER_WEEK: Record<DietPace, number> = {
  normal: 0.5,
  strict: 1,
};

export const PACE_DELTA_KCAL: Record<DietPace, number> = {
  normal: 500,
  strict: 1000,
};

/**
 * Default recreational / modified ketogenic energy shares (must total 100).
 * JAMA 2020 patient page + UK modified ketogenic diet teaching: ~75% fat, 20% protein, 5% carbohydrate.
 */
export const DEFAULT_FAT_PCT = 75;
export const DEFAULT_CARB_PCT = 5;
export const DEFAULT_PROTEIN_PCT = 20;

export interface KetoMacroSplit {
  fatKcal: number;
  carbKcal: number;
  proteinKcal: number;
  fatG: number;
  carbG: number;
  proteinG: number;
  fatPct: number;
  carbPct: number;
  proteinPct: number;
}

export interface KetoInput {
  sex: KetoSex;
  heightValue: string;
  heightUnit: HeightUnit;
  weightValue: string;
  weightUnit: WeightUnit;
  ageYears: string;
  activityId: ActivityId;
  targetWeightValue: string;
  targetWeightUnit: WeightUnit;
  dietPace: DietPace;
  /** Recommended energy shares — editable; must total 100 when calculating. */
  fatPct: string;
  carbPct: string;
  proteinPct: string;
  macroMassUnit: MacroMassUnit;
}

export interface KetoResult {
  sex: KetoSex;
  ageYears: number;
  heightCm: number;
  weightKg: number;
  activityId: ActivityId;
  activityLabel: string;
  pal: number;
  bmrKcal: number;
  maintenanceKcal: number;
  formattedMaintenance: string;
  /** Allocated daily energy after Normal/Strict pace adjustment (or maintenance). */
  allocatedKcal: number;
  formattedAllocated: string;
  changeDirection: 'lose' | 'gain' | 'maintain';
  targetWeightKg: number | null;
  kgPerWeek: number | null;
  deltaKcal: number | null;
  weeksToGoal: number | null;
  goalMessage: string | null;
  macros: KetoMacroSplit;
  formattedFatKcal: string;
  formattedCarbKcal: string;
  formattedProteinKcal: string;
  formattedFatMass: string;
  formattedCarbMass: string;
  formattedProteinMass: string;
  explanation: string;
  disclaimer: string;
}

export type KetoFieldErrors = {
  form?: string;
  heightValue?: string;
  weightValue?: string;
  ageYears?: string;
  targetWeightValue?: string;
  fatPct?: string;
  carbPct?: string;
  proteinPct?: string;
  macrosTotal?: string;
};

export function activityById(id: ActivityId) {
  return ACTIVITY_OPTIONS.find((o) => o.id === id) ?? ACTIVITY_OPTIONS[1];
}

/** Screenshot defaults: Female; blank anthropometrics; Exercise 1-2/week; Normal; 75/5/20. */
export function createDefaultInput(): KetoInput {
  return {
    sex: 'female',
    heightValue: '',
    heightUnit: 'cm',
    weightValue: '',
    weightUnit: 'kg',
    ageYears: '',
    activityId: 'light',
    targetWeightValue: '',
    targetWeightUnit: 'kg',
    dietPace: 'normal',
    fatPct: String(DEFAULT_FAT_PCT),
    carbPct: String(DEFAULT_CARB_PCT),
    proteinPct: String(DEFAULT_PROTEIN_PCT),
    macroMassUnit: 'g',
  };
}

export function createEmptyInput(): KetoInput {
  return createDefaultInput();
}

export function inputsEqual(a: KetoInput, b: KetoInput): boolean {
  return (
    a.sex === b.sex &&
    a.heightValue === b.heightValue &&
    a.heightUnit === b.heightUnit &&
    a.weightValue === b.weightValue &&
    a.weightUnit === b.weightUnit &&
    a.ageYears === b.ageYears &&
    a.activityId === b.activityId &&
    a.targetWeightValue === b.targetWeightValue &&
    a.targetWeightUnit === b.targetWeightUnit &&
    a.dietPace === b.dietPace &&
    a.fatPct === b.fatPct &&
    a.carbPct === b.carbPct &&
    a.proteinPct === b.proteinPct &&
    a.macroMassUnit === b.macroMassUnit
  );
}
