/**
 * TIMI Risk Score for UA/NSTEMI — Antman et al. JAMA 2000 (TIMI 11B test cohort).
 *
 * Seven binary predictors, 1 point each (score 0–7). Endpoint through 14 days:
 * all-cause mortality, new or recurrent MI, or severe recurrent ischemia
 * requiring urgent revascularization.
 *
 * Published composite rates (Table; scores 0–1 and 6–7 pooled):
 *   0/1 → 4.7% | 2 → 8.3% | 3 → 13.2% | 4 → 19.9% | 5 → 26.2% | 6/7 → 40.9%
 *
 * Display rounding (screenshot capture): 0–1 band → 5%; other bands → nearest
 * integer of the published rate (8, 13, 20, 26, 41).
 *
 * ST criterion: ST-segment deviation ≥0.5 mm on the presenting ECG.
 * No FX.
 */

import type {
  TimiUanstemiBreakdown,
  TimiUanstemiInput,
  TimiUanstemiResult,
  YesNo,
} from './types';

export const SOURCE_LABEL =
  'Antman EM et al. The TIMI risk score for unstable angina/non–ST elevation MI. JAMA. 2000;284(7):835–842. TIMI 11B test-cohort 14-day composite rates.';

export const DISCLAIMER =
  'Educational TIMI UA/NSTEMI risk score only. It does not diagnose ACS, order antithrombotic therapy, or replace bedside judgment.';

export const ENDPOINT_LINES = [
  'All-cause mortality;',
  'New or recurrent MI (myocardial infarction); and',
  'Severe recurrent ischemia requiring urgent revascularization.',
] as const;

/** Published TIMI 11B composite % by integer score (0 and 1 share 4.7; 6 and 7 share 40.9). */
export const PUBLISHED_EVENT_RATE_BY_SCORE: readonly number[] = [
  4.7, // 0 (pooled 0/1)
  4.7, // 1
  8.3, // 2
  13.2, // 3
  19.9, // 4
  26.2, // 5
  40.9, // 6 (pooled 6/7)
  40.9, // 7
];

export const MAX_SCORE = 7;

function yesPoint(v: YesNo): 0 | 1 {
  return v === 'yes' ? 1 : 0;
}

export function emptyBreakdown(): TimiUanstemiBreakdown {
  return {
    ageGe65: 0,
    cadRiskFactorsGe3: 0,
    knownCadStenosisGe50: 0,
    aspirinPast7Days: 0,
    severeAnginaGe2In24h: 0,
    stDeviation: 0,
    positiveCardiacMarker: 0,
  };
}

export function buildBreakdown(input: TimiUanstemiInput): TimiUanstemiBreakdown {
  return {
    ageGe65: yesPoint(input.ageGe65),
    cadRiskFactorsGe3: yesPoint(input.cadRiskFactorsGe3),
    knownCadStenosisGe50: yesPoint(input.knownCadStenosisGe50),
    aspirinPast7Days: yesPoint(input.aspirinPast7Days),
    severeAnginaGe2In24h: yesPoint(input.severeAnginaGe2In24h),
    stDeviation: yesPoint(input.stDeviation),
    positiveCardiacMarker: yesPoint(input.positiveCardiacMarker),
  };
}

export function sumBreakdown(b: TimiUanstemiBreakdown): number {
  return (
    b.ageGe65 +
    b.cadRiskFactorsGe3 +
    b.knownCadStenosisGe50 +
    b.aspirinPast7Days +
    b.severeAnginaGe2In24h +
    b.stDeviation +
    b.positiveCardiacMarker
  );
}

export function publishedEventRatePercent(score: number): number {
  if (!Number.isInteger(score) || score < 0 || score > MAX_SCORE) {
    throw new Error(`TIMI UA/NSTEMI score out of range: ${score}`);
  }
  return PUBLISHED_EVENT_RATE_BY_SCORE[score]!;
}

/**
 * Display percent for the result copy.
 * 0–1 band: round published 4.7 → 5 (screenshot default capture).
 * Other bands: nearest integer of the published rate.
 */
export function displayEventRatePercent(score: number): number {
  const published = publishedEventRatePercent(score);
  if (score === 0 || score === 1) return 5;
  return Math.round(published);
}

export function emptyResult(): TimiUanstemiResult {
  return {
    score: 0,
    formattedScore: '',
    breakdown: emptyBreakdown(),
    publishedEventRatePercent: null,
    displayEventRatePercent: null,
    formattedDisplayEventRate: '',
    riskSummary: '',
    endpointLines: ENDPOINT_LINES,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}

export function calculateTimiUanstemi(
  input: TimiUanstemiInput,
): TimiUanstemiResult {
  const breakdown = buildBreakdown(input);
  const score = sumBreakdown(breakdown);
  const published = publishedEventRatePercent(score);
  const display = displayEventRatePercent(score);
  const formattedDisplayEventRate = `${display}%`;

  return {
    score,
    formattedScore: String(score),
    breakdown,
    publishedEventRatePercent: published,
    displayEventRatePercent: display,
    formattedDisplayEventRate,
    riskSummary: `Over the next 14 days, there is ${formattedDisplayEventRate} risk of the TIMI 11B composite endpoint (educational cohort rate; published ${published}% for this band).`,
    endpointLines: ENDPOINT_LINES,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
