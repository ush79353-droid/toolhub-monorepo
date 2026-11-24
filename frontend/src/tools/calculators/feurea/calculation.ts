/**
 * FEUrea — fractional excretion of urea (ADR-018).
 *
 * FEUrea (%) = 100 × (urine urea × serum creatinine) ÷ (serum urea × urine creatinine)
 * with matched creatinine units and nitrogen/whole-urea normalized to urea mg/dL.
 *
 * Prompt fixture: urine/serum urea 120/20, creatinine 100/2 → 12%.
 * Classic Carvounis bands (≤35% / 35–50% / >50%) are educational only.
 */

import type {
  CreatinineUnit,
  FeureaInput,
  FeureaResult,
  UreaUnit,
} from './types';

export const SOURCE_NOTE =
  'FEUrea (%) = 100 × (urine urea × serum creatinine) ÷ (serum urea × urine creatinine). Match creatinine units; normalize BUN (urea nitrogen) vs whole urea across specimens before dividing. Classic ≤35% / 35–50% / >50% bands (Carvounis 2002 teaching) do not establish etiology alone.';

export const DISCLAIMER =
  'Educational worksheet only — not an AKI diagnosis or treatment plan. Confirm with clinical context, urine sediment, and laboratory units.';

/** µmol/L creatinine → mg/dL. */
export const CREATININE_UMOL_L_TO_MG_DL = 1 / 88.4;

/** BUN (urea nitrogen) mg/dL → urea mg/dL (MW 60.06 / 28.01 ≈ 2.14). */
export const BUN_MG_DL_TO_UREA_MG_DL = 2.14;

/** Urea mmol/L → urea mg/dL (MW ≈ 60.06). */
export const UREA_MMOL_L_TO_MG_DL = 6.006;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function creatinineToMgDl(
  value: number,
  unit: CreatinineUnit,
): number {
  if (unit === 'umol_l') return value * CREATININE_UMOL_L_TO_MG_DL;
  return value;
}

/** Normalize urea/BUN specimen to whole-urea mg/dL. */
export function ureaToMgDl(value: number, unit: UreaUnit): number {
  if (unit === 'mg_dl_bun') return value * BUN_MG_DL_TO_UREA_MG_DL;
  if (unit === 'mmol_l') return value * UREA_MMOL_L_TO_MG_DL;
  return value;
}

/** Pure FEUrea percent; rejects non-positive denominators. */
export function computeFeureaPercent(
  urineUreaMgDl: number,
  serumCreatinineMgDl: number,
  serumUreaMgDl: number,
  urineCreatinineMgDl: number,
): number {
  if (!(serumUreaMgDl > 0) || !(urineCreatinineMgDl > 0)) {
    throw new Error('Serum urea and urine creatinine must be positive.');
  }
  if (
    !Number.isFinite(urineUreaMgDl) ||
    !Number.isFinite(serumCreatinineMgDl) ||
    !Number.isFinite(serumUreaMgDl) ||
    !Number.isFinite(urineCreatinineMgDl)
  ) {
    throw new Error('FEUrea inputs must be finite.');
  }
  return (
    (100 * (urineUreaMgDl * serumCreatinineMgDl)) /
    (serumUreaMgDl * urineCreatinineMgDl)
  );
}

export function interpretFeureaBand(feureaPercent: number): {
  bandLabel: string;
  statusDetail: string;
} {
  if (feureaPercent <= 35) {
    return {
      bandLabel: '≤35%',
      statusDetail:
        'Classic Carvounis teaching often associates FEUrea ≤35% with a prerenal pattern (including some patients on diuretics) — educational only; does not establish etiology alone.',
    };
  }
  if (feureaPercent <= 50) {
    return {
      bandLabel: '35–50%',
      statusDetail:
        'FEUrea 35–50% is often treated as indeterminate. Cohort thresholds do not establish AKI etiology alone — use clinical context.',
    };
  }
  return {
    bandLabel: '>50%',
    statusDetail:
      'Classic teaching often associates FEUrea >50% with an intrinsic (e.g. ATN) pattern when context fits — still not a standalone diagnosis.',
  };
}

export function calculateFeurea(input: FeureaInput): FeureaResult {
  const empty: FeureaResult = {
    serumCreatinineMgDl: null,
    serumUreaMgDl: null,
    urineCreatinineMgDl: null,
    urineUreaMgDl: null,
    feureaPercent: null,
    bandLabel: null,
    statusHeadline: 'Enter serum and urine labs',
    statusDetail:
      'Enter serum creatinine, serum urea/BUN, urine creatinine, and urine urea. Defaults are mg/dL; normalize nitrogen vs whole urea across specimens.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const serumCreatinineRaw = parseNumber(input.serumCreatinineText);
  const serumUreaRaw = parseNumber(input.serumUreaText);
  const urineCreatinineRaw = parseNumber(input.urineCreatinineText);
  const urineUreaRaw = parseNumber(input.urineUreaText);

  if (
    serumCreatinineRaw === null ||
    serumUreaRaw === null ||
    urineCreatinineRaw === null ||
    urineUreaRaw === null
  ) {
    return empty;
  }

  if (
    serumCreatinineRaw < 0 ||
    serumUreaRaw < 0 ||
    urineCreatinineRaw < 0 ||
    urineUreaRaw < 0
  ) {
    return {
      ...empty,
      statusHeadline: 'Invalid values',
      statusDetail: 'All lab values must be non-negative.',
    };
  }

  const serumCreatinineMgDl = creatinineToMgDl(
    serumCreatinineRaw,
    input.serumCreatinineUnit,
  );
  const serumUreaMgDl = ureaToMgDl(serumUreaRaw, input.serumUreaUnit);
  const urineCreatinineMgDl = creatinineToMgDl(
    urineCreatinineRaw,
    input.urineCreatinineUnit,
  );
  const urineUreaMgDl = ureaToMgDl(urineUreaRaw, input.urineUreaUnit);

  if (!(serumUreaMgDl > 0) || !(urineCreatinineMgDl > 0)) {
    return {
      serumCreatinineMgDl,
      serumUreaMgDl,
      urineCreatinineMgDl,
      urineUreaMgDl,
      feureaPercent: null,
      bandLabel: null,
      statusHeadline: 'FEUrea undefined',
      statusDetail:
        'Serum urea and urine creatinine must be greater than zero (denominator).',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  const raw = computeFeureaPercent(
    urineUreaMgDl,
    serumCreatinineMgDl,
    serumUreaMgDl,
    urineCreatinineMgDl,
  );
  const feureaPercent = Math.round(raw * 100) / 100;
  const { bandLabel, statusDetail } = interpretFeureaBand(feureaPercent);

  return {
    serumCreatinineMgDl,
    serumUreaMgDl,
    urineCreatinineMgDl,
    urineUreaMgDl,
    feureaPercent,
    bandLabel,
    statusHeadline: `FEUrea ${formatFeurea(feureaPercent)}%`,
    statusDetail,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function formatFeurea(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}
