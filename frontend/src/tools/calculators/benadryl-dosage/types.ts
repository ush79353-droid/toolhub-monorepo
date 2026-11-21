export type AgeUnit = 'yrs';

export type BenadrylProductId =
  | 'ultratab'
  | 'extraStrength'
  | 'childrensLiquid'
  | 'dyeFreeLiquid';

export type DoseStatus =
  | 'awaiting_age'
  | 'labeled_dose'
  | 'do_not_use'
  | 'doctor_directed_only'
  | 'not_labeled_for_age';

export interface BenadrylDosageInput {
  ageYearsText: string;
  ageUnit: AgeUnit;
  productId: BenadrylProductId;
}

export interface BenadrylDosageFieldErrors {
  ageYearsText?: string;
  productId?: string;
}

export interface BenadrylDosageResult {
  productId: BenadrylProductId;
  productLabel: string;
  activeIngredient: string;
  indicationHtmlSafe: string;
  maxDosesPer24Hours: number | null;
  maxDosesNote: string | null;
  frequencyNote: string;
  status: DoseStatus;
  doseLine: string | null;
  ageYears: number | null;
  interpretation: string;
  disclaimer: string;
  sourceNote: string;
}

export function createEmptyInput(): BenadrylDosageInput {
  return {
    ageYearsText: '',
    ageUnit: 'yrs',
    productId: 'ultratab',
  };
}
