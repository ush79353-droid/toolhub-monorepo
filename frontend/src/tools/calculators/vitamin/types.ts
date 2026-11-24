/**
 * Vitamin Calculator — types (ADR-018).
 * Screenshot: Age (blank, yrs), Sex Male/Female, Vitamin dropdown starting at A.
 */

export type VitaminSex = 'male' | 'female';
export type AgeUnit = 'years' | 'months';

/** Vitamin nutrient ids from `dri/dri-data` DRI_NUTRIENTS (vitamins + biotin + choline). */
export type VitaminId =
  | 'vit_a'
  | 'vit_b1'
  | 'vit_b2'
  | 'vit_b3'
  | 'vit_b5'
  | 'vit_b6'
  | 'biotin'
  | 'vit_b9'
  | 'vit_b12'
  | 'vit_c'
  | 'vit_d'
  | 'vit_e'
  | 'vit_k'
  | 'choline';

export type RecommendationKind = 'rda' | 'ai';

export interface VitaminInput {
  ageText: string;
  ageUnit: AgeUnit;
  sex: VitaminSex;
  vitaminId: VitaminId;
}

export interface VitaminResult {
  vitaminId: VitaminId;
  vitaminLabel: string;
  vitaminShortLabel: string;
  /** Life-stage band used for the lookup (e.g. males 19–50 y). */
  populationLabel: string;
  recommendationKind: RecommendationKind | null;
  recommendationAmount: number | null;
  recommendationDisplay: string;
  unit: string;
  /** Tolerable Upper Intake Level when published; null if ND / not established. */
  ulAmount: number | null;
  ulDisplay: string;
  ulNote: string | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type VitaminFieldErrors = {
  ageText?: string;
};

/** Screenshot order: A first, then B-complex, C, D, E, K, Choline. */
export const VITAMIN_OPTIONS: readonly {
  id: VitaminId;
  shortLabel: string;
  label: string;
}[] = [
  { id: 'vit_a', shortLabel: 'A', label: 'Vitamin A' },
  { id: 'vit_b1', shortLabel: 'B₁ (Thiamin)', label: 'Vitamin B₁ (Thiamin)' },
  { id: 'vit_b2', shortLabel: 'B₂ (Riboflavin)', label: 'Vitamin B₂ (Riboflavin)' },
  { id: 'vit_b3', shortLabel: 'B₃ (Niacin)', label: 'Vitamin B₃ (Niacin)' },
  { id: 'vit_b5', shortLabel: 'B₅ (Pantothenic Acid)', label: 'Vitamin B₅ (Pantothenic Acid)' },
  { id: 'vit_b6', shortLabel: 'B₆', label: 'Vitamin B₆' },
  { id: 'biotin', shortLabel: 'B₇ (Biotin)', label: 'Biotin (B₇, H)' },
  { id: 'vit_b9', shortLabel: 'B₉ (Folate)', label: 'Vitamin B₉ (Folate, Folic Acid)' },
  { id: 'vit_b12', shortLabel: 'B₁₂', label: 'Vitamin B₁₂' },
  { id: 'vit_c', shortLabel: 'C', label: 'Vitamin C' },
  { id: 'vit_d', shortLabel: 'D', label: 'Vitamin D' },
  { id: 'vit_e', shortLabel: 'E', label: 'Vitamin E' },
  { id: 'vit_k', shortLabel: 'K', label: 'Vitamin K' },
  { id: 'choline', shortLabel: 'Choline', label: 'Choline' },
] as const;

/** Screenshot defaults: blank age, Male, Vitamin A. */
export function createDefaultInput(): VitaminInput {
  return {
    ageText: '',
    ageUnit: 'years',
    sex: 'male',
    vitaminId: 'vit_a',
  };
}

export function createEmptyInput(): VitaminInput {
  return createDefaultInput();
}

export function inputsEqual(a: VitaminInput, b: VitaminInput): boolean {
  return (
    a.ageText === b.ageText &&
    a.ageUnit === b.ageUnit &&
    a.sex === b.sex &&
    a.vitaminId === b.vitaminId
  );
}
