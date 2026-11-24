/**
 * R-IPI for DLBCL — educational (ADR-018).
 *
 * Source: Sehn LH et al. The revised International Prognostic Index (R-IPI) is a
 * better predictor of outcome than the standard IPI for patients with diffuse
 * large B-cell lymphoma treated with R-CHOP. Blood. 2007;109(5):1857–1861.
 */

import type {
  DlbclPrognosisInput,
  DlbclPrognosisResult,
  RipiRiskGroup,
} from './types';

export const AGE_THRESHOLD_YEARS = 60;

export const SOURCE_NOTE =
  'Revised International Prognostic Index (R-IPI) for DLBCL treated with R-CHOP (Sehn et al., Blood 2007). Five binary factors (1 point each): age >60, stage III–IV, >1 extranodal site, elevated LDH, ECOG 2–4. Outcome percentages are published 4-year cohort estimates.';

export const DISCLAIMER =
  'Educational oncology prognostic index only — not treatment planning or individualized prognosis.';

interface OutcomeRow {
  pfsPercent: number;
  osPercent: number;
}

const OUTCOMES_BY_SCORE: Readonly<Record<number, OutcomeRow>> = {
  0: { pfsPercent: 94, osPercent: 94 },
  1: { pfsPercent: 80, osPercent: 79 },
  2: { pfsPercent: 76, osPercent: 80 },
  3: { pfsPercent: 54, osPercent: 55 },
  4: { pfsPercent: 20, osPercent: 26 },
  5: { pfsPercent: 20, osPercent: 26 },
};

export function parseAgeYears(text: string): number | null {
  const t = text.trim();
  if (t === '') return null;
  const n = Number(t.replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}

export function riskGroupForScore(score: number): RipiRiskGroup {
  if (score <= 0) return 'low';
  if (score <= 2) return score === 1 ? 'low_intermediate' : 'low_intermediate';
  if (score === 3) return 'high_intermediate';
  return 'high';
}

export function riskGroupLabel(group: RipiRiskGroup): string {
  switch (group) {
    case 'low':
      return 'Low risk (score 0)';
    case 'low_intermediate':
      return 'Low-intermediate risk (score 1–2)';
    case 'high_intermediate':
      return 'High-intermediate risk (score 3)';
    case 'high':
      return 'High risk (score 4–5)';
    default:
      return '';
  }
}

export function computeRipiScore(
  ageYears: number,
  input: Omit<DlbclPrognosisInput, 'ageYearsText'>,
): number {
  let score = 0;
  if (ageYears > AGE_THRESHOLD_YEARS) score += 1;
  if (input.stage === 'stage_3_4') score += 1;
  if (input.extranodalSites === 'more_than_one') score += 1;
  if (input.ldh === 'elevated') score += 1;
  if (input.ecog === 'two_four') score += 1;
  return score;
}

export function calculateDlbclPrognosis(input: DlbclPrognosisInput): DlbclPrognosisResult {
  const emptyBase = {
    score: 0,
    formattedScore: '',
    riskGroup: 'low' as RipiRiskGroup,
    riskGroupLabel: '',
    fourYearProgressionFreeSurvivalPercent: null,
    fourYearOverallSurvivalPercent: null,
    disclaimer: DISCLAIMER,
    sourceNote: SOURCE_NOTE,
  };

  const age = parseAgeYears(input.ageYearsText);
  if (age === null) {
    const defaultScore = computeRipiScore(AGE_THRESHOLD_YEARS, input);
    if (
      input.stage === 'stage_1_2' &&
      input.extranodalSites === 'zero_one' &&
      input.ldh === 'normal' &&
      input.ecog === 'zero_one'
    ) {
      const outcomes = OUTCOMES_BY_SCORE[0];
      return {
        ...emptyBase,
        score: 0,
        formattedScore: '0',
        riskGroup: 'low',
        riskGroupLabel: riskGroupLabel('low'),
        fourYearProgressionFreeSurvivalPercent: outcomes.pfsPercent,
        fourYearOverallSurvivalPercent: outcomes.osPercent,
        statusHeadline: 'Low risk — enter age for full score',
        statusDetail: `With age ≤ ${AGE_THRESHOLD_YEARS} and favorable factors, R-IPI score is 0 (4-year PFS and OS ≈ ${outcomes.pfsPercent}% each in R-CHOP cohort). Enter age to apply the >${AGE_THRESHOLD_YEARS}-year factor.`,
      };
    }
    return {
      ...emptyBase,
      score: defaultScore,
      formattedScore: String(defaultScore),
      riskGroup: riskGroupForScore(defaultScore),
      riskGroupLabel: riskGroupLabel(riskGroupForScore(defaultScore)),
      statusHeadline: 'Enter patient age',
      statusDetail: `Age in years is required (>${AGE_THRESHOLD_YEARS} years adds 1 point).`,
    };
  }

  if (!(age >= 0 && age <= 120)) {
    return {
      ...emptyBase,
      statusHeadline: 'Invalid age',
      statusDetail: 'Enter a realistic age in years between 0 and 120.',
    };
  }

  const score = computeRipiScore(age, input);
  const group = riskGroupForScore(score);
  const outcomes = OUTCOMES_BY_SCORE[score] ?? OUTCOMES_BY_SCORE[5];

  return {
    score,
    formattedScore: String(score),
    riskGroup: group,
    riskGroupLabel: riskGroupLabel(group),
    fourYearProgressionFreeSurvivalPercent: outcomes.pfsPercent,
    fourYearOverallSurvivalPercent: outcomes.osPercent,
    statusHeadline: riskGroupLabel(group),
    statusDetail: `R-IPI score ${score}. Published 4-year PFS ≈ ${outcomes.pfsPercent}%, OS ≈ ${outcomes.osPercent}% (R-CHOP cohort; age threshold ${AGE_THRESHOLD_YEARS} years).`,
    disclaimer: DISCLAIMER,
    sourceNote: SOURCE_NOTE,
  };
}