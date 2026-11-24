/**
 * TIMI Risk Score for UA/NSTEMI — UI stub (engine commit fills Antman scoring).
 *
 * Planned (Antman et al. JAMA 2000; TIMI 11B test cohort):
 * - One point each for seven binary factors (score 0–7)
 * - 14-day composite: death, new/recurrent MI, or urgent revascularization
 * - Published band rates: 0/1 4.7%; 2 8.3%; 3 13.2%; 4 19.9%; 5 26.2%; 6/7 40.9%
 * - Display: 0–1 band rounded to 5% (screenshot capture)
 */

import type {
  TimiUanstemiBreakdown,
  TimiUanstemiInput,
  TimiUanstemiResult,
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

/** UI stub — returns empty result until the engine commit. */
export function calculateTimiUanstemi(
  _input: TimiUanstemiInput,
): TimiUanstemiResult {
  return emptyResult();
}
