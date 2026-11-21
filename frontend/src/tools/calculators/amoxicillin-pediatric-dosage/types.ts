export type StrengthMgPer5mL = 125 | 200 | 250 | 400;
export type Indication = 'general' | 'strep_a' | 'endocarditis';
export type Route = 'oral' | 'iv';
export type AgeUnit = 'mos' | 'yrs';
export type WeightUnit = 'kg' | 'lb';
export type DoseDisplayUnit = 'mg' | 'mL';
export type LastEdited = 'requirement' | 'dose' | 'params';

export interface AmoxicillinPediatricDosageInput {
  age: string;
  ageUnit: AgeUnit;
  weight: string;
  weightUnit: WeightUnit;
  strength: StrengthMgPer5mL;
  indication: Indication;
  route: Route;
  /** Clinician-entered or suggested mg/kg/dose (blank when fixed-mg regimen). */
  requirementMgPerKg: string;
  doseValue: string;
  doseUnit: DoseDisplayUnit;
  lastEdited: LastEdited;
}

export interface AmoxicillinPediatricDosageResult {
  ageMonths: number;
  weightKg: number;
  strength: StrengthMgPer5mL;
  indication: Indication;
  route: Route;
  regimenAvailable: boolean;
  unavailableReason: string | null;
  /** Suggested or clinician mg/kg/dose; null when fixed-mg band applies. */
  requirementMgPerKg: number | null;
  doseMg: number | null;
  doseMl: number | null;
  cappedToMax: boolean;
  maxDoseMg: number | null;
  dosesPerDay: number | null;
  frequencyNote: string;
  rangeNote: string | null;
  sourceNote: string;
  formattedRequirement: string;
  formattedDoseMg: string;
  formattedDoseMl: string;
  disclaimer: string;
}

export type AmoxicillinPediatricDosageFieldErrors = {
  form?: string;
  age?: string;
  weight?: string;
  requirementMgPerKg?: string;
  doseValue?: string;
  route?: string;
};

/** Screenshot-first: blank clinical fields; strength/indication/route UI defaults only. */
export function createDefaultInput(): AmoxicillinPediatricDosageInput {
  return {
    age: '',
    ageUnit: 'mos',
    weight: '',
    weightUnit: 'kg',
    strength: 125,
    indication: 'general',
    route: 'oral',
    requirementMgPerKg: '',
    doseValue: '',
    doseUnit: 'mg',
    lastEdited: 'params',
  };
}

export function createEmptyInput(): AmoxicillinPediatricDosageInput {
  return createDefaultInput();
}

/** Non-seeded fixture for engine demos only — not loaded as a medical default. */
export function createExampleInput(): AmoxicillinPediatricDosageInput {
  return {
    age: '24',
    ageUnit: 'mos',
    weight: '10',
    weightUnit: 'kg',
    strength: 125,
    indication: 'general',
    route: 'oral',
    requirementMgPerKg: '15',
    doseValue: '150',
    doseUnit: 'mg',
    lastEdited: 'params',
  };
}

export function inputsEqual(
  a: AmoxicillinPediatricDosageInput,
  b: AmoxicillinPediatricDosageInput
): boolean {
  return (
    a.age === b.age &&
    a.ageUnit === b.ageUnit &&
    a.weight === b.weight &&
    a.weightUnit === b.weightUnit &&
    a.strength === b.strength &&
    a.indication === b.indication &&
    a.route === b.route &&
    a.requirementMgPerKg === b.requirementMgPerKg &&
    a.doseValue === b.doseValue &&
    a.doseUnit === b.doseUnit
  );
}
