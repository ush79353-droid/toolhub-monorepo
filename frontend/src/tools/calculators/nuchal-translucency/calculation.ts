/**
 * Nuchal translucency — educational first-trimester NT centiles.
 * componentKey: NuchalTranslucencyCalculator
 *
 * CRL ↔ GA: Robinson–Fleming (imported from crown-rump-length).
 * Expected NT (median): Chung JH et al. J Korean Med Sci 2004 — 0.437 + 0.01969×CRL_mm.
 * Centile bands: Omni-published CRL table (linear interpolation), clamped 45–80 mm.
 */

import {
  ROBINSON_INTERCEPT,
  ROBINSON_SQRT_COEFF,
  gestationalAgeDaysFromCrlMm,
  splitGestationalAge,
} from '../crown-rump-length/calculation';
import type {
  NtChartCurve,
  NuchalTranslucencyAssess,
  NuchalTranslucencyEstimate,
  NuchalTranslucencyInput,
  NuchalTranslucencyResult,
} from './types';

export {
  gestationalAgeDaysFromCrlMm,
  splitGestationalAge,
  ROBINSON_SQRT_COEFF,
  ROBINSON_INTERCEPT,
} from '../crown-rump-length/calculation';

export const CHUNG_INTERCEPT = 0.437;
export const CHUNG_SLOPE = 0.01969;

export const NT_TABLE_CRL_MIN = 45;
export const NT_TABLE_CRL_MAX = 80;
/** Educational NT scan CRL window (mm). */
export const NT_ASSESS_CRL_MIN = 45;
export const NT_ASSESS_CRL_MAX = 84;

export const CHART_GA_MIN = 75;
export const CHART_GA_MAX = 100;

export const DISCLAIMER =
  'Educational NT centile reference only. It does not screen for chromosomal conditions, diagnose fetal anomaly, or replace MFM/genetic counseling.';

export const SOURCE_EXPECTED_NT =
  'Chung JH et al. Correlation between fetal nuchal translucency and crown-rump length. J Korean Med Sci. 2004;19(1):50–53 (median NT ≈ 0.437 + 0.01969×CRL mm).';

export const SOURCE_CENTILES =
  'Educational NT centile knots by CRL (mm), linearly interpolated between published reference anchors (5th–95th).';

const CRL_KNOTS = [45, 50, 55, 60, 65, 70, 75, 80] as const;

const CENTILE_TABLE: Record<5 | 25 | 50 | 75 | 95, readonly number[]> = {
  5: [0.7, 0.8, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15],
  25: [0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2, 1.25],
  50: [1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.65],
  75: [1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8],
  95: [1.8, 1.9, 2.0, 2.05, 2.15, 2.2, 2.3, 2.35],
};

const CENTILE_RANKS = [5, 25, 50, 75, 95] as const;

/**
 * Inverse Robinson–Fleming (continuous, unrounded):
 * CRL_mm = ((GA_days − 23.73) / 8.052)²
 */
export function crlMmFromGestationalAgeDays(gaDays: number): number | null {
  if (!Number.isFinite(gaDays)) return null;
  const inner = (gaDays - ROBINSON_INTERCEPT) / ROBINSON_SQRT_COEFF;
  if (inner < 0) return null;
  const crl = inner * inner;
  if (!Number.isFinite(crl) || crl <= 0) return null;
  return crl;
}

export function expectedNtMmFromCrl(crlMm: number): number | null {
  if (!Number.isFinite(crlMm) || crlMm <= 0) return null;
  const nt = CHUNG_INTERCEPT + CHUNG_SLOPE * crlMm;
  if (!Number.isFinite(nt)) return null;
  return Math.round(nt * 100) / 100;
}

function clampCrlForTable(crlMm: number): number {
  return Math.min(NT_TABLE_CRL_MAX, Math.max(NT_TABLE_CRL_MIN, crlMm));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function interpolateAtCrl(crlMm: number, knots: readonly number[]): number {
  const clamped = clampCrlForTable(crlMm);
  if (clamped <= CRL_KNOTS[0]) return knots[0];
  if (clamped >= CRL_KNOTS[CRL_KNOTS.length - 1]) return knots[knots.length - 1];
  for (let i = 0; i < CRL_KNOTS.length - 1; i++) {
    const c0 = CRL_KNOTS[i];
    const c1 = CRL_KNOTS[i + 1];
    if (clamped >= c0 && clamped <= c1) {
      const t = (clamped - c0) / (c1 - c0);
      return lerp(knots[i], knots[i + 1], t);
    }
  }
  return knots[knots.length - 1];
}

export function centileNtAtCrl(
  crlMm: number,
  centile: 5 | 25 | 50 | 75 | 95,
): number {
  return interpolateAtCrl(crlMm, CENTILE_TABLE[centile]);
}

export interface CentileSnapshot {
  p5: number;
  p25: number;
  p50: number;
  p75: number;
  p95: number;
}

export function centileSnapshotAtCrl(crlMm: number): CentileSnapshot {
  return {
    p5: centileNtAtCrl(crlMm, 5),
    p25: centileNtAtCrl(crlMm, 25),
    p50: centileNtAtCrl(crlMm, 50),
    p75: centileNtAtCrl(crlMm, 75),
    p95: centileNtAtCrl(crlMm, 95),
  };
}

/**
 * Piecewise-linear percentile rank from measured NT vs centile bands at CRL.
 */
export function percentileFromNtAtCrl(
  measuredNtMm: number,
  crlMm: number,
): number {
  const bands: { rank: number; nt: number }[] = CENTILE_RANKS.map((rank) => ({
    rank,
    nt: centileNtAtCrl(crlMm, rank),
  }));

  if (measuredNtMm <= bands[0].nt) {
    const span = bands[1].nt - bands[0].nt || 1;
    const t = (measuredNtMm - bands[0].nt) / span;
    return Math.max(0, bands[0].rank + t * (bands[1].rank - bands[0].rank));
  }
  for (let i = 0; i < bands.length - 1; i++) {
    const lo = bands[i];
    const hi = bands[i + 1];
    if (measuredNtMm >= lo.nt && measuredNtMm <= hi.nt) {
      const span = hi.nt - lo.nt || 1;
      const t = (measuredNtMm - lo.nt) / span;
      return lo.rank + t * (hi.rank - lo.rank);
    }
  }
  const last = bands[bands.length - 1];
  const prev = bands[bands.length - 2];
  const span = last.nt - prev.nt || 1;
  const t = (measuredNtMm - last.nt) / span;
  return Math.min(99.5, last.rank + t * 10);
}

export function buildNtChartCurves(): NtChartCurve[] {
  return CENTILE_RANKS.map((percentile) => ({
    percentile,
    points: CRL_KNOTS.map((crl, i) => {
      const ga = gestationalAgeDaysFromCrlMm(crl);
      return {
        gaDays: ga ?? 0,
        ntMm: CENTILE_TABLE[percentile][i],
      };
    }).filter((p) => p.gaDays > 0),
  }));
}

const CHART_CURVES = buildNtChartCurves();

function formatNt(mm: number): string {
  return mm.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false,
  });
}

function formatPercentile(p: number): string {
  const rounded = Math.round(p);
  const mod10 = rounded % 10;
  const mod100 = rounded % 100;
  let suffix = 'th';
  if (mod10 === 1 && mod100 !== 11) suffix = 'st';
  else if (mod10 === 2 && mod100 !== 12) suffix = 'nd';
  else if (mod10 === 3 && mod100 !== 13) suffix = 'rd';
  return `${rounded}${suffix}`;
}

export function resolveCrlForAssess(
  estimateCrlMm: number | null,
  assessGaDays: number,
): number | null {
  if (estimateCrlMm != null && estimateCrlMm >= NT_ASSESS_CRL_MIN) {
    return estimateCrlMm;
  }
  return crlMmFromGestationalAgeDays(assessGaDays);
}

export function calculateNuchalTranslucency(
  input: NuchalTranslucencyInput,
  parsed: {
    crlMm: number | null;
    estimateGaDays: number | null;
    measuredNtMm: number | null;
    assessGaDays: number | null;
  },
): NuchalTranslucencyResult {
  let estimate: NuchalTranslucencyEstimate | null = null;
  if (parsed.crlMm != null && parsed.estimateGaDays != null) {
    const expected = expectedNtMmFromCrl(parsed.crlMm);
    if (expected != null) {
      const { weeks, days } = splitGestationalAge(parsed.estimateGaDays);
      const gaFromCrl = gestationalAgeDaysFromCrlMm(parsed.crlMm);
      estimate = {
        crlMm: parsed.crlMm,
        gestationalAgeDays: parsed.estimateGaDays,
        weeks,
        daysRemainder: days,
        expectedNtMm: expected,
        formattedExpectedNt: formatNt(expected),
        gaNote:
          gaFromCrl != null && gaFromCrl !== parsed.estimateGaDays
            ? `Robinson–Fleming from CRL rounds to ${gaFromCrl} days (not alternate UI anchors such as 79 days for CRL 45 mm).`
            : parsed.crlMm === 45 && parsed.estimateGaDays === 78
              ? 'Some references show 79 days for CRL 45 mm; Robinson–Fleming rounds to 78 days.'
              : null,
      };
    }
  }

  let assess: NuchalTranslucencyAssess | null = null;
  if (
    parsed.measuredNtMm != null &&
    parsed.assessGaDays != null &&
    parsed.measuredNtMm > 0
  ) {
    const crlRaw = resolveCrlForAssess(parsed.crlMm, parsed.assessGaDays);
    if (crlRaw != null) {
      if (
        crlRaw < NT_ASSESS_CRL_MIN ||
        crlRaw > NT_ASSESS_CRL_MAX
      ) {
        assess = null;
      } else {
        const crlForTable = clampCrlForTable(crlRaw);
        const percentile = percentileFromNtAtCrl(
          parsed.measuredNtMm,
          crlForTable,
        );
        const snap = centileSnapshotAtCrl(crlForTable);
        const withinNormalRange = parsed.measuredNtMm < snap.p95;
        const label = formatPercentile(percentile);
        const percentileSentence = `Your nuchal translucency of ${formatNt(parsed.measuredNtMm)} mm is approximately the ${label} percentile (CRL reference ${crlForTable.toFixed(1)} mm, gestational age ${parsed.assessGaDays} days).`;
        const normalRangeNote = withinNormalRange
          ? 'Measured NT is below the interpolated 95th centile for this CRL — within normal range for this educational table.'
          : 'Measured NT is at or above the interpolated 95th centile for this CRL on this educational table — discuss with your prenatal care team; this is not a diagnosis.';

        assess = {
          measuredNtMm: parsed.measuredNtMm,
          crlMmForTable: crlForTable,
          gestationalAgeDays: parsed.assessGaDays,
          percentile,
          percentileSentence,
          withinNormalRange,
          normalRangeNote,
          chartCurves: CHART_CURVES,
          userPoint: {
            gaDays: parsed.assessGaDays,
            ntMm: parsed.measuredNtMm,
          },
          accessibleChartSummary: `NT ${formatNt(parsed.measuredNtMm)} mm at ${parsed.assessGaDays} days gestational age, about the ${label} percentile.`,
          disclaimer: DISCLAIMER,
        };
      }
    }
  }

  return { estimate, assess };
}

/** Apply CRL ↔ GA sync rules when editing fields (pure). */
export function syncFromEstimateCrl(crlMm: number): {
  estimateGaDays: string;
  assessGaDays?: string;
} {
  const ga = gestationalAgeDaysFromCrlMm(crlMm);
  const gaStr = ga != null ? String(ga) : '';
  return { estimateGaDays: gaStr, assessGaDays: gaStr };
}

export function syncFromEstimateGa(gaDays: number): {
  crlMm: string;
} {
  const crl = crlMmFromGestationalAgeDays(gaDays);
  if (crl == null) return { crlMm: '' };
  const rounded = Math.round(crl * 100) / 100;
  return { crlMm: String(rounded) };
}