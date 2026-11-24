/**
 * Urine albumin-to-creatinine ratio (ACR / UACR) — educational (ADR-018).
 *
 * NIDDK / Omni:
 *   ACR (mg/g) = urine albumin (mg/dL) ÷ urine creatinine (g/dL)
 *              = albumin_mg_dL ÷ (creatinine_mg_dL / 1000)
 *
 * Creatinine mmol/L → mg/dL: × 11.3 (Omni ACR calculator).
 *
 * KDIGO albuminuria bands (mg/g): A1 <30, A2 30–300, A3 >300.
 */

import type {
  AcrCategory,
  AlbuminCreatinineRatioInput,
  AlbuminCreatinineRatioResult,
  CreatinineUnit,
} from './types';

export const SOURCE_NOTE =
  'ACR (mg/g) = urine albumin (mg/dL) ÷ urine creatinine (g/dL). Creatinine mmol/L × 11.3 → mg/dL. KDIGO A1 <30, A2 30–300, A3 >300 mg/g. Educational only.';

export const DISCLAIMER =
  'Not a laboratory report, CKD diagnosis, or treatment plan — confirm with your clinician and clinical lab.';

/** Omni ACR: 1 mmol/L creatinine ≈ 11.3 mg/dL. */
export const CREATININE_MMOL_L_TO_MG_DL = 11.3;

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
  if (unit === 'mmol_l') return value * CREATININE_MMOL_L_TO_MG_DL;
  return value;
}

/**
 * ACR in mg albumin per g creatinine.
 * Equivalent: albumin_mg_dL / (creatinine_mg_dL / 1000).
 */
export function acrMgPerG(
  albuminMgDl: number,
  creatinineMgDl: number,
): number {
  if (!(creatinineMgDl > 0)) {
    throw new Error('Creatinine must be positive to compute ACR.');
  }
  const creatinineGDl = creatinineMgDl / 1000;
  return albuminMgDl / creatinineGDl;
}

export function categorizeAcr(acrMgPerGValue: number): AcrCategory {
  if (acrMgPerGValue < 30) return 'A1';
  if (acrMgPerGValue <= 300) return 'A2';
  return 'A3';
}

export function categoryLabel(category: AcrCategory): string {
  switch (category) {
    case 'A1':
      return 'A1 — normal to mildly increased (<30 mg/g)';
    case 'A2':
      return 'A2 — moderately increased (30–300 mg/g)';
    case 'A3':
      return 'A3 — severely increased (>300 mg/g)';
  }
}

export function calculateAlbuminCreatinineRatio(
  input: AlbuminCreatinineRatioInput,
): AlbuminCreatinineRatioResult {
  const empty = {
    albuminMgDl: null,
    creatinineMgDl: null,
    acrMgPerG: null,
    category: null,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const albumin = parseNumber(input.albuminText);
  const creatinineRaw = parseNumber(input.creatinineText);

  if (albumin === null || creatinineRaw === null) {
    return {
      ...empty,
      statusHeadline: 'Enter albumin and creatinine',
      statusDetail:
        'Enter urine albumin (mg/dL) and urine creatinine to compute ACR in mg/g.',
    };
  }

  if (!(albumin >= 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid albumin',
      statusDetail: 'Albumin must be non-negative.',
    };
  }

  if (!(creatinineRaw > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid creatinine',
      statusDetail: 'Creatinine must be greater than zero.',
    };
  }

  const creatinineMgDl = creatinineToMgDl(
    creatinineRaw,
    input.creatinineUnit,
  );
  const acr = acrMgPerG(albumin, creatinineMgDl);
  const rounded = Math.round(acr * 10) / 10;
  const category = categorizeAcr(rounded);

  return {
    albuminMgDl: albumin,
    creatinineMgDl,
    acrMgPerG: rounded,
    category,
    statusHeadline: 'Albumin : creatinine ratio',
    statusDetail: `ACR = ${formatAcr(rounded)} mg/g (${categoryLabel(category)}).`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function formatAcr(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}
