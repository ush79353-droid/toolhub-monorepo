/** TIMI Risk Score for UA/NSTEMI — educational Antman et al. JAMA 2000 factors. */

export type YesNo = 'no' | 'yes';

export type TimiFactorKey =
  | 'ageGe65'
  | 'cadRiskFactorsGe3'
  | 'knownCadStenosisGe50'
  | 'aspirinPast7Days'
  | 'severeAnginaGe2In24h'
  | 'stDeviation'
  | 'positiveCardiacMarker';

export interface TimiUanstemiInput {
  ageGe65: YesNo;
  cadRiskFactorsGe3: YesNo;
  knownCadStenosisGe50: YesNo;
  aspirinPast7Days: YesNo;
  severeAnginaGe2In24h: YesNo;
  stDeviation: YesNo;
  positiveCardiacMarker: YesNo;
}

export interface TimiUanstemiBreakdown {
  ageGe65: 0 | 1;
  cadRiskFactorsGe3: 0 | 1;
  knownCadStenosisGe50: 0 | 1;
  aspirinPast7Days: 0 | 1;
  severeAnginaGe2In24h: 0 | 1;
  stDeviation: 0 | 1;
  positiveCardiacMarker: 0 | 1;
}

export interface TimiUanstemiResult {
  score: number;
  formattedScore: string;
  breakdown: TimiUanstemiBreakdown;
  /** Published TIMI 11B composite rate for the score band (e.g. 4.7). */
  publishedEventRatePercent: number | null;
  /**
   * Display percent used in the result copy (0–1 band rounded to 5 per capture;
   * other bands nearest integer of published rates).
   */
  displayEventRatePercent: number | null;
  formattedDisplayEventRate: string;
  riskSummary: string;
  endpointLines: readonly string[];
  disclaimer: string;
  sourceLabel: string;
}

export type TimiUanstemiFieldErrors = { form?: string };

export interface TimiFactorOption {
  key: TimiFactorKey;
  label: string;
  tip?: string;
}

/** Screenshot defaults — all No → score 0. */
export function createDefaultInput(): TimiUanstemiInput {
  return {
    ageGe65: 'no',
    cadRiskFactorsGe3: 'no',
    knownCadStenosisGe50: 'no',
    aspirinPast7Days: 'no',
    severeAnginaGe2In24h: 'no',
    stDeviation: 'no',
    positiveCardiacMarker: 'no',
  };
}

export function createEmptyInput(): TimiUanstemiInput {
  return createDefaultInput();
}

/** All seven factors Yes → score 7. */
export function createExampleInput(): TimiUanstemiInput {
  return {
    ageGe65: 'yes',
    cadRiskFactorsGe3: 'yes',
    knownCadStenosisGe50: 'yes',
    aspirinPast7Days: 'yes',
    severeAnginaGe2In24h: 'yes',
    stDeviation: 'yes',
    positiveCardiacMarker: 'yes',
  };
}

export function inputsEqual(
  a: TimiUanstemiInput,
  b: TimiUanstemiInput,
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const FACTOR_OPTIONS: readonly TimiFactorOption[] = [
  {
    key: 'ageGe65',
    label: 'Age ≥ 65 years',
  },
  {
    key: 'cadRiskFactorsGe3',
    label: '≥ 3 risk factors for CAD',
    tip: 'Antman TIMI UA/NSTEMI: family history of CAD, hypertension, hypercholesterolemia, diabetes, or current smoker. Award the point only when ≥3 of these are present.',
  },
  {
    key: 'knownCadStenosisGe50',
    label: 'Known CAD (stenosis ≥ 50%)',
    tip: 'Prior coronary stenosis of 50% or greater (known CAD). Counts 1 point when present.',
  },
  {
    key: 'aspirinPast7Days',
    label: 'ASA use in the past 7 days',
    tip: 'Aspirin (ASA) use in the 7 days before presentation. Counts 1 point when present.',
  },
  {
    key: 'severeAnginaGe2In24h',
    label: 'Severe angina (≥ 2 episodes within 24h)',
  },
  {
    key: 'stDeviation',
    label: 'EKG deviations',
    tip: 'ST-segment deviation on the index ECG at presentation. Antman TIMI UA/NSTEMI uses ST deviation ≥0.5 mm (0.05 mV).',
  },
  {
    key: 'positiveCardiacMarker',
    label: 'Positive cardiac marker',
    tip: 'Elevated serum cardiac markers — CK-MB and/or cardiac-specific troponin above the assay decision limit used in TIMI 11B / ESSENCE.',
  },
];
