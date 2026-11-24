export type DriSex = 'female' | 'male';
export type HeightUnit = 'cm' | 'in';
export type WeightUnit = 'kg' | 'lb';

/** Omni-style life-stage bands used for DRI row lookup. */
export type DriAgeBand =
  | 'birth_6mo'
  | 'mo7_12'
  | 'y1_3'
  | 'y4_8'
  | 'y9_13'
  | 'y14_18'
  | 'y19_50'
  | 'y51_70'
  | 'y71plus';

export type DriActivityId =
  | 'little_no'
  | 'ex_1_2'
  | 'ex_2_3'
  | 'ex_3_5'
  | 'ex_6_7'
  | 'athlete';

export interface DriInput {
  sex: DriSex;
  ageBand: DriAgeBand;
  heightText: string;
  heightUnit: HeightUnit;
  weightText: string;
  weightUnit: WeightUnit;
  activityId: DriActivityId;
  smoker: boolean;
}

export interface DriMacroRange {
  lowGrams: number;
  highGrams: number;
}

export interface DriNutrientRow {
  id: string;
  label: string;
  /** Display amount already rounded for presentation. */
  display: string;
  unit: string;
  kind: 'rda' | 'ai' | 'amdr' | 'derived' | 'cdrr';
}

export interface DriResult {
  bmi: number | null;
  bmiDisplay: string;
  caloriesKcal: number | null;
  caloriesDisplay: string;
  carbs: DriMacroRange | null;
  protein: DriMacroRange | null;
  fat: DriMacroRange | null;
  fiberGrams: number | null;
  waterLiters: number | null;
  nutrientRows: DriNutrientRow[];
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type DriFieldErrors = {
  heightText?: string;
  weightText?: string;
};

export const AGE_BAND_OPTIONS: readonly { id: DriAgeBand; label: string }[] = [
  { id: 'birth_6mo', label: 'Birth to 6 months' },
  { id: 'mo7_12', label: '7–12 months' },
  { id: 'y1_3', label: '1–3 years' },
  { id: 'y4_8', label: '4–8 years' },
  { id: 'y9_13', label: '9–13 years' },
  { id: 'y14_18', label: '14–18 years' },
  { id: 'y19_50', label: '19-50 years' },
  { id: 'y51_70', label: '51-70 years' },
  { id: 'y71plus', label: '71+ years' },
] as const;

export const ACTIVITY_OPTIONS: readonly {
  id: DriActivityId;
  label: string;
  pal: number;
}[] = [
  { id: 'little_no', label: 'Little/no exercise', pal: 1.2 },
  { id: 'ex_1_2', label: 'Exercise 1-2 times/week', pal: 1.4 },
  { id: 'ex_2_3', label: 'Exercise 2-3 times/week', pal: 1.6 },
  { id: 'ex_3_5', label: 'Exercise 3-5 times/week', pal: 1.75 },
  { id: 'ex_6_7', label: 'Exercise 6-7 times/week', pal: 2.0 },
  { id: 'athlete', label: 'Professional athlete', pal: 2.4 },
] as const;

export function createDefaultInput(): DriInput {
  return {
    sex: 'male',
    ageBand: 'y19_50',
    heightText: '',
    heightUnit: 'cm',
    weightText: '',
    weightUnit: 'kg',
    activityId: 'little_no',
    smoker: false,
  };
}

export function createEmptyInput(): DriInput {
  return createDefaultInput();
}

export function inputsEqual(a: DriInput, b: DriInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
