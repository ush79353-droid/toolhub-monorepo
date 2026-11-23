/** Gupta MICA — perioperative MI or cardiac arrest (NSQIP; Gupta PK et al., Circulation 2011). */

export type FunctionalStatus = 'independent' | 'partiallyDependent' | 'totallyDependent';

export type AsaClass = 'I' | 'II' | 'III' | 'IV' | 'V';

export type CreatinineUnit = 'mgDl' | 'umolL';

export type GuptaProcedure =
  | 'anorectal'
  | 'aortic'
  | 'bariatric'
  | 'brain'
  | 'breast'
  | 'cardiac'
  | 'ent'
  | 'foregutHpb'
  | 'gallbladderAppendixAdrenalSpleen'
  | 'intestinal'
  | 'neck'
  | 'obGyn'
  | 'orthopedic'
  | 'otherAbdomen'
  | 'peripheralVascular'
  | 'skin'
  | 'spinal'
  | 'thoracic'
  | 'urology'
  | 'vein'
  | 'hernia';

export interface GuptaRiskInput {
  ageYears: string;
  functionalStatus: FunctionalStatus;
  asaClass: AsaClass;
  creatinineValue: string;
  creatinineUnit: CreatinineUnit;
  creatinineNotMeasured: boolean;
  procedure: GuptaProcedure;
}

export interface GuptaRiskResult {
  logOdds: number;
  micaRiskPercent: number;
  formattedMicaPercent: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type GuptaRiskFieldErrors = {
  form?: string;
  ageYears?: string;
  creatinineValue?: string;
};

export const CREATININE_UMOL_PER_MG_DL = 88.4;

export const MIN_AGE_YEARS = 16;

export const FUNCTIONAL_STATUS_OPTIONS: readonly {
  value: FunctionalStatus;
  label: string;
}[] = [
  { value: 'independent', label: 'Totally independent' },
  { value: 'partiallyDependent', label: 'Partially dependent' },
  { value: 'totallyDependent', label: 'Totally dependent' },
];

export const ASA_OPTIONS: readonly { value: AsaClass; label: string }[] = [
  { value: 'I', label: '1: healthy' },
  { value: 'II', label: '2: mild systemic disease' },
  { value: 'III', label: '3: severe systemic disease' },
  { value: 'IV', label: '4: severe systemic disease — constant threat to life' },
  { value: 'V', label: '5: moribund' },
];

export const CREATININE_UNIT_LABELS: Record<CreatinineUnit, string> = {
  mgDl: 'mg/dL',
  umolL: 'µmol/L',
};

export const PROCEDURE_OPTIONS: readonly {
  value: GuptaProcedure;
  label: string;
}[] = [
  { value: 'anorectal', label: 'Anorectal' },
  { value: 'aortic', label: 'Aortic' },
  { value: 'bariatric', label: 'Bariatric' },
  { value: 'brain', label: 'Brain' },
  { value: 'breast', label: 'Breast' },
  { value: 'cardiac', label: 'Cardiac' },
  { value: 'ent', label: 'ENT' },
  { value: 'foregutHpb', label: 'Foregut / HPB' },
  {
    value: 'gallbladderAppendixAdrenalSpleen',
    label: 'Gallbladder / appendix / adrenal / spleen',
  },
  { value: 'intestinal', label: 'Intestinal' },
  { value: 'neck', label: 'Neck' },
  { value: 'obGyn', label: 'OB/GYN' },
  { value: 'orthopedic', label: 'Orthopedic' },
  { value: 'otherAbdomen', label: 'Other abdomen' },
  { value: 'peripheralVascular', label: 'Peripheral vascular' },
  { value: 'skin', label: 'Skin' },
  { value: 'spinal', label: 'Spinal' },
  { value: 'thoracic', label: 'Thoracic' },
  { value: 'urology', label: 'Urology' },
  { value: 'vein', label: 'Vein' },
  { value: 'hernia', label: 'Hernia' },
];

export function createDefaultInput(): GuptaRiskInput {
  return {
    ageYears: '',
    functionalStatus: 'independent',
    asaClass: 'I',
    creatinineValue: '',
    creatinineUnit: 'mgDl',
    creatinineNotMeasured: false,
    procedure: 'anorectal',
  };
}

export function createEmptyInput(): GuptaRiskInput {
  return createDefaultInput();
}

/** Screenshot-aligned educational fixture (no pre-filled clinical values). */
export function createExampleInput(): GuptaRiskInput {
  return {
    ageYears: '50',
    functionalStatus: 'independent',
    asaClass: 'I',
    creatinineValue: '1.0',
    creatinineUnit: 'mgDl',
    creatinineNotMeasured: false,
    procedure: 'anorectal',
  };
}

export function inputsEqual(a: GuptaRiskInput, b: GuptaRiskInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}