/**
 * Egg Freezing — Goldman et al. Hum Reprod 2017 counseling model (ADR-018).
 *
 * Equation 1 (blastocyst from mature oocyte, with thaw survival):
 *   p(blast) = S × exp(2.8043 − 0.1112 × Age*)
 *   S = 0.95 for age < 36; 0.85 for age ≥ 36
 *   Age* = 35 for all ages ≤ 35 (paper groups ≤35 together); else chronological age
 *
 * Equation 2 (independent trials → ≥1 live birth):
 *   p = 0.6 × p(euploid) × p(blast)
 *   P(≥1) = 1 − (1 − p)^n
 *
 * p(euploid) from Supplementary Table SI (Reprogenetics aCGH, male-factor / by-request).
 * Endpoint: modeled chance of at least one live birth — not a guarantee.
 *
 * Source: Goldman RH et al. Hum Reprod. 2017;32(4):853–859. doi:10.1093/humrep/dex008
 */

import type { EggFreezingInput, EggFreezingResult } from './types';

export const SOURCE_LABEL =
  'Goldman RH, Racowsky C, Farland LV, Munné S, Ribustello L, Fox JH. Predicting the likelihood of live birth for elective oocyte cryopreservation. Hum Reprod. 2017;32(4):853–859 (doi:10.1093/humrep/dex008).';

export const DISCLAIMER =
  'Educational counseling estimate only. It does not guarantee a live birth, recommend how many eggs to freeze, or replace clinic-specific counseling. Assumptions (thaw survival, euploidy, 60% live birth per euploid blastocyst) vary by center.';

/** Inclusive age band supported by the published yearly tables (≤35 grouped). */
export const MIN_AGE_YEARS = 25;
export const MAX_AGE_YEARS = 44;

export const MAX_MATURE_EGGS = 100;

/** Poisson regression coefficients (Equation 1). */
export const BLAST_INTERCEPT = 2.8043;
export const BLAST_AGE_COEF = 0.1112;

export const SURVIVAL_UNDER_36 = 0.95;
export const SURVIVAL_36_PLUS = 0.85;
export const LIVE_BIRTH_PER_EUPLOID = 0.6;

/**
 * Supplementary Table SI — proportion of euploid blastocysts by age.
 * Ages ≤35 share the ≤35 row.
 */
export const EUPLOID_BY_AGE: Readonly<Record<number, number>> = {
  35: 0.574,
  36: 0.564,
  37: 0.486,
  38: 0.466,
  39: 0.44,
  40: 0.359,
  41: 0.327,
  42: 0.285,
  43: 0.206,
  44: 0.127,
};

export function parseInteger(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (!/^-?\d+$/.test(t)) {
    const n = Number(t);
    if (!Number.isFinite(n) || !Number.isInteger(n)) return null;
    return n;
  }
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function ageForBlastRegression(ageYears: number): number {
  return ageYears <= 35 ? 35 : ageYears;
}

export function thawSurvival(ageYears: number): number {
  return ageYears < 36 ? SURVIVAL_UNDER_36 : SURVIVAL_36_PLUS;
}

export function pEuploid(ageYears: number): number | null {
  if (ageYears <= 35) return EUPLOID_BY_AGE[35];
  return EUPLOID_BY_AGE[ageYears] ?? null;
}

export function pBlastocyst(ageYears: number): number {
  const S = thawSurvival(ageYears);
  const ageStar = ageForBlastRegression(ageYears);
  return S * Math.exp(BLAST_INTERCEPT - BLAST_AGE_COEF * ageStar);
}

/** Per-mature-oocyte probability of contributing a live birth (independent trial). */
export function pPerMatureOocyte(ageYears: number): number | null {
  const pe = pEuploid(ageYears);
  if (pe == null) return null;
  const pb = pBlastocyst(ageYears);
  const p = LIVE_BIRTH_PER_EUPLOID * pe * pb;
  if (!Number.isFinite(p) || p < 0 || p > 1) return null;
  return p;
}

/**
 * P(at least one live birth) = 1 − (1 − p)^n for identical independent trials.
 */
export function probabilityAtLeastOneLiveBirth(
  ageYears: number,
  matureEggs: number,
): number | null {
  if (!Number.isInteger(matureEggs) || matureEggs < 0) return null;
  if (matureEggs === 0) return 0;
  const p = pPerMatureOocyte(ageYears);
  if (p == null) return null;
  if (p === 0) return 0;
  if (p >= 1) return 1;
  const q = Math.pow(1 - p, matureEggs);
  if (!Number.isFinite(q)) return null;
  return 1 - q;
}

export function formatPercentDisplay(probability: number): string {
  const pct = probability * 100;
  if (pct > 99) return '>99';
  if (pct >= 10) return String(Math.round(pct));
  return String(Number(pct.toFixed(1)));
}

export function calculateEggFreezing(
  input: EggFreezingInput,
  ageYears: number,
  matureEggs: number,
): EggFreezingResult {
  const probability = probabilityAtLeastOneLiveBirth(ageYears, matureEggs);
  if (probability == null) {
    throw new Error('Egg freezing probability could not be computed.');
  }

  const percentDisplay = formatPercentDisplay(probability);
  const p = pPerMatureOocyte(ageYears);

  return {
    ageYears,
    matureEggs,
    probabilityAtLeastOne: probability,
    percentDisplay,
    explanation: `Goldman 2017 Equation 2: P(≥1 live birth) = 1 − (1 − p)^n with p = 0.6 × p(euploid) × p(blast) ≈ ${
      p != null ? (p * 100).toFixed(2) : '?'
    }% per mature oocyte at age ${ageYears}, n = ${matureEggs} → ${percentDisplay}%.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
