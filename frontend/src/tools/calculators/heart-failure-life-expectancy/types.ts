export type Sex = 'male' | 'female';

export type NyhaClass = 'I' | 'II' | 'III' | 'IV';

export type HeightUnit = 'm' | 'cm' | 'ft' | 'in';
export type WeightUnit = 'kg' | 'lb';
export type CreatinineUnit = 'mg/dL' | 'µmol/L';

export interface HeartFailureLifeExpectancyInput {
  sex: Sex;
  ageYears: string;
  heightValue: string;
  heightUnit: HeightUnit;
  weightValue: string;
  weightUnit: WeightUnit;
  /** Derived display; recomputed from height/weight when both valid. */
  bmiDisplay: string;
  creatinineValue: string;
  creatinineUnit: CreatinineUnit;
  efPercent: string;
  systolicBp: string;
  nyhaClass: NyhaClass;
  takingAceiArb: boolean;
  takingBetaBlocker: boolean;
  heartFailureOver18Months: boolean;
  hasCopd: boolean;
  isSmoker: boolean;
  hasDiabetes: boolean;
}

export interface HeartFailureLifeExpectancyResult {
  maggicScore: number;
  mortality1Year: number | null;
  mortality3Year: number | null;
  survival1YearPercent: number | null;
  survival3YearPercent: number | null;
  formattedScore: string;
  formattedSurvival1Year: string;
  formattedSurvival3Year: string;
  tableInRange: boolean;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type HeartFailureLifeExpectancyFieldErrors = {
  form?: string;
  ageYears?: string;
  heightValue?: string;
  weightValue?: string;
  creatinineValue?: string;
  efPercent?: string;
  systolicBp?: string;
};

export const HEIGHT_UNIT_LABELS: Record<HeightUnit, string> = {
  m: 'm',
  cm: 'cm',
  ft: 'ft',
  in: 'in',
};

export const WEIGHT_UNIT_LABELS: Record<WeightUnit, string> = {
  kg: 'kg',
  lb: 'lb',
};

export const CREATININE_UNIT_LABELS: Record<CreatinineUnit, string> = {
  'mg/dL': 'mg/dL',
  'µmol/L': 'µmol/L',
};

export function createEmptyInput(): HeartFailureLifeExpectancyInput {
  return {
    sex: 'male',
    ageYears: '',
    heightValue: '',
    heightUnit: 'm',
    weightValue: '',
    weightUnit: 'kg',
    bmiDisplay: '',
    creatinineValue: '',
    creatinineUnit: 'mg/dL',
    efPercent: '',
    systolicBp: '',
    nyhaClass: 'I',
    takingAceiArb: false,
    takingBetaBlocker: false,
    heartFailureOver18Months: false,
    hasCopd: false,
    isSmoker: false,
    hasDiabetes: false,
  };
}

export function inputsEqual(
  a: HeartFailureLifeExpectancyInput,
  b: HeartFailureLifeExpectancyInput,
): boolean {
  return (
    a.sex === b.sex &&
    a.ageYears === b.ageYears &&
    a.heightValue === b.heightValue &&
    a.heightUnit === b.heightUnit &&
    a.weightValue === b.weightValue &&
    a.weightUnit === b.weightUnit &&
    a.creatinineValue === b.creatinineValue &&
    a.creatinineUnit === b.creatinineUnit &&
    a.efPercent === b.efPercent &&
    a.systolicBp === b.systolicBp &&
    a.nyhaClass === b.nyhaClass &&
    a.takingAceiArb === b.takingAceiArb &&
    a.takingBetaBlocker === b.takingBetaBlocker &&
    a.heartFailureOver18Months === b.heartFailureOver18Months &&
    a.hasCopd === b.hasCopd &&
    a.isSmoker === b.isSmoker &&
    a.hasDiabetes === b.hasDiabetes
  );
}