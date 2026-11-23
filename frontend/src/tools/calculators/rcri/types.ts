export type YesNo = 'no' | 'yes';

export interface RcriInput {
  cerebrovascularDisease: YesNo;
  congestiveHeartFailure: YesNo;
  ischemicHeartDisease: YesNo;
  creatinineAbove2: YesNo;
  insulinTreatment: YesNo;
  highRiskSurgery: YesNo;
}

export type RcriClass = 'I' | 'II' | 'III' | 'IV';

export interface RcriResult {
  totalPoints: number;
  rcriClass: RcriClass;
  riskPercent: number;
  formattedPoints: string;
  formattedRisk: string;
  interpretation: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type RcriFieldErrors = {
  form?: string;
};

/** Screenshot defaults: all six factors No. */
export function createDefaultInput(): RcriInput {
  return {
    cerebrovascularDisease: 'no',
    congestiveHeartFailure: 'no',
    ischemicHeartDisease: 'no',
    creatinineAbove2: 'no',
    insulinTreatment: 'no',
    highRiskSurgery: 'no',
  };
}

export function createEmptyInput(): RcriInput {
  return createDefaultInput();
}

/** Educational fixture: all No → 0 points, class I, 3.9%. */
export function createExampleInput(): RcriInput {
  return createDefaultInput();
}

export function inputsEqual(a: RcriInput, b: RcriInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const FACTOR_OPTIONS: readonly {
  key: keyof RcriInput;
  label: string;
  tip: string;
}[] = [
  {
    key: 'cerebrovascularDisease',
    label: 'History of cerebrovascular disease?',
    tip: 'Prior stroke or TIA (Lee RCRI definition).',
  },
  {
    key: 'congestiveHeartFailure',
    label: 'History of congestive heart failure?',
    tip: 'History of HF, pulmonary edema, or PND; exam/CXR findings per Lee.',
  },
  {
    key: 'ischemicHeartDisease',
    label: 'History of ischemic heart disease?',
    tip: 'Prior MI, positive stress test, ischemic chest pain/nitrates, or pathologic Q waves.',
  },
  {
    key: 'creatinineAbove2',
    label: 'Pre-surgery creatinine level >2 mg/dL (176.8 µmol/L)?',
    tip: 'Strictly greater than 2.0 mg/dL (≈177 µmol/L). Exactly 2.0 mg/dL scores 0.',
  },
  {
    key: 'insulinTreatment',
    label: 'Pre-surgery treatment with insulin?',
    tip: 'Preoperative insulin therapy for diabetes (Lee RCRI).',
  },
  {
    key: 'highRiskSurgery',
    label: 'High risk noncardiac surgery?',
    tip: 'Intraperitoneal, intrathoracic, or suprainguinal vascular surgery.',
  },
];
