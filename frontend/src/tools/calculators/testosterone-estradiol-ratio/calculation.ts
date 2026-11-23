/**
 * Testosterone to Estradiol (T/E2) mixed-unit numerical index.
 *
 * Customary reporting index (as in many online T/E2 tools): convert
 * testosterone to ng/dL and estradiol to pg/mL, then divide the displayed
 * concentration numbers:
 *   T/E2 = T(ng/dL) ÷ E2(pg/mL)
 * Fixture: 500 ng/dL and 25 pg/mL → 20.
 *
 * This is NOT a same-mass-unit ratio. If both were normalized to ng/mL first,
 * 500 ng/dL (= 5 ng/mL) and 25 pg/mL (= 0.025 ng/mL) would yield 200.
 *
 * SI factors (testosterone MW ~288.4; estradiol MW ~272.4 — lab tables):
 *   testosterone: 1 ng/mL = 3.467 nmol/L (1 nmol/L ≈ 28.842 ng/dL)
 *   estradiol: 1 pg/mL = 3.6713 pmol/L
 *
 * Educational arithmetic only — not a diagnosis or treatment guide.
 */

import type {
  EstradiolUnit,
  Te2Input,
  Te2Result,
  TestosteroneUnit,
} from './types';

/** nmol/L per ng/mL testosterone. */
export const TESTOSTERONE_NMOL_PER_NG_ML = 3.467;

/** ng/dL per nmol/L testosterone. */
export const TESTOSTERONE_NG_DL_PER_NMOL_L = 100 / TESTOSTERONE_NMOL_PER_NG_ML;

/** pmol/L per pg/mL estradiol. */
export const ESTRADIOL_PMOL_PER_PG_ML = 3.6713;

export const SOURCE_CITATION =
  'Mixed-unit T/E2 index: T(ng/dL) ÷ E2(pg/mL) after unit conversion to those display units. SI: 1 ng/mL testosterone = 3.467 nmol/L; 1 pg/mL estradiol = 3.6713 pmol/L.';

export const MIXED_UNIT_NOTE =
  'Uses the customary mixed-unit index T(ng/dL)÷E2(pg/mL), not a same-mass-unit ratio (which would differ, e.g. 200 vs 20 for 500 ng/dL and 25 pg/mL).';

export const DISCLAIMER =
  'Educational T/E2 index only. It does not interpret lab panels, aromatization, or hormone therapy and is not medical advice.';

export function parseConcentration(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return null;
  if (/infinity|nan/i.test(cleaned)) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;
  return n;
}

/** Canonical testosterone for the mixed-unit index: ng/dL. */
export function testosteroneToNgDl(
  value: number,
  unit: TestosteroneUnit
): number | null {
  if (!Number.isFinite(value)) return null;
  switch (unit) {
    case 'ng_dl':
      return value;
    case 'ng_ml':
      return value * 100;
    case 'nmol_l':
      return value * TESTOSTERONE_NG_DL_PER_NMOL_L;
    default:
      return null;
  }
}

/** Canonical estradiol for the mixed-unit index: pg/mL. */
export function estradiolToPgMl(
  value: number,
  unit: EstradiolUnit
): number | null {
  if (!Number.isFinite(value)) return null;
  switch (unit) {
    case 'pg_ml':
      return value;
    case 'ng_ml':
      return value * 1000;
    case 'pmol_l':
      return value / ESTRADIOL_PMOL_PER_PG_ML;
    default:
      return null;
  }
}

export function ngDlToTestosteroneUnit(
  ngDl: number,
  unit: TestosteroneUnit
): number {
  switch (unit) {
    case 'ng_dl':
      return ngDl;
    case 'ng_ml':
      return ngDl / 100;
    case 'nmol_l':
      return ngDl / TESTOSTERONE_NG_DL_PER_NMOL_L;
  }
}

export function pgMlToEstradiolUnit(pgMl: number, unit: EstradiolUnit): number {
  switch (unit) {
    case 'pg_ml':
      return pgMl;
    case 'ng_ml':
      return pgMl / 1000;
    case 'pmol_l':
      return pgMl * ESTRADIOL_PMOL_PER_PG_ML;
  }
}

export function formatRatio(ratio: number): string {
  if (!Number.isFinite(ratio)) return '';
  const fixed = ratio.toFixed(4);
  return fixed.replace(/\.?0+$/, '');
}

export function formatFieldValue(value: number, digits = 6): string {
  if (!Number.isFinite(value)) return '';
  const fixed = value.toFixed(digits);
  return fixed.replace(/\.?0+$/, '');
}

export function calculateTe2Ratio(input: Te2Input): Te2Result | null {
  const tRaw = parseConcentration(input.testosterone);
  const eRaw = parseConcentration(input.estradiol);
  if (tRaw == null || eRaw == null) return null;
  if (!(tRaw >= 0) || !(eRaw > 0)) return null;

  const tNgDl = testosteroneToNgDl(tRaw, input.testosteroneUnit);
  const ePg = estradiolToPgMl(eRaw, input.estradiolUnit);
  if (tNgDl == null || ePg == null) return null;
  if (!(ePg > 0)) return null;

  const ratio = tNgDl / ePg;
  if (!Number.isFinite(ratio)) return null;

  return { ratio, formattedRatio: formatRatio(ratio) };
}

/** Same-mass ng/mL ratio for tests / documentation contrast (not used in UI result). */
export function sameMassNgMlRatio(tNgDl: number, ePgMl: number): number {
  const tNgMl = tNgDl / 100;
  const eNgMl = ePgMl / 1000;
  return tNgMl / eNgMl;
}