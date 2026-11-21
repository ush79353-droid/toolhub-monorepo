export type PatientSituation = 'pregnant' | 'postpartum';
export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'lb' | 'st';

/** Screenshot checklist ids (RCOG GTG 37a Appendix III subset). */
export type PreExistingFactorId =
  | 'ageOver35'
  | 'previousVte'
  | 'previousVteMajorSurgery'
  | 'highRiskThrombophilia'
  | 'medicalComorbidities'
  | 'familyHistoryVte'
  | 'lowRiskThrombophilia'
  | 'parityGe3'
  | 'smoker'
  | 'grossVaricoseVeins';

export type ObstetricFactorId =
  | 'preeclampsia'
  | 'artIvf'
  | 'multiplePregnancy';

export type TransientFactorId =
  | 'surgicalProcedure'
  | 'hyperemesis'
  | 'ohss'
  | 'systemicInfection'
  | 'immobilityDehydration';

export interface VteRiskPregnancyInput {
  situation: PatientSituation;
  heightValue: string;
  heightUnit: HeightUnit;
  weightValue: string;
  weightUnit: WeightUnit;
  preExisting: Record<PreExistingFactorId, boolean>;
  obstetric: Record<ObstetricFactorId, boolean>;
  transient: Record<TransientFactorId, boolean>;
}

export interface ScoredFactor {
  id: string;
  label: string;
  points: number;
  group: 'preExisting' | 'obstetric' | 'transient' | 'obesity';
}

export interface VteRiskPregnancyResult {
  situation: PatientSituation;
  bmi: number | null;
  formattedBmi: string | null;
  obesityPoints: number;
  totalScore: number;
  scoredFactors: ScoredFactor[];
  excludedNotes: string[];
  guidelineLabel: string;
  guidelineVersion: string;
  bandSummary: string;
  disclaimer: string;
}

export type VteRiskPregnancyFieldErrors = {
  form?: string;
  heightValue?: string;
  weightValue?: string;
};

function emptyPreExisting(): Record<PreExistingFactorId, boolean> {
  return {
    ageOver35: false,
    previousVte: false,
    previousVteMajorSurgery: false,
    highRiskThrombophilia: false,
    medicalComorbidities: false,
    familyHistoryVte: false,
    lowRiskThrombophilia: false,
    parityGe3: false,
    smoker: false,
    grossVaricoseVeins: false,
  };
}

function emptyObstetric(): Record<ObstetricFactorId, boolean> {
  return {
    preeclampsia: false,
    artIvf: false,
    multiplePregnancy: false,
  };
}

function emptyTransient(): Record<TransientFactorId, boolean> {
  return {
    surgicalProcedure: false,
    hyperemesis: false,
    ohss: false,
    systemicInfection: false,
    immobilityDehydration: false,
  };
}

/** Screenshot defaults: pregnant selected; blank anthropometrics; no ticks. */
export function createDefaultInput(): VteRiskPregnancyInput {
  return {
    situation: 'pregnant',
    heightValue: '',
    heightUnit: 'cm',
    weightValue: '',
    weightUnit: 'kg',
    preExisting: emptyPreExisting(),
    obstetric: emptyObstetric(),
    transient: emptyTransient(),
  };
}

export function createEmptyInput(): VteRiskPregnancyInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: VteRiskPregnancyInput,
  b: VteRiskPregnancyInput
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
