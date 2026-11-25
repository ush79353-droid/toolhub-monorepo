/** Educational peak expiratory flow worksheet (Hankinson NHANES III / Nunn & Gregg). */

export type Sex = 'female' | 'male';
export type Ethnicity =
  | 'caucasian'
  | 'africanAmerican'
  | 'mexicanAmerican'
  | 'other';
export type HeightUnit = 'cm' | 'in' | 'm';
export type FlowUnit = 'L/s' | 'L/min';

export interface PeakFlowInput {
  sex: Sex;
  ageYears: number | null;
  height: number | null;
  heightUnit: HeightUnit;
  ethnicity: Ethnicity;
  measuredPef: number | null;
  personalBest: number | null;
  pefMax: number | null;
  pefMin: number | null;
  estimatedUnit: FlowUnit;
  measuredUnit: FlowUnit;
  personalBestUnit: FlowUnit;
  maxUnit: FlowUnit;
  minUnit: FlowUnit;
}

export interface PeakFlowResult {
  estimatedPefLs: number;
  percentOfEstimated: number | null;
  percentOfPersonalBest: number | null;
  diurnalVariabilityPercent: number | null;
  formattedEstimated: string;
  formattedPercentEstimated: string;
  formattedPercentBest: string;
  formattedDiurnal: string;
  equationLabel: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type PeakFlowFieldErrors = {
  form?: string;
  ageYears?: string;
  height?: string;
  measuredPef?: string;
  personalBest?: string;
  pefMax?: string;
  pefMin?: string;
};

export function createDefaultInput(): PeakFlowInput {
  return {
    sex: 'female',
    ageYears: null,
    height: null,
    heightUnit: 'cm',
    ethnicity: 'caucasian',
    measuredPef: null,
    personalBest: null,
    pefMax: null,
    pefMin: null,
    estimatedUnit: 'L/s',
    measuredUnit: 'L/s',
    personalBestUnit: 'L/s',
    maxUnit: 'L/s',
    minUnit: 'L/s',
  };
}

export function createEmptyInput(): PeakFlowInput {
  return createDefaultInput();
}

/** Female Caucasian 40 y · 165 cm · measured = predicted → 100% estimated. */
export function createExampleInput(): PeakFlowInput {
  return {
    sex: 'female',
    ageYears: 40,
    height: 165,
    heightUnit: 'cm',
    ethnicity: 'caucasian',
    measuredPef: null,
    personalBest: null,
    pefMax: null,
    pefMin: null,
    estimatedUnit: 'L/s',
    measuredUnit: 'L/s',
    personalBestUnit: 'L/s',
    maxUnit: 'L/s',
    minUnit: 'L/s',
  };
}

export function inputsEqual(a: PeakFlowInput, b: PeakFlowInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
