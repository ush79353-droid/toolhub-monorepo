export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'lb' | 'st';

/** Obstetric history per Grobman 2021 race-neutral model (mutually exclusive). */
export type PriorVaginalHistory =
  | 'none'
  | 'vaginalBeforePriorCesarean'
  | 'priorVbac';

export interface VbacInput {
  ageYears: string;
  heightValue: string;
  heightUnit: HeightUnit;
  weightValue: string;
  weightUnit: WeightUnit;
  arrestIndicationForPriorCesarean: boolean;
  priorVaginalHistory: PriorVaginalHistory;
  treatedChronicHypertension: boolean;
}

export interface VbacResult {
  probabilityPercent: number;
  formattedProbability: string;
  logOdds: number;
  formattedLogOdds: string;
  prePregnancyWeightKg: number;
  heightCm: number;
  displayBmi: number | null;
  formattedBmi: string | null;
  modelLabel: string;
  modelVersion: string;
  eligibilitySummary: string;
  disclaimer: string;
}

export type VbacFieldErrors = {
  form?: string;
  ageYears?: string;
  heightValue?: string;
  weightValue?: string;
};

export function createEmptyInput(): VbacInput {
  return {
    ageYears: '',
    heightValue: '',
    heightUnit: 'cm',
    weightValue: '',
    weightUnit: 'kg',
    arrestIndicationForPriorCesarean: false,
    priorVaginalHistory: 'none',
    treatedChronicHypertension: false,
  };
}

/** Paper Table 3 example 7 — baseline counseling scenario. */
export function createExampleInput(): VbacInput {
  return {
    ageYears: '30',
    heightValue: '156',
    heightUnit: 'cm',
    weightValue: '71',
    weightUnit: 'kg',
    arrestIndicationForPriorCesarean: false,
    priorVaginalHistory: 'none',
    treatedChronicHypertension: false,
  };
}

export function inputsEqual(a: VbacInput, b: VbacInput): boolean {
  return (
    a.ageYears === b.ageYears &&
    a.heightValue === b.heightValue &&
    a.heightUnit === b.heightUnit &&
    a.weightValue === b.weightValue &&
    a.weightUnit === b.weightUnit &&
    a.arrestIndicationForPriorCesarean === b.arrestIndicationForPriorCesarean &&
    a.priorVaginalHistory === b.priorVaginalHistory &&
    a.treatedChronicHypertension === b.treatedChronicHypertension
  );
}