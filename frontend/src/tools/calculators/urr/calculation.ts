/**
 * Urea reduction ratio (URR) — educational hemodialysis adequacy worksheet (ADR-018).
 *
 * URR (%) = 100 × (pre − post) / pre
 * Pre and post must measure the same analyte; values are normalized to mg/dL urea
 * before the ratio (mmol/L urea × 6.006 → mg/dL).
 *
 * Classic teaching often cites URR ≥65% as a historical KDOQI-style single-pool
 * adequacy target for thrice-weekly HD — educational only, not a prescription.
 */

import type { UreaUnit, UrrInput, UrrResult } from './types';

/** 1 mmol/L urea ≈ 6.006 mg/dL (MW 60.06 g/mol). */
export const UREA_MMOL_L_TO_MG_DL = 6.006;

export const SOURCE_NOTE =
  'URR (%) = 100 × (pre-dialysis urea − post-dialysis urea) ÷ pre-dialysis urea after converting both readings to the same units (mmol/L urea × 6.006 → mg/dL). Same analyte required. Historical thrice-weekly HD teaching often cites URR ≥65% (KDOQI-style) — educational only.';

export const DISCLAIMER =
  'Educational worksheet only — not a dialysis prescription, Kt/V substitute, or adequacy diagnosis. Confirm units and clinical context with your care team.';

export const KTV_RELATED_SLUG = 'ktv-calculator-daugirdas';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function ureaToMgDl(value: number, unit: UreaUnit): number {
  if (unit === 'mmol_l') return value * UREA_MMOL_L_TO_MG_DL;
  return value;
}

/** Pure URR percent; pre must be > 0. */
export function computeUrrPercent(preMgDl: number, postMgDl: number): number {
  if (!(preMgDl > 0)) {
    throw new Error('Pre-dialysis urea must be positive to compute URR.');
  }
  if (!Number.isFinite(preMgDl) || !Number.isFinite(postMgDl)) {
    throw new Error('URR inputs must be finite.');
  }
  return (100 * (preMgDl - postMgDl)) / preMgDl;
}

export function formatUrr(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded)
        .replace(/(\.\d*?[1-9])0+$/, '$1')
        .replace(/\.0+$/, '');
}

export function calculateUrr(input: UrrInput): UrrResult {
  const empty: UrrResult = {
    preUreaMgDl: null,
    postUreaMgDl: null,
    urrPercent: null,
    formattedUrr: '',
    statusHeadline: 'Enter pre- and post-dialysis urea',
    statusDetail:
      'Enter matching pre- and post-dialysis urea (same analyte) to compute URR %.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const preRaw = parseNumber(input.preUreaText);
  const postRaw = parseNumber(input.postUreaText);

  if (preRaw === null || postRaw === null) {
    return empty;
  }

  const preMgDl = ureaToMgDl(preRaw, input.preUnit);
  const postMgDl = ureaToMgDl(postRaw, input.postUnit);

  if (!(preMgDl > 0)) {
    return {
      ...empty,
      preUreaMgDl: preMgDl,
      postUreaMgDl: postMgDl,
      statusHeadline: 'Pre-dialysis urea must be greater than zero',
      statusDetail:
        'URR divides by pre-dialysis urea. Enter a positive pre value in matching units.',
    };
  }

  const urrPercent = computeUrrPercent(preMgDl, postMgDl);
  const formattedUrr = formatUrr(urrPercent);

  let statusDetail =
    'URR is a single-pool urea reduction percentage for the measured session — not a full Kt/V model.';
  if (urrPercent >= 65) {
    statusDetail =
      'URR ≥65% matches a common historical thrice-weekly hemodialysis adequacy teaching target (KDOQI-style). Confirm with Kt/V and clinical context.';
  } else if (urrPercent >= 0) {
    statusDetail =
      'URR below the common ≥65% teaching target for thrice-weekly HD. Adequacy depends on schedule, residual kidney function, and Kt/V — educational only.';
  } else {
    statusDetail =
      'Negative URR means post-dialysis urea exceeds pre-dialysis urea — check sample timing, dilution, and units.';
  }

  return {
    preUreaMgDl: preMgDl,
    postUreaMgDl: postMgDl,
    urrPercent,
    formattedUrr,
    statusHeadline: 'Urea reduction ratio (URR)',
    statusDetail,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
