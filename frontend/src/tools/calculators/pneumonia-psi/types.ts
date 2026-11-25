/** Pneumonia Severity Index (PSI / PORT) — screenshot-first (ADR-023). */

export type PsiSex = 'female' | 'male' | '';

export interface PsiInput {
  sex: PsiSex;
  ageText: string;
  nursingHome: boolean;
  renalDisease: boolean;
  cerebrovascularDisease: boolean;
  liverDisease: boolean;
  neoplasm: boolean;
  chf: boolean;
  alteredMentalStatus: boolean;
  pleuralEffusion: boolean;
  respiratoryRateOver30: boolean;
  pulseOver125: boolean;
  systolicBpUnder90: boolean;
  temperatureAbnormal: boolean;
  bunOverThreshold: boolean;
  hematocritUnder30: boolean;
  sodiumUnder130: boolean;
  glucoseOver250: boolean;
  arterialPhUnder735: boolean;
  po2Under60: boolean;
}

export type PsiRiskClass = 'I' | 'II' | 'III' | 'IV' | 'V';

export interface PsiPointBreakdown {
  age: number;
  nursingHome: number;
  neoplasm: number;
  liverDisease: number;
  chf: number;
  cerebrovascularDisease: number;
  renalDisease: number;
  alteredMentalStatus: number;
  pleuralEffusion: number;
  respiratoryRateOver30: number;
  pulseOver125: number;
  systolicBpUnder90: number;
  temperatureAbnormal: number;
  bunOverThreshold: number;
  hematocritUnder30: number;
  sodiumUnder130: number;
  glucoseOver250: number;
  arterialPhUnder735: number;
  po2Under60: number;
}

export interface PsiResult {
  totalPoints: number | null;
  formattedPoints: string;
  riskClass: PsiRiskClass | null;
  classLabel: string | null;
  classIPathway: boolean;
  points: PsiPointBreakdown | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type PsiFieldErrors = {
  ageText?: string;
  sex?: string;
};

export function createDefaultInput(): PsiInput {
  return {
    sex: 'female',
    ageText: '',
    nursingHome: false,
    renalDisease: false,
    cerebrovascularDisease: false,
    liverDisease: false,
    neoplasm: false,
    chf: false,
    alteredMentalStatus: false,
    pleuralEffusion: false,
    respiratoryRateOver30: false,
    pulseOver125: false,
    systolicBpUnder90: false,
    temperatureAbnormal: false,
    bunOverThreshold: false,
    hematocritUnder30: false,
    sodiumUnder130: false,
    glucoseOver250: false,
    arterialPhUnder735: false,
    po2Under60: false,
  };
}

export function createEmptyInput(): PsiInput {
  return { ...createDefaultInput(), sex: '' };
}

export function inputsEqual(a: PsiInput, b: PsiInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}