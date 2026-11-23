/** HEART score — educational chest-pain risk arithmetic (Six et al. 2008). */

export type EcgCategory =
  | 'normal'
  | 'abnormalNoSignificantSt'
  | 'significantStDeviation';

export type HistoryCategory =
  | 'slightlyOrNonSuspicious'
  | 'moderatelySuspicious'
  | 'highlySuspicious';

export type TroponinCategory =
  | 'belowCutoff'
  | 'oneToThreeTimesCutoff'
  | 'greaterThanThreeTimesCutoff';

export type RiskFactorsCategory =
  | 'none'
  | 'oneOrTwo'
  | 'threePlusOrAtheroscleroticDisease';

export interface HeartScoreInput {
  ageYears: string;
  ecg: EcgCategory;
  history: HistoryCategory;
  troponin: TroponinCategory;
  riskFactors: RiskFactorsCategory;
}

export interface HeartScoreComponentPoints {
  age: number;
  ecg: number;
  history: number;
  troponin: number;
  riskFactors: number;
}

export interface HeartScoreResult {
  totalScore: number;
  formattedTotalScore: string;
  components: HeartScoreComponentPoints;
  componentSummary: string;
  disclaimer: string;
  sourceLabel: string;
}

export type HeartScoreFieldErrors = {
  ageYears?: string;
};

export function createDefaultInput(): HeartScoreInput {
  return {
    ageYears: '',
    ecg: 'normal',
    history: 'slightlyOrNonSuspicious',
    troponin: 'belowCutoff',
    riskFactors: 'none',
  };
}

export function createEmptyInput(): HeartScoreInput {
  return createDefaultInput();
}

/** Moderate chest-pain profile → total 5 (Six/Backus teaching). */
export function createExampleInput(): HeartScoreInput {
  return {
    ageYears: '58',
    ecg: 'abnormalNoSignificantSt',
    history: 'moderatelySuspicious',
    troponin: 'oneToThreeTimesCutoff',
    riskFactors: 'oneOrTwo',
  };
}

export function inputsEqual(a: HeartScoreInput, b: HeartScoreInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const ECG_OPTIONS: readonly {
  value: EcgCategory;
  label: string;
  points: 0 | 1 | 2;
}[] = [
  { value: 'normal', label: 'Normal', points: 0 },
  {
    value: 'abnormalNoSignificantSt',
    label: 'Abnormal ECG, no significant ST-deviation',
    points: 1,
  },
  {
    value: 'significantStDeviation',
    label: 'Significant ST-deviation',
    points: 2,
  },
];

export const HISTORY_OPTIONS: readonly {
  value: HistoryCategory;
  label: string;
  points: 0 | 1 | 2;
}[] = [
  {
    value: 'slightlyOrNonSuspicious',
    label: 'Slightly or non-suspicious',
    points: 0,
  },
  { value: 'moderatelySuspicious', label: 'Moderately suspicious', points: 1 },
  { value: 'highlySuspicious', label: 'Highly suspicious', points: 2 },
];

export const TROPONIN_OPTIONS: readonly {
  value: TroponinCategory;
  label: string;
  points: 0 | 1 | 2;
}[] = [
  { value: 'belowCutoff', label: 'Below normal cutoff', points: 0 },
  {
    value: 'oneToThreeTimesCutoff',
    label: '1–3 times the normal cutoff',
    points: 1,
  },
  {
    value: 'greaterThanThreeTimesCutoff',
    label: '>3 times the normal cutoff',
    points: 2,
  },
];

export const RISK_FACTOR_OPTIONS: readonly {
  value: RiskFactorsCategory;
  label: string;
  points: 0 | 1 | 2;
}[] = [
  { value: 'none', label: 'No known risk factors', points: 0 },
  { value: 'oneOrTwo', label: '1–2 risk factors', points: 1 },
  {
    value: 'threePlusOrAtheroscleroticDisease',
    label: '3 or more risk factors or history of an atherosclerotic disease',
    points: 2,
  },
];