/**
 * Serum anion gap — educational (ADR-018).
 *
 * Standard (screenshot primary result; K never included):
 *   AG = Na − (Cl + HCO₃)   [mEq/L ≡ mmol/L for these monovalent ions]
 *
 * Correction panel (optional K + albumin):
 *   AG_K = (Na + K) − (Cl + HCO₃)
 *   Corrected AG (Figge et al., Crit Care Med 1998 teaching form):
 *     cAG = AG_K + 2.5 × (4.0 − albumin_g/dL)
 *
 * K defaults to 0 so AG_K equals AG until K is entered. Albumin correction
 * appears only when albumin is provided. Main AG is never affected by K.
 */

import type { AnionGapInput, AnionGapResult } from './types';

export const SOURCE_NOTE =
  'AG = Na − (Cl + HCO₃). Panel AG_K = (Na + K) − (Cl + HCO₃). Albumin-corrected cAG = AG_K + 2.5 × (4.0 − albumin g/dL) (Figge et al. 1998 factor). Main AG never includes K. Educational only.';

export const DISCLAIMER =
  'Not a laboratory report or acid–base diagnosis — interpret with clinical context and local reference ranges.';

/** Figge teaching normal albumin (g/dL). */
export const NORMAL_ALBUMIN_G_DL = 4.0;
/** mEq/L per g/dL albumin (Figge ≈ 2.5). */
export const ALBUMIN_CORRECTION_FACTOR = 2.5;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function anionGapWithoutK(
  sodium: number,
  chloride: number,
  bicarbonate: number,
): number {
  return sodium - (chloride + bicarbonate);
}

export function anionGapWithK(
  sodium: number,
  potassium: number,
  chloride: number,
  bicarbonate: number,
): number {
  return sodium + potassium - (chloride + bicarbonate);
}

export function albuminCorrectedAnionGap(
  gapWithK: number,
  albuminGdl: number,
): number {
  return (
    gapWithK + ALBUMIN_CORRECTION_FACTOR * (NORMAL_ALBUMIN_G_DL - albuminGdl)
  );
}

export function formatGap(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return rounded.toFixed(1);
}

function emptyResult(partial?: Partial<AnionGapResult>): AnionGapResult {
  return {
    anionGap: null,
    anionGapWithK: null,
    correctedAnionGap: null,
    formattedAnionGap: '',
    formattedCorrected: '',
    statusHeadline: 'Enter Na⁺, Cl⁻, and HCO₃⁻.',
    statusDetail:
      'Optional K⁺ and albumin in the correction panel compute AG including potassium and Figge albumin-corrected AG.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateAnionGap(input: AnionGapInput): AnionGapResult {
  const na = parseNumber(input.sodiumText);
  const cl = parseNumber(input.chlorideText);
  const hco3 = parseNumber(input.bicarbonateText);
  const kRaw = input.potassiumText.trim() === '' ? 0 : parseNumber(input.potassiumText);
  const alb = parseNumber(input.albuminText);

  if (na === null || cl === null || hco3 === null) {
    return emptyResult();
  }

  if (kRaw === null) {
    return emptyResult({
      statusHeadline: 'Potassium value is invalid.',
      statusDetail: 'Enter a finite K⁺ (mEq/L) or leave the default 0.',
    });
  }

  const ag = anionGapWithoutK(na, cl, hco3);
  const agk = anionGapWithK(na, kRaw, cl, hco3);

  if (!Number.isFinite(ag) || !Number.isFinite(agk)) {
    return emptyResult({
      statusHeadline: 'Unable to compute anion gap.',
      statusDetail: 'Check that electrolytes are finite numbers.',
    });
  }

  const base: AnionGapResult = {
    anionGap: ag,
    anionGapWithK: agk,
    correctedAnionGap: null,
    formattedAnionGap: formatGap(ag),
    formattedCorrected: '',
    statusHeadline: 'Anion gap computed.',
    statusDetail:
      alb === null
        ? 'Enter albumin (g/dL) to apply the Figge correction. K⁺ affects only the corrected panel path, not the primary AG.'
        : 'Primary AG excludes K⁺. Corrected AG uses AG_K plus the albumin term.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  if (alb === null) {
    return base;
  }

  if (alb < 0) {
    return {
      ...base,
      statusHeadline: 'Albumin must be non-negative.',
      statusDetail: 'Corrected anion gap withheld.',
    };
  }

  const corrected = albuminCorrectedAnionGap(agk, alb);
  return {
    ...base,
    correctedAnionGap: corrected,
    formattedCorrected: formatGap(corrected),
    statusHeadline: 'Anion gap and albumin-corrected AG computed.',
    statusDetail: `cAG = AG_K + ${ALBUMIN_CORRECTION_FACTOR} × (${NORMAL_ALBUMIN_G_DL} − albumin). Primary AG remains Na − (Cl + HCO₃).`,
  };
}
