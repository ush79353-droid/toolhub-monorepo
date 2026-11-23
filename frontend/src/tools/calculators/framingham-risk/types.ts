/** Lipid display unit; canonical engine values are mg/dL. */
export type CholesterolUnit = 'mg_dl' | 'mmol_l';

export type Sex = 'female' | 'male';

export type YesNo = 'yes' | 'no';

export interface FraminghamRiskInput {
  ageYears: string;
  sex: Sex;
  bpTreatment: YesNo;
  sbpMmHg: string;
  totalCholesterolValue: string;
  totalCholesterolUnit: CholesterolUnit;
  hdlCholesterolValue: string;
  hdlCholesterolUnit: CholesterolUnit;
  smoker: YesNo;
}

export interface FraminghamRiskBreakdown {
  agePoints: number;
  totalCholesterolPoints: number;
  hdlPoints: number;
  sbpPoints: number;
  smokingPoints: number;
}

export interface FraminghamRiskResult {
  totalPoints: number;
  breakdown: FraminghamRiskBreakdown;
  ageYears: number;
  sbpMmHg: number;
  totalCholesterolMgDl: number;
  hdlCholesterolMgDl: number;
  formattedPoints: string;
  tenYearRiskLabel: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type FraminghamRiskFieldErrors = {
  form?: string;
  ageYears?: string;
  sbpMmHg?: string;
  totalCholesterolValue?: string;
  hdlCholesterolValue?: string;
};

/** Screenshot defaults: Male, no BP treatment, non-smoker; numeric fields blank. */
export function createDefaultInput(): FraminghamRiskInput {
  return {
    ageYears: '',
    sex: 'male',
    bpTreatment: 'no',
    sbpMmHg: '',
    totalCholesterolValue: '',
    totalCholesterolUnit: 'mg_dl',
    hdlCholesterolValue: '',
    hdlCholesterolUnit: 'mg_dl',
    smoker: 'no',
  };
}

export function createEmptyInput(): FraminghamRiskInput {
  return createDefaultInput();
}

/** Educational fixture aligned with ATP III bands (man, 45 y). */
export function createExampleInput(): FraminghamRiskInput {
  return {
    ageYears: '45',
    sex: 'male',
    bpTreatment: 'no',
    sbpMmHg: '130',
    totalCholesterolValue: '180',
    totalCholesterolUnit: 'mg_dl',
    hdlCholesterolValue: '50',
    hdlCholesterolUnit: 'mg_dl',
    smoker: 'no',
  };
}

export function inputsEqual(
  a: FraminghamRiskInput,
  b: FraminghamRiskInput
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const SEX_OPTIONS: readonly { value: Sex; label: string }[] = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
];

export const YES_NO_OPTIONS: readonly { value: YesNo; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

export const CHOLESTEROL_UNIT_LABELS: Record<CholesterolUnit, string> = {
  mg_dl: 'mg/dL',
  mmol_l: 'mmol/L',
};