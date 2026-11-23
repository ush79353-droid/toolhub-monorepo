/**
 * Progesterone to Estradiol (Pg/E2 or P/E2) ratio.
 *
 * Mass-normalized convention used in reproductive endocrinology reporting
 * (e.g. Younis et al., Fertil Steril 2011): both analytes in pg/mL, then
 * ratio = P(pg/mL) ÷ E2(pg/mL).
 *
 * Equivalent when P is entered in ng/mL and E2 in pg/mL:
 *   ratio = 1000 × P(ng/mL) / E2(pg/mL)
 * Fixture: 10 ng/mL and 100 pg/mL → 100.
 *
 * Unit factors (common clinical SI conversions; OmniCalculator / lab tables):
 *   progesterone: 1 ng/mL = 3.18 nmol/L
 *   estradiol: 1 pg/mL = 3.6713 pmol/L
 *
 * Educational arithmetic only — not a diagnosis or treatment guide.
 */

import type {
  EstradiolUnit,
  PgE2Input,
  PgE2Result,
  ProgesteroneUnit,
} from './types';

/** nmol/L per ng/mL for progesterone. */
export const PROGESTERONE_NMOL_PER_NG_ML = 3.18;

/** pmol/L per pg/mL for estradiol. */
export const ESTRADIOL_PMOL_PER_PG_ML = 3.6713;

export const SOURCE_CITATION =
  'Younis JS et al. Progesterone level and progesterone/estradiol ratio on the day of hCG administration. Fertil Steril. 2011. Mass ratio P(ng/mL)×1000/E2(pg/mL); SI factors 3.18 nmol/L per ng/mL (P) and 3.6713 pmol/L per pg/mL (E2).';

export const DISCLAIMER =
  'Educational Pg/E2 ratio only. It does not interpret cycle phase, IVF cutoffs, or hormone balance and is not medical advice.';

export function parseConcentration(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return null;
  if (/infinity|nan/i.test(cleaned)) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;
  return n;
}

/** Convert progesterone display value to pg/mL (canonical mass unit). */
export function progesteroneToPgMl(
  value: number,
  unit: ProgesteroneUnit
): number | null {
  if (!Number.isFinite(value)) return null;
  switch (unit) {
    case 'pg_ml':
      return value;
    case 'ng_ml':
      return value * 1000;
    case 'nmol_l':
      return (value / PROGESTERONE_NMOL_PER_NG_ML) * 1000;
    default:
      return null;
  }
}

/** Convert estradiol display value to pg/mL. */
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

export function pgMlToProgesteroneUnit(
  pgMl: number,
  unit: ProgesteroneUnit
): number {
  switch (unit) {
    case 'pg_ml':
      return pgMl;
    case 'ng_ml':
      return pgMl / 1000;
    case 'nmol_l':
      return (pgMl / 1000) * PROGESTERONE_NMOL_PER_NG_ML;
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

/** Trim trailing zeros after a stable decimal format. */
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

export function calculatePgE2Ratio(input: PgE2Input): PgE2Result | null {
  const pRaw = parseConcentration(input.progesterone);
  const eRaw = parseConcentration(input.estradiol);
  if (pRaw == null || eRaw == null) return null;
  if (!(pRaw >= 0) || !(eRaw > 0)) return null;

  const pPg = progesteroneToPgMl(pRaw, input.progesteroneUnit);
  const ePg = estradiolToPgMl(eRaw, input.estradiolUnit);
  if (pPg == null || ePg == null) return null;
  if (!(ePg > 0)) return null;

  const ratio = pPg / ePg;
  if (!Number.isFinite(ratio)) return null;

  return { ratio, formattedRatio: formatRatio(ratio) };
}
