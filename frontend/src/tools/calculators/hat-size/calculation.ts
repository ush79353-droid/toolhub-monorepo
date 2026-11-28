/**
 * Hat size lookup — cm internally; chart is authoritative over π approximations.
 */

import {
  ADULT_HAT_CHART,
  CHART_SOURCE,
  CHILD_HAT_CHART,
  getAdultHatChart,
  getChildHatChart,
} from './chart-data';
import type {
  AdultHatChartRow,
  ChildHatChartRow,
  HatCategory,
  HatFitPreference,
  HatLengthUnit,
  HatSizeResult,
} from './types';
import { CATEGORY_LABELS, FIT_LABELS } from './types';

export const CM_PER_IN = 2.54;
export const EXACT_CM_TOLERANCE = 0.05;

export function convertCmToInches(cm: number): number {
  return cm / CM_PER_IN;
}

export function convertInchesToCm(inches: number): number {
  return inches * CM_PER_IN;
}

export function convertLengthToCm(
  value: number,
  unit: HatLengthUnit,
): number {
  return unit === 'cm' ? value : convertInchesToCm(value);
}

export function convertLengthFromCm(
  cm: number,
  unit: HatLengthUnit,
): number {
  return unit === 'cm' ? cm : convertCmToInches(cm);
}

export function normalizeHeadCircumference(
  value: number,
  unit: HatLengthUnit,
): number {
  return convertLengthToCm(value, unit);
}

export function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  const rounded = Number(n.toFixed(digits));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return String(rounded);
}

export function formatLength(cm: number, unit: HatLengthUnit, digits = 2): string {
  return `${fmt(convertLengthFromCm(cm, unit), digits)} ${unit}`;
}

/** Geometric US approximation (illustrative only — not used for retail result). */
export function approximateUSFromCircumferenceIn(inches: number): number {
  return inches / Math.PI;
}

/** Geometric UK ≈ US − ⅛ (illustrative only). */
export function approximateUKFromUS(us: number): number {
  return us - 1 / 8;
}

/**
 * Format a decimal hat size as Unicode fractions (⅛ steps).
 * Input is already a chart string for retail results; this helps demos/tests.
 */
export function formatFractionalHatSize(value: number): string {
  if (!Number.isFinite(value)) return '—';
  const whole = Math.floor(value + 1e-9);
  const frac = value - whole;
  const eighths = Math.round(frac * 8);
  if (eighths === 0 || eighths === 8) {
    return String(eighths === 8 ? whole + 1 : whole);
  }
  const map: Record<number, string> = {
    1: '⅛',
    2: '¼',
    3: '⅜',
    4: '½',
    5: '⅝',
    6: '¾',
    7: '⅞',
  };
  return `${whole}${map[eighths] ?? ''}`;
}

export function getAdultHatSize(
  circumferenceCm: number,
): {
  row: AdultHatChartRow;
  isBetweenSizes: boolean;
  betweenNote: string | null;
} | null {
  const chart = getAdultHatChart();
  if (chart.length === 0) return null;
  const first = chart[0]!;
  const last = chart[chart.length - 1]!;
  if (circumferenceCm < first.circumferenceCm - 0.5) return null;
  if (circumferenceCm > last.circumferenceCm + 0.5) return null;

  for (const row of chart) {
    if (Math.abs(circumferenceCm - row.circumferenceCm) <= EXACT_CM_TOLERANCE) {
      return { row, isBetweenSizes: false, betweenNote: null };
    }
  }

  // Between sizes: recommend next larger chart size (never round down).
  for (let i = 0; i < chart.length; i++) {
    const row = chart[i]!;
    if (circumferenceCm < row.circumferenceCm) {
      const prev = i > 0 ? chart[i - 1]! : null;
      const note = prev
        ? `Measurement falls between ${prev.circumferenceCm} cm (${prev.international}) and ${row.circumferenceCm} cm (${row.international}). Recommending the larger standard size.`
        : `Measurement is just below ${row.circumferenceCm} cm. Recommending ${row.international}.`;
      return { row, isBetweenSizes: true, betweenNote: note };
    }
  }

  return {
    row: last,
    isBetweenSizes: circumferenceCm > last.circumferenceCm + EXACT_CM_TOLERANCE,
    betweenNote:
      circumferenceCm > last.circumferenceCm + EXACT_CM_TOLERANCE
        ? `Near the top of the chart — recommending ${last.international} (${last.circumferenceCm} cm).`
        : null,
  };
}

export function getChildHatSize(
  circumferenceCm: number,
): {
  row: ChildHatChartRow;
  isBetweenSizes: boolean;
  betweenNote: string | null;
} | null {
  const chart = getChildHatChart();
  if (chart.length === 0) return null;
  const first = chart[0]!;
  const last = chart[chart.length - 1]!;
  if (circumferenceCm < first.minCircumferenceCm) return null;
  if (circumferenceCm > last.maxCircumferenceCm) return null;

  for (let i = 0; i < chart.length; i++) {
    const row = chart[i]!;
    const isLast = i === chart.length - 1;
    if (
      circumferenceCm >= row.minCircumferenceCm &&
      (isLast
        ? circumferenceCm <= row.maxCircumferenceCm
        : circumferenceCm < row.maxCircumferenceCm)
    ) {
      const nearBoundary =
        !isLast &&
        Math.abs(circumferenceCm - row.maxCircumferenceCm) < 0.25;
      return {
        row,
        isBetweenSizes: nearBoundary,
        betweenNote: nearBoundary
          ? `Near the boundary with ${chart[i + 1]!.approximateAge}. Circumference remains the primary guide.`
          : null,
      };
    }
  }
  return null;
}

export function getInternationalHatSize(row: AdultHatChartRow): string {
  return row.international;
}

export function getUSHatSize(row: AdultHatChartRow): string {
  return row.us;
}

export function getUKHatSize(row: AdultHatChartRow): string {
  return row.uk;
}

export function getEUHatSize(row: AdultHatChartRow): number {
  return row.eu;
}

export function findHatSizeRange(
  circumferenceCm: number,
  category: HatCategory,
): AdultHatChartRow | ChildHatChartRow | null {
  if (category === 'adult') return getAdultHatSize(circumferenceCm)?.row ?? null;
  return getChildHatSize(circumferenceCm)?.row ?? null;
}

export function getBetweenSizeRecommendation(
  circumferenceCm: number,
  category: HatCategory,
): string {
  if (category === 'adult') {
    const m = getAdultHatSize(circumferenceCm);
    if (!m) return 'Outside the adult chart range.';
    if (!m.isBetweenSizes) return `Exact chart match: ${m.row.international}.`;
    return m.betweenNote ?? `Recommend ${m.row.international}.`;
  }
  const m = getChildHatSize(circumferenceCm);
  if (!m) return 'Outside the child chart range.';
  return m.betweenNote ?? `Suggest ${m.row.sizeLabel} (${m.row.approximateAge}).`;
}

function fitGuidance(pref: HatFitPreference): string {
  switch (pref) {
    case 'snug':
      return 'Prefer a snug fit: choose adjustable styles or try the measured size first; do not size down from the chart without trying the hat on.';
    case 'relaxed':
      return 'Prefer a relaxed fit: consider adjustable bands or the next larger chart size if the style runs small.';
    default:
      return 'Regular fit: use the chart size as a starting point and verify with the brand chart.';
  }
}

export function calculateHatSizeResults(params: {
  category: HatCategory;
  headCircumferenceCm: number;
  fitPreference?: HatFitPreference;
}): HatSizeResult {
  const {
    category,
    headCircumferenceCm,
    fitPreference = 'regular',
  } = params;
  const inches = convertCmToInches(headCircumferenceCm);
  const warnings: string[] = [
    'Hat sizes vary by manufacturer, style, and material.',
  ];
  const fit = fitGuidance(fitPreference);

  if (category === 'adult') {
    const match = getAdultHatSize(headCircumferenceCm);
    if (!match) {
      return {
        category,
        headCircumferenceCm,
        headCircumferenceIn: inches,
        international: null,
        us: null,
        uk: null,
        eu: null,
        childAge: null,
        childSizeLabel: null,
        matchedAdultRow: null,
        matchedChildRow: null,
        isBetweenSizes: false,
        betweenNote: null,
        isOutOfRange: true,
        fitGuidance: fit,
        recommendation: 'Outside adult chart range',
        formulaSteps: [
          `C = ${fmt(headCircumferenceCm, 2)} cm (${fmt(inches, 2)} in)`,
          'No adult chart row for this circumference.',
        ],
        explanation:
          'Measurement is outside the adult chart (about 52–64 cm). Check a specialty or brand chart.',
        warnings,
        chartSource: CHART_SOURCE,
      };
    }

    const { row, isBetweenSizes, betweenNote } = match;
    if (isBetweenSizes) warnings.push(betweenNote ?? 'Between standard sizes.');

    return {
      category,
      headCircumferenceCm,
      headCircumferenceIn: inches,
      international: row.international,
      us: row.us,
      uk: row.uk,
      eu: row.eu,
      childAge: null,
      childSizeLabel: null,
      matchedAdultRow: row,
      matchedChildRow: null,
      isBetweenSizes,
      betweenNote,
      isOutOfRange: false,
      fitGuidance: fit,
      recommendation: row.international,
      formulaSteps: [
        `C = ${fmt(headCircumferenceCm, 2)} cm (${fmt(inches, 2)} in)`,
        `Chart row ≈ ${row.circumferenceCm} cm → Int ${row.international} · US ${row.us} · UK ${row.uk} · EU ${row.eu}`,
        `Fit preference: ${FIT_LABELS[fitPreference]} (advisory only)`,
      ],
      explanation: isBetweenSizes
        ? `Your measured head circumference corresponds to a between-size reading. Recommended standard size: ${row.international} (US ${row.us}, UK ${row.uk}, EU ${row.eu}). Check the manufacturer's size chart before purchasing.`
        : `Your measured head circumference corresponds to international ${row.international} (US ${row.us}, UK ${row.uk}, EU ${row.eu}). Check the manufacturer's size chart before purchasing.`,
      warnings,
      chartSource: CHART_SOURCE,
    };
  }

  // Child
  const match = getChildHatSize(headCircumferenceCm);
  if (!match) {
    return {
      category,
      headCircumferenceCm,
      headCircumferenceIn: inches,
      international: null,
      us: null,
      uk: null,
      eu: null,
      childAge: null,
      childSizeLabel: null,
      matchedAdultRow: null,
      matchedChildRow: null,
      isBetweenSizes: false,
      betweenNote: null,
      isOutOfRange: true,
      fitGuidance: fit,
      recommendation: 'Outside child chart range',
      formulaSteps: [
        `C = ${fmt(headCircumferenceCm, 2)} cm (${fmt(inches, 2)} in)`,
        'No child chart range for this circumference.',
      ],
      explanation:
        'Measurement is outside the child chart. Age bands are approximate — use circumference with a brand chart.',
      warnings,
      chartSource: CHART_SOURCE,
    };
  }

  const { row, isBetweenSizes, betweenNote } = match;
  if (isBetweenSizes && betweenNote) warnings.push(betweenNote);

  return {
    category,
    headCircumferenceCm,
    headCircumferenceIn: inches,
    international: null,
    us: null,
    uk: null,
    eu: null,
    childAge: row.approximateAge,
    childSizeLabel: row.sizeLabel,
    matchedAdultRow: null,
    matchedChildRow: row,
    isBetweenSizes,
    betweenNote,
    isOutOfRange: false,
    fitGuidance: fit,
    recommendation: row.sizeLabel,
    formulaSteps: [
      `C = ${fmt(headCircumferenceCm, 2)} cm (${fmt(inches, 2)} in)`,
      `Child chart: ${row.sizeLabel} · approx. age ${row.approximateAge}`,
      `Fit preference: ${FIT_LABELS[fitPreference]} (advisory only)`,
    ],
    explanation: `Suggested child hat size: ${row.sizeLabel} (approx. ${row.approximateAge}). Age is only a guide — circumference is primary. Check the brand chart.`,
    warnings,
    chartSource: CHART_SOURCE,
  };
}

export function getRecommendedHatSize(
  circumferenceCm: number,
  category: HatCategory,
): string | null {
  return calculateHatSizeResults({
    category,
    headCircumferenceCm: circumferenceCm,
  }).recommendation;
}

export function getHatSizeByCircumference(
  circumferenceCm: number,
  category: HatCategory,
): HatSizeResult {
  return calculateHatSizeResults({
    category,
    headCircumferenceCm: circumferenceCm,
  });
}

export { ADULT_HAT_CHART, CHILD_HAT_CHART, CHART_SOURCE, CATEGORY_LABELS };
