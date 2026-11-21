export type AgeUnit = 'yrs' | 'mos';
export type WeightUnit = 'kg' | 'lb';

export type InfantTylenolProductId =
  | 'infantSuspension'
  | 'childrensSuspension'
  | 'chewable'
  | 'dissolvePack';

export type DoseStatus =
  | 'awaiting_inputs'
  | 'awaiting_product'
  | 'labeled_dose'
  | 'ask_doctor'
  | 'do_not_use'
  | 'not_labeled';

export interface InfantTylenolDosageInput {
  ageText: string;
  ageUnit: AgeUnit;
  weightText: string;
  weightUnit: WeightUnit;
  /** Screenshot default: no radio selected. */
  productId: InfantTylenolProductId | null;
}

export interface InfantTylenolDosageFieldErrors {
  form?: string;
  ageText?: string;
  weightText?: string;
  productId?: string;
}

export interface InfantTylenolDosageResult {
  productId: InfantTylenolProductId | null;
  productLabel: string | null;
  activeIngredient: string | null;
  status: DoseStatus;
  doseLine: string | null;
  doseMg: number | null;
  doseMl: number | null;
  ageYears: number | null;
  weightLb: number | null;
  frequencyNote: string;
  maxDosesNote: string;
  acetaminophenWarning: string;
  interpretation: string;
  disclaimer: string;
  sourceNote: string;
}

export function createEmptyInput(): InfantTylenolDosageInput {
  return {
    ageText: '',
    ageUnit: 'yrs',
    weightText: '',
    weightUnit: 'kg',
    productId: null,
  };
}

export function createDefaultInput(): InfantTylenolDosageInput {
  return createEmptyInput();
}

export function inputsEqual(
  a: InfantTylenolDosageInput,
  b: InfantTylenolDosageInput,
): boolean {
  return (
    a.ageText === b.ageText &&
    a.ageUnit === b.ageUnit &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.productId === b.productId
  );
}
