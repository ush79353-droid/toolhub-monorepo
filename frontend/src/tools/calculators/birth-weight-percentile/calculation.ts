import {
  BAND_PERCENTILES,
  CHART_PERCENTILES,
  FMF_BW_KNOTS,
  FMF_MAX_DAY,
  FMF_MIN_DAY,
  FMF_SOURCE,
  type BandPercentile,
  type ChartPercentile,
  type FmfBwKnot,
} from './datasets';
import type {
  BirthWeightPercentileResult,
  PercentileBandKind,
  WeightUnit,
} from './types';

const LB_TO_G = 453.59237;

export function parseOptionalNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (
    trimmed === '' ||
    trimmed === '-' ||
    trimmed === '.' ||
    trimmed === '-.'
  ) {
    return null;
  }
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

export function weightToGrams(value: number, unit: WeightUnit): number {
  if (unit === 'g') return value;
  if (unit === 'kg') return value * 1000;
  return value * LB_TO_G;
}

export function gramsToWeight(grams: number, unit: WeightUnit): number {
  if (unit === 'g') return grams;
  if (unit === 'kg') return grams / 1000;
  return grams / LB_TO_G;
}

export function gestationalDayFromParts(weeks: number, days: number): number {
  return weeks * 7 + days;
}

function knotValue(knot: FmfBwKnot, percentile: BandPercentile): number {
  switch (percentile) {
    case 5:
      return knot.p5;
    case 10:
      return knot.p10;
    case 25:
      return knot.p25;
    case 50:
      return knot.p50;
    case 75:
      return knot.p75;
    case 95:
      return knot.p95;
    default: {
      const _exhaustive: never = percentile;
      return _exhaustive;
    }
  }
}

/** Linear interpolation between published mid-week knots; no extrapolation past end knots. */
export function interpolateCentileGrams(
  gestationalDay: number,
  percentile: BandPercentile,
): number | null {
  if (!Number.isFinite(gestationalDay)) return null;

  const knots = FMF_BW_KNOTS;
  const first = knots[0]!;
  const last = knots[knots.length - 1]!;

  if (gestationalDay < FMF_MIN_DAY || gestationalDay > FMF_MAX_DAY) {
    return null;
  }

  // Day support at tails: hold first/last knot values for days before first / after last knot
  // within the published 20+0–41+6 window (prompt: validate day 0/6 and source knots).
  if (gestationalDay <= first.gestationalDay) {
    return knotValue(first, percentile);
  }
  if (gestationalDay >= last.gestationalDay) {
    return knotValue(last, percentile);
  }

  for (let i = 1; i < knots.length; i += 1) {
    const right = knots[i]!;
    const left = knots[i - 1]!;
    if (gestationalDay === right.gestationalDay) {
      return knotValue(right, percentile);
    }
    if (gestationalDay < right.gestationalDay) {
      const span = right.gestationalDay - left.gestationalDay;
      if (!(span > 0)) return knotValue(right, percentile);
      const t = (gestationalDay - left.gestationalDay) / span;
      const a = knotValue(left, percentile);
      const b = knotValue(right, percentile);
      return a + t * (b - a);
    }
  }
  return knotValue(last, percentile);
}

export function thresholdsAtDay(
  gestationalDay: number,
): Record<BandPercentile, number> | null {
  const out = {} as Record<BandPercentile, number>;
  for (const p of BAND_PERCENTILES) {
    const grams = interpolateCentileGrams(gestationalDay, p);
    if (grams === null || !Number.isFinite(grams)) return null;
    out[p] = grams;
  }
  return out;
}

function ordinal(n: number): string {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

const EXACT_TOLERANCE_G = 0.5;

export function classifyBand(
  weightGrams: number,
  thresholds: Record<BandPercentile, number>,
): {
  bandKind: PercentileBandKind;
  lowerPercentile: BandPercentile | null;
  upperPercentile: BandPercentile | null;
  exactPercentile: BandPercentile | null;
  headline: string;
} {
  for (const p of BAND_PERCENTILES) {
    if (Math.abs(weightGrams - thresholds[p]) <= EXACT_TOLERANCE_G) {
      return {
        bandKind: 'at',
        lowerPercentile: null,
        upperPercentile: null,
        exactPercentile: p,
        headline: `At the ${ordinal(p)} percentile.`,
      };
    }
  }

  const first = BAND_PERCENTILES[0]!;
  const last = BAND_PERCENTILES[BAND_PERCENTILES.length - 1]!;
  if (weightGrams < thresholds[first]) {
    return {
      bandKind: 'below',
      lowerPercentile: null,
      upperPercentile: first,
      exactPercentile: null,
      headline: `Below the ${ordinal(first)} percentile.`,
    };
  }
  if (weightGrams > thresholds[last]) {
    return {
      bandKind: 'above',
      lowerPercentile: last,
      upperPercentile: null,
      exactPercentile: null,
      headline: `Above the ${ordinal(last)} percentile.`,
    };
  }

  for (let i = 0; i < BAND_PERCENTILES.length - 1; i += 1) {
    const lo = BAND_PERCENTILES[i]!;
    const hi = BAND_PERCENTILES[i + 1]!;
    if (weightGrams > thresholds[lo] && weightGrams < thresholds[hi]) {
      return {
        bandKind: 'between',
        lowerPercentile: lo,
        upperPercentile: hi,
        exactPercentile: null,
        headline: `Between ${ordinal(lo)} and ${ordinal(hi)} percentile.`,
      };
    }
  }

  return {
    bandKind: 'unavailable',
    lowerPercentile: null,
    upperPercentile: null,
    exactPercentile: null,
    headline: 'Percentile band unavailable.',
  };
}

export function buildChartCurves(): BirthWeightPercentileResult['chartCurves'] {
  return CHART_PERCENTILES.map((percentile) => {
    const points: { week: number; grams: number }[] = [];
    for (const knot of FMF_BW_KNOTS) {
      const week = knot.gestationalDay / 7;
      points.push({
        week,
        grams: knotValue(knot, percentile as BandPercentile),
      });
    }
    return { percentile: percentile as ChartPercentile, points };
  });
}

const DISCLAIMER =
  'Informational estimate only — not a diagnosis or growth assessment. Hospitals may use different charts (for example INTERGROWTH-21st or Fenton). Discuss results with a qualified clinician.';

export function calculateBirthWeightPercentile(input: {
  weeks: number;
  days: number;
  weightGrams: number;
  weightUnit: WeightUnit;
}): BirthWeightPercentileResult | null {
  const { weeks, days, weightGrams, weightUnit } = input;
  if (
    !Number.isFinite(weeks) ||
    !Number.isFinite(days) ||
    !Number.isFinite(weightGrams)
  ) {
    return null;
  }
  if (!Number.isInteger(weeks) || !Number.isInteger(days)) return null;
  if (weeks < 0 || days < 0 || days > 6) return null;
  if (!(weightGrams > 0) || !Number.isFinite(weightGrams)) return null;

  const gestationalDay = gestationalDayFromParts(weeks, days);
  if (gestationalDay < FMF_MIN_DAY || gestationalDay > FMF_MAX_DAY) {
    return {
      gestationalDay,
      weeks,
      days,
      weightGrams,
      weightUnit,
      thresholdsGrams: {
        5: NaN,
        10: NaN,
        25: NaN,
        50: NaN,
        75: NaN,
        95: NaN,
      },
      chartCurves: buildChartCurves(),
      bandKind: 'unavailable',
      lowerPercentile: null,
      upperPercentile: null,
      exactPercentile: null,
      headline: 'Gestational age outside the FMF birth-weight chart (20+0 to 41+6).',
      accessibleChartSummary:
        'No percentile band: gestational age is outside the published FMF birth-weight reference range of 20 weeks 0 days through 41 weeks 6 days.',
      sourceNote: FMF_SOURCE,
      disclaimer: DISCLAIMER,
    };
  }

  const thresholds = thresholdsAtDay(gestationalDay);
  if (!thresholds) return null;

  const band = classifyBand(weightGrams, thresholds);
  const gaLabel = `${weeks} weeks ${days} day${days === 1 ? '' : 's'}`;
  const weightLabel = `${Math.round(weightGrams).toLocaleString('en-US')} g`;
  const accessibleChartSummary = [
    `Birth weight ${weightLabel} at ${gaLabel}.`,
    band.headline,
    `Reference thresholds (g): 5th ${Math.round(thresholds[5])}, 10th ${Math.round(thresholds[10])}, 25th ${Math.round(thresholds[25])}, 50th ${Math.round(thresholds[50])}, 75th ${Math.round(thresholds[75])}, 95th ${Math.round(thresholds[95])}.`,
    'Chart shows FMF birth-weight centile curves for the 5th, 10th, 50th, 75th, and 95th percentiles versus gestational age, with a horizontal marker at the entered weight.',
  ].join(' ');

  return {
    gestationalDay,
    weeks,
    days,
    weightGrams,
    weightUnit,
    thresholdsGrams: thresholds,
    chartCurves: buildChartCurves(),
    ...band,
    accessibleChartSummary,
    sourceNote: FMF_SOURCE,
    disclaimer: DISCLAIMER,
  };
}

/** Share text uses the public tool URL only — no clinical values (medical privacy). */
export function shareBirthWeightPercentileText(pageUrl: string): string {
  return `Birth Weight Percentile Calculator — ${pageUrl}`;
}
