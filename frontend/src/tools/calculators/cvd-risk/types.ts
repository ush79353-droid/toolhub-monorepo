/** Framingham general CVD 10-year risk (lipid equation) — educational. */

export type Sex = 'female' | 'male';
export type CholUnit = 'mg_dl' | 'mmol_l';

export interface CvdRiskInput {
  sex: Sex | null;
  ageYears: string;
  hdl: string;
  hdlUnit: CholUnit;
  totalChol: string;
  totalCholUnit: CholUnit;
  sbpMmHg: string;
  treatedHypertension: boolean;
  smoker: boolean;
  diabetes: boolean;
}

export interface CvdRiskResult {
  riskPercent: number;
  formattedRiskPercent: string;
  linearPredictor: number;
  modelLabel: string;
}

export type CvdRiskFieldErrors = {
  sex?: string;
  ageYears?: string;
  hdl?: string;
  totalChol?: string;
  sbpMmHg?: string;
  form?: string;
};

export function createDefaultInput(): CvdRiskInput {
  return {
    sex: null,
    ageYears: '',
    hdl: '',
    hdlUnit: 'mg_dl',
    totalChol: '',
    totalCholUnit: 'mg_dl',
    sbpMmHg: '',
    treatedHypertension: false,
    smoker: false,
    diabetes: false,
  };
}

export function createEmptyInput(): CvdRiskInput {
  return createDefaultInput();
}

export function inputsEqual(a: CvdRiskInput, b: CvdRiskInput): boolean {
  return (
    a.sex === b.sex &&
    a.ageYears === b.ageYears &&
    a.hdl === b.hdl &&
    a.hdlUnit === b.hdlUnit &&
    a.totalChol === b.totalChol &&
    a.totalCholUnit === b.totalCholUnit &&
    a.sbpMmHg === b.sbpMmHg &&
    a.treatedHypertension === b.treatedHypertension &&
    a.smoker === b.smoker &&
    a.diabetes === b.diabetes
  );
}
