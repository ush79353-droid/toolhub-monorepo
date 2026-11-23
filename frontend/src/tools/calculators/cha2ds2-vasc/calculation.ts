/**
 * CHA₂DS₂-VASc score (Lip et al. refinement of CHADS₂).
 *
 * Points: CHF 1, Hypertension 1, Age 65–74 → 1 / ≥75 → 2, Diabetes 1,
 * prior Stroke/TIA/TE 2, Vascular disease 1, Female sex 1. Range 0–9.
 *
 * Annual rates: Friberg et al. Swedish AF cohort (never on warfarin),
 * Eur Heart J 2012 — unadjusted ischaemic stroke and stroke/TIA/peripheral
 * embolism per 100 years at risk (Table 2). Educational only; not a therapy
 * order. Omits anticoagulation recommendations (prompt / ADR safety).
 */

import type {
  AgeBand,
  Cha2ds2VascInput,
  Cha2ds2VascResult,
  RiskBand,
  YesNo,
} from './types';

export const SOURCE_CITATION =
  'Lip GYH et al. Chest 2010 (score definition); Friberg L et al. Eur Heart J 2012;33:1500–1510 (Swedish AF cohort event rates, no warfarin).';

export const RATE_SOURCE_NOTE =
  'Annual rates from Friberg et al. Swedish AF cohort patients never using warfarin (unadjusted). Eligible nonvalvular AF educational context only.';

const YES = 1;

function yn(v: YesNo): boolean {
  return v === 'yes';
}

function agePoints(band: AgeBand): number {
  if (band === 'ge75') return 2;
  if (band === '65to74') return 1;
  return 0;
}

/** Friberg 2012 Table 2 unadjusted rates (% per year). */
export const FRIBERG_RATES: Readonly<
  Record<number, { stroke: number; composite: number }>
> = {
  0: { stroke: 0.2, composite: 0.3 },
  1: { stroke: 0.6, composite: 0.9 },
  2: { stroke: 2.2, composite: 2.9 },
  3: { stroke: 3.2, composite: 4.6 },
  4: { stroke: 4.8, composite: 6.7 },
  5: { stroke: 7.2, composite: 10.0 },
  6: { stroke: 9.7, composite: 13.6 },
  7: { stroke: 11.2, composite: 15.7 },
  8: { stroke: 10.8, composite: 15.2 },
  9: { stroke: 12.2, composite: 17.4 },
};

export function computeCha2ds2VascScore(input: Cha2ds2VascInput): number {
  let score = 0;
  if (yn(input.chf)) score += YES;
  if (yn(input.hypertension)) score += YES;
  score += agePoints(input.ageBand);
  if (yn(input.diabetes)) score += YES;
  if (yn(input.female)) score += YES;
  if (yn(input.priorStrokeTie)) score += 2;
  if (yn(input.vascularDisease)) score += YES;
  return score;
}

export function isFemaleSexOnly(input: Cha2ds2VascInput): boolean {
  return (
    yn(input.female) &&
    !yn(input.chf) &&
    !yn(input.hypertension) &&
    !yn(input.diabetes) &&
    !yn(input.priorStrokeTie) &&
    !yn(input.vascularDisease) &&
    input.ageBand === 'under65'
  );
}

export function riskBandForScore(
  score: number,
  femaleSexOnly: boolean
): RiskBand {
  if (score <= 0) return 'low';
  if (femaleSexOnly) return 'low';
  if (score === 1) return 'intermediate';
  return 'high';
}

function riskBandLabel(band: RiskBand): string {
  if (band === 'low') return 'low risk group';
  if (band === 'intermediate') return 'intermediate risk group';
  return 'high risk group';
}

function formatPercent(n: number): string {
  if (Number.isInteger(n)) return `${n}%`;
  return `${n}%`;
}

export function calculateCha2ds2Vasc(
  input: Cha2ds2VascInput
): Cha2ds2VascResult {
  const score = computeCha2ds2VascScore(input);
  const rates = FRIBERG_RATES[score] ?? FRIBERG_RATES[0];
  const femaleSexOnly = isFemaleSexOnly(input);
  const riskBand = riskBandForScore(score, femaleSexOnly);
  const label = riskBandLabel(riskBand);

  const interpretation = [
    `The patient is in the ${label}.`,
    `The annual risk of stroke is ${formatPercent(rates.stroke)} and the risk of stroke/TIA or peripheral embolism is ${formatPercent(rates.composite)} per year.`,
  ].join(' ');

  return {
    score,
    formattedScore: String(score),
    riskBand,
    riskBandLabel: label,
    strokeRiskPercent: rates.stroke,
    compositeRiskPercent: rates.composite,
    formattedStrokeRisk: formatPercent(rates.stroke),
    formattedCompositeRisk: formatPercent(rates.composite),
    interpretation,
    femaleSexOnly,
    femaleSexOnlyNote: femaleSexOnly
      ? 'Score 1 from female sex alone is often treated as comparable to score 0 in men for risk-band labeling in many AF guidelines; this tool still shows the Friberg rate row for score 1. Not a treatment decision.'
      : null,
    rateSourceNote: RATE_SOURCE_NOTE,
  };
}
