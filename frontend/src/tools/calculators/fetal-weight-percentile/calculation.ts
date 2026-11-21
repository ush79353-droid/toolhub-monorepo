import {
  BAND_PERCENTILES,
  CHART_PERCENTILES,
  FMF_EFW_KNOTS,
  FMF_MAX_DAY,
  FMF_MIN_DAY,
  FMF_SOURCE,
  HADLOCK_SOURCE,
  type BandPercentile,
  type ChartPercentile,
  type FmfEfwKnot,
} from './datasets';
import type {
  FetalSex,
  FetalWeightPercentileResult,
  LengthUnit,
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

export function toCm(value: number, unit: LengthUnit): number {
  return unit === 'cm' ? value : value / 10;
}

export function fromCm(cm: number, unit: LengthUnit): number {
  return unit === 'cm' ? cm : cm * 10;
}

export function gramsToWeight(grams: number, unit: WeightUnit): number {
  if (unit === 'g') return grams;
  if (unit === 'kg') return grams / 1000;
  return grams / LB_TO_G;
}

export function weightToGrams(value: number, unit: WeightUnit): number {
  if (unit === 'g') return value;
  if (unit === 'kg') return value * 1000;
  return value * LB_TO_G;
}

/**
 * Hadlock 1985 four-parameter EFW (grams).
 * log10(EFW) = 1.3596 + 0.0064·HC + 0.0424·AC + 0.174·FL + 0.00061·BPD·AC − 0.00386·AC·FL
 * with HC, AC, FL, BPD in centimeters.
 */
export function hadlockEfwGrams(input: {
  hcCm: number;
  acCm: number;
  flCm: number;
  bpdCm: number;
}): number {
  const { hcCm: HC, acCm: AC, flCm: FL, bpdCm: BPD } = input;
  const log10Efw =
    1.3596 +
    0.0064 * HC +
    0.0424 * AC +
    0.174 * FL +
    0.00061 * BPD * AC -
    0.00386 * AC * FL;
  return 10 ** log10Efw;
}

function knotValue(knot: FmfEfwKnot, percentile: BandPercentile): number {
  switch (percentile) {
    case 3:
      return knot.p3;
    case 10:
      return knot.p10;
    case 25:
      return knot.p25;
    case 50:
      return knot.p50;
    case 75:
      return knot.p75;
    case 90:
      return knot.p90;
    case 97:
      return knot.p97;
    default: {
      const _e: never = percentile;
      return _e;
    }
  }
}

export function interpolateCentileGrams(
  gestationalDay: number,
  percentile: BandPercentile,
): number | null {
  if (!Number.isFinite(gestationalDay)) return null;
  if (gestationalDay < FMF_MIN_DAY || gestationalDay > FMF_MAX_DAY) return null;
  const knots = FMF_EFW_KNOTS;
  const first = knots[0]!;
  const last = knots[knots.length - 1]!;
  if (gestationalDay <= first.gestationalDay) return knotValue(first, percentile);
  if (gestationalDay >= last.gestationalDay) return knotValue(last, percentile);
  for (let i = 1; i < knots.length; i += 1) {
    const right = knots[i]!;
    const left = knots[i - 1]!;
    if (gestationalDay === right.gestationalDay) return knotValue(right, percentile);
    if (gestationalDay < right.gestationalDay) {
      const span = right.gestationalDay - left.gestationalDay;
      if (!(span > 0)) return knotValue(right, percentile);
      const t = (gestationalDay - left.gestationalDay) / span;
      return (
        knotValue(left, percentile) +
        t * (knotValue(right, percentile) - knotValue(left, percentile))
      );
    }
  }
  return knotValue(last, percentile);
}

export function thresholdsAtDay(
  gestationalDay: number,
): Record<BandPercentile, number> | null {
  const out = {} as Record<BandPercentile, number>;
  for (const p of BAND_PERCENTILES) {
    const g = interpolateCentileGrams(gestationalDay, p);
    if (g === null || !Number.isFinite(g)) return null;
    out[p] = g;
  }
  return out;
}

function ordinalLabel(n: number): string {
  if (n === 3) return '3rd';
  if (n === 97) return '97th';
  return `${n}th`;
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
        headline: `Your baby is in the ${ordinalLabel(p)} percentile.`,
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
      headline: `Your baby is below the ${ordinalLabel(first)} percentile.`,
    };
  }
  if (weightGrams > thresholds[last]) {
    return {
      bandKind: 'above',
      lowerPercentile: last,
      upperPercentile: null,
      exactPercentile: null,
      headline: `Your baby is above the ${ordinalLabel(last)} percentile.`,
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
        headline: `Your baby is between the ${ordinalLabel(lo)} and ${ordinalLabel(hi)} percentiles.`,
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

export function buildChartCurves(): FetalWeightPercentileResult['chartCurves'] {
  return CHART_PERCENTILES.map((percentile) => ({
    percentile: percentile as ChartPercentile,
    points: FMF_EFW_KNOTS.map((knot) => ({
      week: knot.gestationalDay / 7,
      grams: knotValue(knot, percentile),
    })),
  }));
}

const DISCLAIMER =
  'Informational ultrasound estimate only — not a diagnosis. Hadlock EFW and FMF centile charts can differ from the chart your clinic uses. Discuss results with a qualified clinician.';

export function calculateFetalWeightPercentile(input: {
  sex: FetalSex;
  weeks: number;
  hcCm: number;
  acCm: number;
  bpdCm: number;
  flCm: number;
  resultWeightUnit: WeightUnit;
}): FetalWeightPercentileResult | null {
  const { sex, weeks, hcCm, acCm, bpdCm, flCm, resultWeightUnit } = input;
  if (
    ![weeks, hcCm, acCm, bpdCm, flCm].every(
      (n) => Number.isFinite(n) && n > 0,
    )
  ) {
    return null;
  }
  if (!Number.isInteger(weeks) || weeks < 0) return null;

  const efwGrams = hadlockEfwGrams({ hcCm, acCm, flCm, bpdCm });
  if (!(efwGrams > 0) || !Number.isFinite(efwGrams)) return null;

  const gestationalDay = weeks * 7;
  const sexNote =
    sex === 'unknown'
      ? null
      : 'FMF Table 1 EFW centiles are unisex; Girl/Boy does not change the reference curves.';

  if (gestationalDay < FMF_MIN_DAY || gestationalDay > FMF_MAX_DAY) {
    return {
      sex,
      weeks,
      gestationalDay,
      efwGrams,
      efwDisplay: gramsToWeight(efwGrams, resultWeightUnit),
      resultWeightUnit,
      thresholdsGrams: {
        3: NaN,
        10: NaN,
        25: NaN,
        50: NaN,
        75: NaN,
        90: NaN,
        97: NaN,
      },
      chartCurves: buildChartCurves(),
      bandKind: 'unavailable',
      lowerPercentile: null,
      upperPercentile: null,
      exactPercentile: null,
      headline:
        'Gestational age outside the FMF EFW chart range (20+0 to 41+6). Estimated weight is still shown from Hadlock.',
      normalRange: false,
      normalRangeText:
        "Percentile comparison unavailable outside the published FMF gestational-age window.",
      accessibleChartSummary:
        'Estimated fetal weight available from Hadlock biometry, but gestational age is outside FMF EFW reference knots.',
      sourceNote: `${HADLOCK_SOURCE} ${FMF_SOURCE}`,
      disclaimer: DISCLAIMER,
      sexNote,
    };
  }

  const thresholds = thresholdsAtDay(gestationalDay);
  if (!thresholds) return null;
  const band = classifyBand(efwGrams, thresholds);
  const normalRange =
    efwGrams >= thresholds[10] && efwGrams <= thresholds[90];
  const normalRangeText = normalRange
    ? "Your baby's weight is within normal range."
    : "Your baby's weight is outside the 10th–90th percentile band on the FMF EFW chart.";

  const display =
    resultWeightUnit === 'g'
      ? Math.round(efwGrams * 100) / 100
      : gramsToWeight(efwGrams, resultWeightUnit);

  return {
    sex,
    weeks,
    gestationalDay,
    efwGrams,
    efwDisplay: display,
    resultWeightUnit,
    thresholdsGrams: thresholds,
    chartCurves: buildChartCurves(),
    ...band,
    normalRange,
    normalRangeText,
    accessibleChartSummary: [
      `Hadlock estimated fetal weight ${efwGrams.toFixed(2)} g at ${weeks} weeks.`,
      band.headline,
      normalRangeText,
      `FMF EFW thresholds (g): 3rd ${Math.round(thresholds[3])}, 10th ${Math.round(thresholds[10])}, 25th ${Math.round(thresholds[25])}, 50th ${Math.round(thresholds[50])}, 75th ${Math.round(thresholds[75])}, 90th ${Math.round(thresholds[90])}, 97th ${Math.round(thresholds[97])}.`,
    ].join(' '),
    sourceNote: `${HADLOCK_SOURCE} ${FMF_SOURCE}`,
    disclaimer: DISCLAIMER,
    sexNote,
  };
}

export function shareFetalWeightPercentileText(pageUrl: string): string {
  return `Fetal Weight Percentile Calculator — ${pageUrl}`;
}
