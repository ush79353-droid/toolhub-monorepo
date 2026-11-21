/**
 * Skinfold Body Fat — Durnin & Womersley (1974) 4-site + Siri (pure, ADR-018).
 *
 * Sites: biceps + triceps + subscapular + suprailiac (mm).
 * Density D = c − m · log10(Σ mm)
 * Body fat % (Siri) = 495/D − 450
 *
 * Coefficients from Durnin & Womersley Br J Nutr 1974;32:77–97, Table 5
 * “all four skinfolds” (primary transcription used by clincalc / Cartwright notes):
 *   Male 17–19 … 50+; Female youngest published band is 16–19 (UI label 17–19
 *   uses those female constants). Age <17 is unsupported — gated, no invented
 *   pediatric coefficients.
 */

import type {
  SkinfoldAgeBand,
  SkinfoldBodyFatInput,
  SkinfoldBodyFatResult,
  SkinfoldSex,
  SkinfoldUnit,
} from './types';

export const MM_PER_INCH = 25.4;

export const MODEL_SOURCE =
  'Durnin JVGA, Womersley J. Br J Nutr. 1974;32:77–97 (Table 5, four skinfolds). Body fat via Siri (1961): %BF = 495/D − 450.';

export const DISCLAIMER =
  'Educational estimate only — not a medical diagnosis or clinical body-composition assessment. Caliper technique, hydration, and individual variation affect accuracy. Not validated here for ages under 17.';

type Coeff = { c: number; m: number; label: string };

/** Sex/age-band coefficients (g/ml density). */
const COEFFS: Record<SkinfoldSex, Partial<Record<SkinfoldAgeBand, Coeff>>> = {
  male: {
    '17_19': { c: 1.162, m: 0.063, label: '17–19' },
    '20_29': { c: 1.1631, m: 0.0632, label: '20–29' },
    '30_39': { c: 1.1422, m: 0.0544, label: '30–39' },
    '40_49': { c: 1.162, m: 0.07, label: '40–49' },
    '50_plus': { c: 1.1715, m: 0.0779, label: '50+' },
  },
  female: {
    // Primary Table 5 youngest female band is 16–19; UI “17–19” maps here.
    '17_19': { c: 1.1549, m: 0.0678, label: '16–19 (UI 17–19)' },
    '20_29': { c: 1.1599, m: 0.0717, label: '20–29' },
    '30_39': { c: 1.1423, m: 0.0632, label: '30–39' },
    '40_49': { c: 1.1333, m: 0.0612, label: '40–49' },
    '50_plus': { c: 1.1339, m: 0.0645, label: '50+' },
  },
};

export function parseNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (!cleaned) return null;
  if (/infinity|nan/i.test(cleaned)) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function toMm(value: number, unit: SkinfoldUnit): number {
  return unit === 'mm' ? value : value * MM_PER_INCH;
}

export function fromMm(mm: number, unit: SkinfoldUnit): number {
  return unit === 'mm' ? mm : mm / MM_PER_INCH;
}

export function getCoefficients(
  sex: SkinfoldSex,
  ageBand: SkinfoldAgeBand
): Coeff | null {
  if (ageBand === 'under_17') return null;
  return COEFFS[sex][ageBand] ?? null;
}

export function siriBodyFatPercent(density: number): number | null {
  if (!Number.isFinite(density) || density <= 0) return null;
  const pct = 495 / density - 450;
  return Number.isFinite(pct) ? pct : null;
}

export function formatBodyFatPercent(pct: number): string {
  if (!Number.isFinite(pct)) return '—';
  return pct.toFixed(1);
}

export function calculateSkinfoldBodyFat(
  input: SkinfoldBodyFatInput
): SkinfoldBodyFatResult | null {
  if (input.ageBand === 'under_17') return null;

  const coeffs = getCoefficients(input.sex, input.ageBand);
  if (!coeffs) return null;

  const bicep = parseNumber(input.bicep);
  const subscapular = parseNumber(input.subscapular);
  const suprailiac = parseNumber(input.suprailiac);
  const tricep = parseNumber(input.tricep);
  if (
    bicep == null ||
    subscapular == null ||
    suprailiac == null ||
    tricep == null
  ) {
    return null;
  }
  if (!(bicep > 0) || !(subscapular > 0) || !(suprailiac > 0) || !(tricep > 0)) {
    return null;
  }

  const bMm = toMm(bicep, input.unit);
  const sMm = toMm(subscapular, input.unit);
  const iMm = toMm(suprailiac, input.unit);
  const tMm = toMm(tricep, input.unit);
  // Practical caliper range guard (mm).
  for (const mm of [bMm, sMm, iMm, tMm]) {
    if (!(mm >= 1) || mm > 80) return null;
  }

  const sumMm = bMm + sMm + iMm + tMm;
  if (!(sumMm > 0)) return null;

  const log10Sum = Math.log10(sumMm);
  if (!Number.isFinite(log10Sum)) return null;

  const density = coeffs.c - coeffs.m * log10Sum;
  const bodyFatPercent = siriBodyFatPercent(density);
  if (bodyFatPercent == null) return null;
  // Reject absurd / non-physiological outputs from bad density.
  if (bodyFatPercent < 0 || bodyFatPercent > 75) return null;

  return {
    sex: input.sex,
    ageBand: input.ageBand,
    ageBandLabel: coeffs.label,
    sumMm,
    log10Sum,
    density,
    bodyFatPercent,
    formattedBodyFatPercent: formatBodyFatPercent(bodyFatPercent),
    coefficientC: coeffs.c,
    coefficientM: coeffs.m,
    formulaNote: `D = ${coeffs.c} − ${coeffs.m} × log₁₀(${sumMm.toFixed(1)}) = ${density.toFixed(5)} g/ml; Siri %BF = 495/D − 450.`,
    disclaimer: DISCLAIMER,
  };
}
