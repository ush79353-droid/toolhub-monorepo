/**
 * Jeans size lookup — cm internally; charts are authoritative.
 */

import {
  CHART_SOURCE,
  getInseamOptions,
  getMensJeansSizeChart,
  getWomensJeansSizeChart,
} from './chart-data';
import type {
  JeansFit,
  JeansMeasurementMethod,
  JeansRegion,
  JeansRise,
  JeansSizeResult,
  JeansSizingCategory,
  JeansUnit,
  MensJeansChartRow,
  WomensJeansChartRow,
} from './types';
import {
  CATEGORY_LABELS,
  FIT_LABELS,
  METHOD_LABELS,
  RISE_LABELS,
} from './types';

export const CM_PER_IN = 2.54;
export const BOUNDARY_TOLERANCE_CM = 1;
export const INSEAM_TOLERANCE_CM = 2.54; // ~1 in

export function convertCmToInches(cm: number): number {
  return cm / CM_PER_IN;
}

export function convertInchesToCm(inches: number): number {
  return inches * CM_PER_IN;
}

export function convertLengthToCm(value: number, unit: JeansUnit): number {
  return unit === 'cm' ? value : convertInchesToCm(value);
}

export function convertLengthFromCm(cm: number, unit: JeansUnit): number {
  return unit === 'cm' ? cm : convertCmToInches(cm);
}

export function calculateFlatWaistbandCircumference(
  flatWidthCm: number,
): number {
  return 2 * flatWidthCm;
}

export function fmt(n: number, digits = 1): string {
  if (!Number.isFinite(n)) return '—';
  const rounded = Number(n.toFixed(digits));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return String(rounded);
}

export function formatLength(cm: number, unit: JeansUnit, digits = 1): string {
  return `${fmt(convertLengthFromCm(cm, unit), digits)} ${unit}`;
}

function matchMensWaist(waistCm: number): MensJeansChartRow | null {
  const sizes = getMensJeansSizeChart();
  const first = sizes[0]!;
  const last = sizes[sizes.length - 1]!;
  if (waistCm < first.minWaistCm || waistCm > last.maxWaistCm) return null;
  for (let i = 0; i < sizes.length; i++) {
    const s = sizes[i]!;
    const isLast = i === sizes.length - 1;
    if (
      waistCm >= s.minWaistCm &&
      (isLast ? waistCm <= s.maxWaistCm : waistCm < s.maxWaistCm)
    ) {
      return s;
    }
  }
  return null;
}

function matchWomensWaist(waistCm: number): WomensJeansChartRow | null {
  const sizes = getWomensJeansSizeChart();
  const first = sizes[0]!;
  const last = sizes[sizes.length - 1]!;
  if (waistCm < first.minWaistCm || waistCm > last.maxWaistCm) return null;
  for (let i = 0; i < sizes.length; i++) {
    const s = sizes[i]!;
    const isLast = i === sizes.length - 1;
    if (
      waistCm >= s.minWaistCm &&
      (isLast ? waistCm <= s.maxWaistCm : waistCm < s.maxWaistCm)
    ) {
      return s;
    }
  }
  return null;
}

export function findMatchingJeansWaistSize(
  waistCm: number,
  category: JeansSizingCategory,
): MensJeansChartRow | WomensJeansChartRow | null {
  return category === 'men'
    ? matchMensWaist(waistCm)
    : matchWomensWaist(waistCm);
}

export function findMatchingJeansInseamLength(inseamCm: number): {
  primary: string | null;
  alternatives: string[];
  isBetween: boolean;
} {
  const options = getInseamOptions();
  if (options.length === 0) {
    return { primary: null, alternatives: [], isBetween: false };
  }

  let best = options[0]!;
  let bestDist = Math.abs(inseamCm - convertInchesToCm(best.inches));
  for (const opt of options) {
    const d = Math.abs(inseamCm - convertInchesToCm(opt.inches));
    if (d < bestDist) {
      best = opt;
      bestDist = d;
    }
  }

  const alternatives: string[] = [];
  for (const opt of options) {
    if (opt.label === best.label) continue;
    const d = Math.abs(inseamCm - convertInchesToCm(opt.inches));
    if (d <= INSEAM_TOLERANCE_CM + 0.5) alternatives.push(opt.label);
  }

  const isBetween =
    bestDist > 0.8 &&
    (alternatives.length > 0 ||
      bestDist <= convertInchesToCm(1) + 0.2);

  return {
    primary: best.label,
    alternatives,
    isBetween: isBetween || alternatives.length > 0,
  };
}

export function getAlternativeJeansSizes(
  waistCm: number,
  category: JeansSizingCategory,
  matched: MensJeansChartRow | WomensJeansChartRow | null,
): { alternatives: string[]; isBetween: boolean } {
  if (!matched) return { alternatives: [], isBetween: false };
  const sizes =
    category === 'men' ? getMensJeansSizeChart() : getWomensJeansSizeChart();
  const idx = sizes.findIndex(
    (s) =>
      s.waistLabel === matched.waistLabel &&
      s.minWaistCm === matched.minWaistCm,
  );
  if (idx < 0) return { alternatives: [], isBetween: false };

  const alternatives: string[] = [];
  if (
    idx < sizes.length - 1 &&
    Math.abs(waistCm - matched.maxWaistCm) <= BOUNDARY_TOLERANCE_CM
  ) {
    alternatives.push(sizes[idx + 1]!.waistLabel);
  }
  if (
    idx > 0 &&
    Math.abs(waistCm - matched.minWaistCm) <= BOUNDARY_TOLERANCE_CM
  ) {
    alternatives.push(sizes[idx - 1]!.waistLabel);
  }
  return { alternatives, isBetween: alternatives.length > 0 };
}

export function getInternationalJeansSize(
  matched: MensJeansChartRow | WomensJeansChartRow | null,
): string | null {
  return matched?.international ?? null;
}

export function convertJeansSizeRegion(
  matched: MensJeansChartRow | WomensJeansChartRow | null,
  category: JeansSizingCategory,
  region: JeansRegion,
): string | null {
  if (!matched) return null;
  if (category === 'men') {
    const m = matched as MensJeansChartRow;
    if (region === 'INT') return m.international;
    // Men's W label is the primary US/UK inch designation
    if (region === 'US' || region === 'UK') return m.waistLabel;
    return m.waistLabel; // EU often still sold as W×L
  }
  const w = matched as WomensJeansChartRow;
  switch (region) {
    case 'US':
      return w.us;
    case 'UK':
      return w.uk;
    case 'EU':
      return w.eu;
    default:
      return w.international;
  }
}

export function getJeansFitGuidance(fit: JeansFit): string {
  switch (fit) {
    case 'skinny':
      return 'Skinny: close through thigh and ankle — stretch fabrics matter; do not auto-size down.';
    case 'slim':
      return 'Slim: tapered but less extreme than skinny — check thigh ease on the brand chart.';
    case 'straight':
      return 'Straight: consistent leg opening — classic silhouette.';
    case 'relaxed':
      return 'Relaxed: more room in seat and thigh — prefer comfort over a tighter W without brand data.';
    case 'loose':
      return 'Loose: roomiest cut — size from waist/hip chart, not by automatically upsizing.';
    default:
      return 'Regular: balanced ease — use the chart W×L as a starting point.';
  }
}

export function getJeansRiseGuidance(rise: JeansRise): string {
  switch (rise) {
    case 'low':
      return 'Low rise sits below the natural waist — measure where the waistband will sit, not at the natural waist.';
    case 'high':
      return 'High rise sits at or above the natural waist — use that higher circumference if it differs.';
    default:
      return 'Mid rise sits near the natural waist — a common default measurement position.';
  }
}

export function calculateMensJeansSize(waistCm: number): MensJeansChartRow | null {
  return matchMensWaist(waistCm);
}

export function calculateWomensJeansSize(
  waistCm: number,
): WomensJeansChartRow | null {
  return matchWomensWaist(waistCm);
}

export function calculateJeansSizeResults(params: {
  category: JeansSizingCategory;
  measurementMethod: JeansMeasurementMethod;
  waistInputCm: number;
  inseamCm: number;
  hipsCm: number | null;
  preferredRegion: JeansRegion;
  fit: JeansFit;
  rise: JeansRise;
}): JeansSizeResult {
  const {
    category,
    measurementMethod,
    waistInputCm,
    inseamCm,
    hipsCm,
    preferredRegion,
    fit,
    rise,
  } = params;

  const usedGarmentWaist = measurementMethod === 'existing-jeans';
  const flatWidthCm = usedGarmentWaist ? waistInputCm : null;
  const waistCm = usedGarmentWaist
    ? calculateFlatWaistbandCircumference(waistInputCm)
    : waistInputCm;

  const warnings: string[] = [
    'Jeans sizes vary by brand, rise, stretch, and vanity sizing — check the product chart.',
  ];
  if (usedGarmentWaist) {
    warnings.push(
      'Garment waistband circumference ≈ 2 × flat width — not the same as body waist.',
    );
  }

  const matched = findMatchingJeansWaistSize(waistCm, category);
  const { alternatives, isBetween: isBetweenWaist } = getAlternativeJeansSizes(
    waistCm,
    category,
    matched,
  );
  const inseamMatch = findMatchingJeansInseamLength(inseamCm);

  let hipsConflict = false;
  if (hipsCm != null && category === 'women' && matched) {
    // Approximate: hips much larger than waist band may need larger W
    const hipAsWaist = findMatchingJeansWaistSize(hipsCm * 0.75, category);
    if (
      hipAsWaist &&
      hipAsWaist.waistLabel !== matched.waistLabel &&
      hipsCm > matched.maxWaistCm + 20
    ) {
      hipsConflict = true;
      warnings.push(
        `Hip circumference is large relative to the waist band — you may need a larger size or different cut for comfort through the seat.`,
      );
    }
  }

  const fitGuidance = getJeansFitGuidance(fit);
  const riseGuidance = getJeansRiseGuidance(rise);

  if (!matched) {
    return {
      category,
      measurementMethod,
      waistCm,
      inseamCm,
      hipsCm,
      usedGarmentWaist,
      flatWidthCm,
      waistSize: null,
      inseamSize: inseamMatch.primary,
      combinedSize: null,
      internationalSize: null,
      usSize: null,
      ukSize: null,
      euSize: null,
      alternativeSizes: [],
      alternativeInseams: inseamMatch.alternatives,
      isBetweenWaist: false,
      isBetweenInseam: inseamMatch.isBetween,
      isOutOfRange: true,
      hipsConflict,
      fitGuidance,
      riseGuidance,
      formulaSteps: [
        usedGarmentWaist
          ? `Flat width ${fmt(waistInputCm, 1)} cm → waistband ≈ ${fmt(waistCm, 1)} cm`
          : `Body waist = ${fmt(waistCm, 1)} cm`,
        `Inseam = ${fmt(inseamCm, 1)} cm → ${inseamMatch.primary ?? '—'}`,
        'Waist outside chart range.',
      ],
      explanation: `Waist measurement is outside the ${CATEGORY_LABELS[category].toLowerCase()} jeans chart.`,
      warnings,
      sizingReference: CHART_SOURCE,
    };
  }

  if (isBetweenWaist) {
    warnings.push(
      'Your waist measurement falls between two jeans sizes — compare the listed alternatives.',
    );
  }
  if (inseamMatch.isBetween && inseamMatch.alternatives.length > 0) {
    warnings.push(
      `Inseam is near more than one length (${[inseamMatch.primary, ...inseamMatch.alternatives].join(', ')}). Shorter sits higher on the ankle; longer may stack or need hemming.`,
    );
  }

  const wLabel = matched.waistLabel;
  const lLabel = inseamMatch.primary;
  const combined =
    wLabel && lLabel ? `${wLabel} × ${lLabel}` : wLabel ?? null;

  let usSize: string | null = null;
  let ukSize: string | null = null;
  let euSize: string | null = null;
  if (category === 'women') {
    const w = matched as WomensJeansChartRow;
    usSize = w.us;
    ukSize = w.uk;
    euSize = w.eu;
  } else {
    usSize = wLabel;
    ukSize = wLabel;
    euSize = wLabel;
  }

  return {
    category,
    measurementMethod,
    waistCm,
    inseamCm,
    hipsCm,
    usedGarmentWaist,
    flatWidthCm,
    waistSize: wLabel,
    inseamSize: lLabel,
    combinedSize: combined,
    internationalSize: matched.international,
    usSize,
    ukSize,
    euSize,
    alternativeSizes: alternatives,
    alternativeInseams: inseamMatch.alternatives,
    isBetweenWaist,
    isBetweenInseam: inseamMatch.isBetween,
    isOutOfRange: false,
    hipsConflict,
    fitGuidance,
    riseGuidance,
    formulaSteps: [
      `Method: ${METHOD_LABELS[measurementMethod]}`,
      usedGarmentWaist
        ? `Flat ${fmt(waistInputCm, 1)} cm × 2 → ${fmt(waistCm, 1)} cm waistband`
        : `Body waist = ${fmt(waistCm, 1)} cm`,
      `Waist band → ${wLabel} (${matched.minWaistCm}–${matched.maxWaistCm} cm)`,
      `Inseam ${fmt(inseamCm, 1)} cm → ${lLabel ?? '—'}`,
      `Preferred region hint: ${convertJeansSizeRegion(matched, category, preferredRegion)}`,
      `Fit: ${FIT_LABELS[fit]} · Rise: ${RISE_LABELS[rise]} (advisory)`,
    ],
    explanation: `Recommended ${CATEGORY_LABELS[category].toLowerCase()} jeans size: ${combined ?? wLabel}${matched.international ? ` · Int ${matched.international}` : ''}. Nominal W/L labels are not exact garment guarantees.`,
    warnings,
    sizingReference: CHART_SOURCE,
  };
}

export {
  getMensJeansSizeChart,
  getWomensJeansSizeChart,
  getInseamOptions,
  CHART_SOURCE,
};
