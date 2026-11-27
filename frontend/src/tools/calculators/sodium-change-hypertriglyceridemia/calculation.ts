/**
 * Sodium change in hypertriglyceridemia (educational, ADR-018).
 *
 * Merck Manual / common teaching form for indirect ISE volume displacement:
 *   ΔNa (mEq/L) = triglycerides (mg/dL) × 0.002
 *   corrected Na = measured Na + ΔNa
 *
 * Fixture: measured 130 mEq/L · TG 5000 mg/dL → ΔNa 10 · corrected 140.
 *
 * TG mmol/L → mg/dL uses conventional factor 88.57 (≈88.5).
 * Applies to indirect ISE dilution methods — not direct ISE / osmometry truth.
 *
 * Sources: Merck Manual clinical calculator; Weisberg LS, Am J Med 1989 (≈1.6–2 mEq/L per 1000 mg/dL TG).
 */

import type {
  SodiumChangeInput,
  SodiumChangeResult,
  TriglycerideUnit,
} from './types';

/** mEq/L change per mg/dL triglyceride (Merck Manual). */
export const TG_SODIUM_FACTOR = 0.002;

/** Conventional TG mmol/L → mg/dL. */
export const TG_MMOL_TO_MGDL = 88.57;

export const SOURCE_NOTE =
  'Educational: ΔNa (mEq/L) = triglycerides (mg/dL) × 0.002; corrected Na = measured Na + ΔNa (Merck Manual teaching form for indirect ISE volume displacement).';

export const DISCLAIMER =
  'Educational only — not a lab report or treatment order. Intended for indirect ion-selective electrode context; direct ISE/osmometry are largely unaffected. Do not start sodium administration from this estimate alone.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function triglyceridesToMgPerDl(
  value: number,
  unit: TriglycerideUnit,
): number {
  return unit === 'mg/dL' ? value : value * TG_MMOL_TO_MGDL;
}

export function mgPerDlToTriglycerides(
  mgPerDl: number,
  unit: TriglycerideUnit,
): number {
  return unit === 'mg/dL' ? mgPerDl : mgPerDl / TG_MMOL_TO_MGDL;
}

export function sodiumChangeFromTriglyceridesMgPerDl(
  triglyceridesMgPerDl: number,
): number {
  return triglyceridesMgPerDl * TG_SODIUM_FACTOR;
}

export function formatNa(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return String(rounded);
}

function emptyResult(partial?: Partial<SodiumChangeResult>): SodiumChangeResult {
  return {
    measuredSodium: null,
    triglyceridesMgPerDl: null,
    sodiumChange: null,
    correctedSodium: null,
    formattedChange: '',
    formattedCorrected: '',
    statusHeadline: 'Enter measured sodium and triglycerides.',
    statusDetail:
      'ΔNa uses triglycerides (mg/dL) × 0.002 for indirect ISE pseudohyponatremia teaching estimates.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateSodiumChange(
  input: SodiumChangeInput,
): SodiumChangeResult {
  const na = parseNumber(input.measuredSodiumText);
  const tgRaw = parseNumber(input.triglyceridesText);

  if (na === null || tgRaw === null) {
    return emptyResult();
  }

  if (!(tgRaw > 0)) {
    return emptyResult({
      statusHeadline: 'Triglycerides must be positive.',
      statusDetail: 'Nonpositive triglyceride values are rejected.',
    });
  }

  // Measured Na may be low (pseudo) but still must be finite; allow any finite value.
  if (!Number.isFinite(na)) {
    return emptyResult({
      statusHeadline: 'Measured sodium is invalid.',
      statusDetail: 'Enter a finite serum sodium in mEq/L.',
    });
  }

  const tgMgDl = triglyceridesToMgPerDl(tgRaw, input.triglycerideUnit);
  if (!(tgMgDl > 0) || !Number.isFinite(tgMgDl)) {
    return emptyResult({
      statusHeadline: 'Triglyceride conversion is invalid.',
      statusDetail: 'Check the selected triglyceride unit.',
    });
  }

  const change = sodiumChangeFromTriglyceridesMgPerDl(tgMgDl);
  const corrected = na + change;
  if (!Number.isFinite(change) || !Number.isFinite(corrected)) {
    return emptyResult({
      statusHeadline: 'Unable to compute sodium change.',
      statusDetail: 'Check that inputs are finite numbers.',
    });
  }

  return {
    measuredSodium: na,
    triglyceridesMgPerDl: tgMgDl,
    sodiumChange: change,
    correctedSodium: corrected,
    formattedChange: formatNa(change),
    formattedCorrected: formatNa(corrected),
    statusHeadline: 'Corrected sodium estimated.',
    statusDetail: `ΔNa ≈ ${formatNa(change)} mEq/L for TG ${formatNa(tgMgDl)} mg/dL (indirect ISE teaching factor).`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
