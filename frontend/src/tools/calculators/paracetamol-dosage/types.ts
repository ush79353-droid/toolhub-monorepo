export type AgeUnit = 'yrs' | 'mos';
export type WeightUnit = 'kg' | 'lb';

export type DoseStatus =
  | 'awaiting_inputs'
  | 'too_young'
  | 'ready'
  | 'capped';

export interface ParacetamolDosageInput {
  age: string;
  ageUnit: AgeUnit;
  weight: string;
  weightUnit: WeightUnit;
}

export interface ParacetamolDosageResult {
  status: DoseStatus;
  ageYears: number | null;
  weightKg: number | null;
  singleDoseMg: number | null;
  dailyDoseMg: number | null;
  formattedSingleDose: string | null;
  formattedDailyDose: string | null;
  frequencyNote: string;
  intervalNote: string;
  infantTylenolHref: string;
  sourceNote: string;
  disclaimer: string;
  statusNote: string | null;
}

export type ParacetamolDosageFieldErrors = {
  form?: string;
  age?: string;
  weight?: string;
};

/** Screenshot shows an example; defaults stay blank (no seeded clinical values). */
export function createDefaultInput(): ParacetamolDosageInput {
  return {
    age: '',
    ageUnit: 'yrs',
    weight: '',
    weightUnit: 'kg',
  };
}

export function createEmptyInput(): ParacetamolDosageInput {
  return createDefaultInput();
}

/** Reviewed fixture matching screenshot: 8 y · 21 kg → 315 mg / 1,260 mg. */
export function createExampleInput(): ParacetamolDosageInput {
  return {
    age: '8',
    ageUnit: 'yrs',
    weight: '21',
    weightUnit: 'kg',
  };
}

export function inputsEqual(
  a: ParacetamolDosageInput,
  b: ParacetamolDosageInput,
): boolean {
  return (
    a.age === b.age &&
    a.ageUnit === b.ageUnit &&
    a.weight === b.weight &&
    a.weightUnit === b.weightUnit
  );
}
