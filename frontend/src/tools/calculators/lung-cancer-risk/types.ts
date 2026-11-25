/**
 * HUNT Lung Cancer Risk (Markaki et al. 2018; corrigendum 2022) — educational.
 * Ever-smokers only. No FX. Share uses page URL only (no clinical payload).
 */

export type Sex = 'male' | 'female';
export type WeightUnit = 'kg' | 'lb';
export type HeightUnit = 'cm' | 'in';
export type YesNo = 'yes' | 'no';

export interface LungCancerRiskInput {
  sex: Sex;
  ageYears: number | null;
  weight: number | null;
  weightUnit: WeightUnit;
  height: number | null;
  heightUnit: HeightUnit;
  smokingYears: number | null;
  cigarettesPerDay: number | null;
  yearsSinceQuitting: number | null;
  smokeRoomHours: number | null;
  dailyCough: YesNo;
}

export interface LungCancerRiskResult {
  bmi: number;
  packYears: number;
  risk6Percent: number;
  risk16Percent: number;
  formattedRisk6: string;
  formattedRisk16: string;
  formattedBmi: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type LungCancerRiskFieldErrors = {
  form?: string;
  ageYears?: string;
  weight?: string;
  height?: string;
  smokingYears?: string;
  cigarettesPerDay?: string;
  yearsSinceQuitting?: string;
  smokeRoomHours?: string;
};

/** Screenshot: Male selected; numerics blank (no medically actionable defaults). */
export function createDefaultInput(): LungCancerRiskInput {
  return {
    sex: 'male',
    ageYears: null,
    weight: null,
    weightUnit: 'kg',
    height: null,
    heightUnit: 'cm',
    smokingYears: null,
    cigarettesPerDay: null,
    yearsSinceQuitting: null,
    smokeRoomHours: null,
    dailyCough: 'no',
  };
}

export function createEmptyInput(): LungCancerRiskInput {
  return createDefaultInput();
}

/** Published-style ever-smoker fixture for engine checks (not a clinical default). */
export function createExampleInput(): LungCancerRiskInput {
  return {
    sex: 'male',
    ageYears: 65,
    weight: 80,
    weightUnit: 'kg',
    height: 175,
    heightUnit: 'cm',
    smokingYears: 40,
    cigarettesPerDay: 20,
    yearsSinceQuitting: 0,
    smokeRoomHours: 0,
    dailyCough: 'no',
  };
}

export function inputsEqual(
  a: LungCancerRiskInput,
  b: LungCancerRiskInput,
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const WEIGHT_UNITS: readonly WeightUnit[] = ['kg', 'lb'];
export const HEIGHT_UNITS: readonly HeightUnit[] = ['cm', 'in'];
