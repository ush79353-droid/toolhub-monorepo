/**
 * Jacket size lookup — cm internally; charts are authoritative.
 */

import {
  CHART_SOURCE,
  getJacketSizeChart,
  getMensJacketSizeChart,
  getWomensJacketSizeChart,
} from './chart-data';
import type {
  CircumferenceUnit,
  FitPreference,
  HeightUnit,
  JacketLength,
  JacketSizeChartRow,
  JacketSizeResult,
  JacketSizingCategory,
  JacketStyle,
  SizeRegion,
} from './types';
import {
  CATEGORY_LABELS,
  FIT_LABELS,
  LENGTH_LABELS,
  REGION_LABELS,
  STYLE_LABELS,
} from './types';

export const CM_PER_IN = 2.54;
export const BOUNDARY_TOLERANCE_CM = 1;

export function convertCircumferenceToCm(
  value: number,
  unit: CircumferenceUnit,
): number {
  return unit === 'cm' ? value : value * CM_PER_IN;
}

export function convertCircumferenceFromCm(
  cm: number,
  unit: CircumferenceUnit,
): number {
  return unit === 'cm' ? cm : cm / CM_PER_IN;
}

export function convertHeightToCm(
  value: number,
  unit: HeightUnit,
  inchesPart = 0,
): number {
  if (unit === 'cm') return value;
  if (unit === 'm') return value * 100;
  if (unit === 'in') return value * CM_PER_IN;
  // ft (+ optional inches part)
  return (value * 12 + inchesPart) * CM_PER_IN;
}

export function convertHeightFromCm(cm: number, unit: HeightUnit): number {
  if (unit === 'cm') return cm;
  if (unit === 'm') return cm / 100;
  if (unit === 'in') return cm / CM_PER_IN;
  return cm / (12 * CM_PER_IN);
}

export function convertLengthUnits(
  value: number,
  from: HeightUnit,
  to: HeightUnit,
  inchesPart = 0,
): number {
  return convertHeightFromCm(convertHeightToCm(value, from, inchesPart), to);
}

export function convertCircumferenceUnits(
  value: number,
  from: CircumferenceUnit,
  to: CircumferenceUnit,
): number {
  return convertCircumferenceFromCm(
    convertCircumferenceToCm(value, from),
    to,
  );
}

export function fmt(n: number, digits = 1): string {
  if (!Number.isFinite(n)) return '—';
  const rounded = Number(n.toFixed(digits));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return String(rounded);
}

export function formatCircumference(
  cm: number,
  unit: CircumferenceUnit,
  digits = 1,
): string {
  return `${fmt(convertCircumferenceFromCm(cm, unit), digits)} ${unit}`;
}

export function formatHeight(cm: number, unit: HeightUnit, digits = 1): string {
  if (unit === 'ft') {
    const totalIn = cm / CM_PER_IN;
    const ft = Math.floor(totalIn / 12);
    const inch = Math.round(totalIn - ft * 12);
    return `${ft}'${inch}"`;
  }
  return `${fmt(convertHeightFromCm(cm, unit), digits)} ${unit}`;
}

/**
 * Match chest to chart. min inclusive, max exclusive except last includes max.
 */
export function findMatchingSizeRange(
  chestCm: number,
  category: JacketSizingCategory,
): JacketSizeChartRow | null {
  const sizes = getJacketSizeChart(category);
  if (sizes.length === 0) return null;
  const first = sizes[0]!;
  const last = sizes[sizes.length - 1]!;
  if (chestCm < first.minChestCm) return null;
  if (chestCm > last.maxChestCm) return null;

  for (let i = 0; i < sizes.length; i++) {
    const s = sizes[i]!;
    const isLast = i === sizes.length - 1;
    if (
      chestCm >= s.minChestCm &&
      (isLast ? chestCm <= s.maxChestCm : chestCm < s.maxChestCm)
    ) {
      return s;
    }
  }
  return null;
}

export function getAlternativeJacketSizes(
  chestCm: number,
  category: JacketSizingCategory,
  matched: JacketSizeChartRow | null,
): { alternatives: string[]; isBetween: boolean } {
  if (!matched) return { alternatives: [], isBetween: false };
  const sizes = getJacketSizeChart(category);
  const idx = sizes.findIndex(
    (s) =>
      s.us === matched.us &&
      s.eu === matched.eu &&
      s.minChestCm === matched.minChestCm,
  );
  if (idx < 0) return { alternatives: [], isBetween: false };

  const nearMax =
    idx < sizes.length - 1 &&
    Math.abs(chestCm - matched.maxChestCm) <= BOUNDARY_TOLERANCE_CM;
  const nearMin =
    idx > 0 &&
    Math.abs(chestCm - matched.minChestCm) <= BOUNDARY_TOLERANCE_CM;

  const alternatives: string[] = [];
  if (nearMax) {
    const next = sizes[idx + 1]!;
    alternatives.push(`${next.us} / EU ${next.eu} (${next.international})`);
  }
  if (nearMin) {
    const prev = sizes[idx - 1]!;
    alternatives.push(`${prev.us} / EU ${prev.eu} (${prev.international})`);
  }
  return { alternatives, isBetween: alternatives.length > 0 };
}

export function calculateJacketLengthCategory(
  heightCm: number | null,
  category: JacketSizingCategory,
): JacketLength | null {
  if (heightCm == null || !Number.isFinite(heightCm)) return null;
  if (category === 'men') {
    if (heightCm < 170) return 'short';
    if (heightCm <= 183) return 'regular';
    return 'long';
  }
  if (heightCm < 163) return 'short';
  if (heightCm <= 173) return 'regular';
  return 'long';
}

export function getFitRecommendation(
  fit: FitPreference,
  style: JacketStyle,
): string {
  const base =
    fit === 'slim'
      ? 'Slim fit: closer silhouette — confirm shoulders and chest ease on the brand chart; do not size down automatically.'
      : fit === 'relaxed'
        ? 'Relaxed fit: more room for layering — prefer adjustable or roomier cuts; do not automatically size up without checking the brand.'
        : 'Regular fit: balanced ease — use the chart size as a starting point.';
  const styleNote =
    style === 'outerwear'
      ? ' Outerwear often needs extra room for layers.'
      : style === 'casual'
        ? ' Casual jackets may run roomier than suit jackets.'
        : ' Suit/blazer charts are typically closer to body measurement.';
  return base + styleNote;
}

export function convertJacketSizeRegion(
  row: JacketSizeChartRow,
  region: SizeRegion,
): string {
  switch (region) {
    case 'US':
      return row.us;
    case 'UK':
      return row.uk;
    case 'EU':
      return row.eu;
    default:
      return row.international;
  }
}

export function getInternationalSize(row: JacketSizeChartRow): string {
  return row.international;
}

export function calculateMensJacketSize(chestCm: number): JacketSizeChartRow | null {
  return findMatchingSizeRange(chestCm, 'men');
}

export function calculateWomensJacketSize(
  chestCm: number,
): JacketSizeChartRow | null {
  return findMatchingSizeRange(chestCm, 'women');
}

export function calculateJacketSizeResults(params: {
  category: JacketSizingCategory;
  chestCm: number;
  heightCm: number | null;
  hipsCm: number | null;
  fitPreference: FitPreference;
  jacketStyle: JacketStyle;
  preferredRegion: SizeRegion;
}): JacketSizeResult {
  const {
    category,
    chestCm,
    heightCm,
    hipsCm,
    fitPreference,
    jacketStyle,
    preferredRegion,
  } = params;

  const warnings: string[] = [
    'Jacket sizes vary by manufacturer, style, and fit — check the product chart before buying.',
  ];
  const fitGuidance = getFitRecommendation(fitPreference, jacketStyle);
  const matched = findMatchingSizeRange(chestCm, category);
  const length = calculateJacketLengthCategory(heightCm, category);
  const { alternatives, isBetween } = getAlternativeJacketSizes(
    chestCm,
    category,
    matched,
  );

  let hipsConflict = false;
  if (hipsCm != null && category === 'women') {
    const hipMatch = findMatchingSizeRange(hipsCm, category);
    if (
      hipMatch &&
      matched &&
      (hipMatch.us !== matched.us || hipMatch.eu !== matched.eu)
    ) {
      hipsConflict = true;
      warnings.push(
        `Hip circumference suggests ${hipMatch.us} / EU ${hipMatch.eu} while chest suggests ${matched.us} / EU ${matched.eu}. Long jackets may need the larger of the two.`,
      );
    }
  }

  if (!matched) {
    return {
      category,
      heightCm,
      chestCm,
      hipsCm,
      recommendedSize: null,
      internationalSize: null,
      usSize: null,
      ukSize: null,
      euSize: null,
      primaryDisplay: null,
      jacketLength: length,
      chestRangeCm: null,
      matchedRow: null,
      alternativeSizes: [],
      isBetweenSizes: false,
      isOutOfRange: true,
      hipsConflict,
      fitGuidance,
      formulaSteps: [
        `Chest = ${fmt(chestCm, 1)} cm`,
        heightCm != null ? `Height = ${fmt(heightCm, 1)} cm` : 'Height not entered',
        'No chart row for this chest circumference.',
      ],
      explanation: `Chest measurement is outside the ${CATEGORY_LABELS[category].toLowerCase()} jacket chart. Try a specialty or brand size guide.`,
      warnings,
      sizingReference: CHART_SOURCE,
    };
  }

  if (isBetween) {
    warnings.push(
      'Your measurements fall near a size boundary — compare the listed alternatives and prefer the larger size for layering.',
    );
  }
  if (heightCm == null) {
    warnings.push(
      'Length classification (short/regular/long) needs height — chest size is still available.',
    );
  }

  const primary = convertJacketSizeRegion(matched, preferredRegion);
  const primaryLabel = `${REGION_LABELS[preferredRegion]} ${primary}`;

  return {
    category,
    heightCm,
    chestCm,
    hipsCm,
    recommendedSize: matched.label,
    internationalSize: matched.international,
    usSize: matched.us,
    ukSize: matched.uk,
    euSize: matched.eu,
    primaryDisplay: primaryLabel,
    jacketLength: length,
    chestRangeCm: { min: matched.minChestCm, max: matched.maxChestCm },
    matchedRow: matched,
    alternativeSizes: alternatives,
    isBetweenSizes: isBetween,
    isOutOfRange: false,
    hipsConflict,
    fitGuidance,
    formulaSteps: [
      `Chest = ${fmt(chestCm, 1)} cm → ${matched.minChestCm}–${matched.maxChestCm} cm band`,
      `US/UK ${matched.us} · EU ${matched.eu} · Int ${matched.international}`,
      heightCm != null
        ? `Height ${fmt(heightCm, 1)} cm → ${LENGTH_LABELS[length!]} length`
        : 'Height not entered — length not classified',
      `Style: ${STYLE_LABELS[jacketStyle]} · Fit: ${FIT_LABELS[fitPreference]} (advisory)`,
    ],
    explanation: `Recommended ${CATEGORY_LABELS[category].toLowerCase()} jacket size: US/UK ${matched.us}, EU ${matched.eu}, international ${matched.international}${length ? ` · ${LENGTH_LABELS[length]} length` : ''}.`,
    warnings,
    sizingReference: CHART_SOURCE,
  };
}

export {
  getMensJacketSizeChart,
  getWomensJacketSizeChart,
  getJacketSizeChart,
  CHART_SOURCE,
};
