export type Sex = 'female' | 'male';

export type AcrBand = 'lt30' | '30to300' | 'gt300';

export type AlbuminUnit = 'g_dl' | 'g_l';
export type BicarbonateUnit = 'meq_l' | 'mmol_l';
export type CalciumUnit = 'mg_dl' | 'mmol_l';
export type PhosphorusUnit = 'mg_dl' | 'mmol_l';

export interface KidneyFailureRiskInput {
  sex: Sex;
  ageYears: string;
  acrBand: AcrBand;
  egfr: string;
  albuminValue: string;
  albuminUnit: AlbuminUnit;
  bicarbonateValue: string;
  bicarbonateUnit: BicarbonateUnit;
  calciumValue: string;
  calciumUnit: CalciumUnit;
  phosphorusValue: string;
  phosphorusUnit: PhosphorusUnit;
}

export interface KidneyFailureRiskBreakdown {
  agePoints: number;
  sexPoints: number;
  acrPoints: number;
  egfrPoints: number;
  albuminPoints: number;
  bicarbonatePoints: number;
  calciumPoints: number;
  phosphorusPoints: number;
}

export interface KidneyFailureRiskResult {
  totalPoints: number;
  breakdown: KidneyFailureRiskBreakdown;
  fiveYearProbabilityLabel: string;
  formattedPoints: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type KidneyFailureRiskFieldErrors = {
  form?: string;
  ageYears?: string;
  egfr?: string;
  albuminValue?: string;
  bicarbonateValue?: string;
  calciumValue?: string;
  phosphorusValue?: string;
};

/** Screenshot defaults: Female, ACR <30 mg/g; numeric labs blank. */
export function createDefaultInput(): KidneyFailureRiskInput {
  return {
    sex: 'female',
    ageYears: '',
    acrBand: 'lt30',
    egfr: '',
    albuminValue: '',
    albuminUnit: 'g_dl',
    bicarbonateValue: '',
    bicarbonateUnit: 'meq_l',
    calciumValue: '',
    calciumUnit: 'mg_dl',
    phosphorusValue: '',
    phosphorusUnit: 'mg_dl',
  };
}

export function createEmptyInput(): KidneyFailureRiskInput {
  return createDefaultInput();
}

/** Tangri JAMA 2011 Table 4 patient A (points fixture). */
export function createExampleInput(): KidneyFailureRiskInput {
  return {
    sex: 'male',
    ageYears: '70',
    acrBand: '30to300',
    egfr: '30',
    albuminValue: '3.5',
    albuminUnit: 'g_dl',
    bicarbonateValue: '21',
    bicarbonateUnit: 'meq_l',
    calciumValue: '9.0',
    calciumUnit: 'mg_dl',
    phosphorusValue: '4.5',
    phosphorusUnit: 'mg_dl',
  };
}

export function inputsEqual(
  a: KidneyFailureRiskInput,
  b: KidneyFailureRiskInput
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const SEX_OPTIONS: readonly { value: Sex; label: string }[] = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
];

export const ACR_OPTIONS: readonly { value: AcrBand; label: string }[] = [
  { value: 'lt30', label: '< 30 mg/g' },
  { value: '30to300', label: '30 - 300 mg/g' },
  { value: 'gt300', label: '> 300 mg/g' },
];

export const ALBUMIN_UNIT_LABELS: Record<AlbuminUnit, string> = {
  g_dl: 'g/dL',
  g_l: 'g/L',
};

export const BICARBONATE_UNIT_LABELS: Record<BicarbonateUnit, string> = {
  meq_l: 'mEq/L',
  mmol_l: 'mmol/L',
};

export const CALCIUM_UNIT_LABELS: Record<CalciumUnit, string> = {
  mg_dl: 'mg/dL',
  mmol_l: 'mmol/L',
};

export const PHOSPHORUS_UNIT_LABELS: Record<PhosphorusUnit, string> = {
  mg_dl: 'mg/dL',
  mmol_l: 'mmol/L',
};
