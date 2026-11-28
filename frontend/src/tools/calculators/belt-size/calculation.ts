/**
 * Belt size — pure conversion + chart lookups.
 * Direct waist circumference → nearest chart belt (no +2).
 * Labeled pants waist (inches) → B = P + 2 (conventional heuristic).
 * Existing belt fastening-to-hole → match as nominal length.
 */

import {
  CHART_SOURCE,
  getBeltChart,
  getClothingOptions,
  type BeltChartRow,
} from './chart-data';
import type {
  BeltSizeResult,
  GeneralSize,
  LengthUnit,
  MeasurementMethod,
  SizingCategory,
  SizingSystem,
} from './types';

export const CM_PER_IN = 2.54;
export const CM_PER_FT = 30.48;
export const CM_PER_MM = 0.1;

export function convertLengthToCm(value: number, unit: LengthUnit): number {
  if (unit === 'cm') return value;
  if (unit === 'mm') return value * CM_PER_MM;
  if (unit === 'in') return value * CM_PER_IN;
  return value * CM_PER_FT;
}

export function convertCmToLength(cm: number, unit: LengthUnit): number {
  if (unit === 'cm') return cm;
  if (unit === 'mm') return cm / CM_PER_MM;
  if (unit === 'in') return cm / CM_PER_IN;
  return cm / CM_PER_FT;
}

export function convertLength(
  value: number,
  from: LengthUnit,
  to: LengthUnit,
): number {
  return convertCmToLength(convertLengthToCm(value, from), to);
}

export function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  const rounded = Number(n.toFixed(digits));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return String(rounded);
}

function inchesToCm(inches: number): number {
  return inches * CM_PER_IN;
}

function cmToInches(cm: number): number {
  return cm / CM_PER_IN;
}

/** Nearest chart row by absolute difference of nominal inches. */
export function findClosestAvailableBeltSize(
  targetInches: number,
  category: SizingCategory,
): { row: BeltChartRow | null; outOfChart: boolean } {
  const rows = getBeltChart(category);
  if (rows.length === 0) return { row: null, outOfChart: true };
  let best = rows[0]!;
  let bestDiff = Math.abs(best.numericBeltInches - targetInches);
  for (const r of rows) {
    const d = Math.abs(r.numericBeltInches - targetInches);
    if (d < bestDiff) {
      best = r;
      bestDiff = d;
    }
  }
  const min = rows[0]!.numericBeltInches;
  const max = rows[rows.length - 1]!.numericBeltInches;
  const outOfChart = targetInches < min - 1 || targetInches > max + 1;
  return { row: best, outOfChart };
}

/** Match waist circumference (cm) into chart waist bands; prefer containing band. */
export function calculateBeltSizeFromWaist(
  waistCm: number,
  category: SizingCategory,
): { row: BeltChartRow | null; outOfChart: boolean } {
  const rows = getBeltChart(category);
  const containing = rows.filter(
    (r) => waistCm >= r.minWaistCm && waistCm <= r.maxWaistCm,
  );
  if (containing.length > 0) {
    // Mid of band closest to waist
    let best = containing[0]!;
    let bestDiff = Infinity;
    for (const r of containing) {
      const mid = (r.minWaistCm + r.maxWaistCm) / 2;
      const d = Math.abs(mid - waistCm);
      if (d < bestDiff) {
        best = r;
        bestDiff = d;
      }
    }
    return { row: best, outOfChart: false };
  }
  // Fall back: nearest by mid-band
  let best = rows[0] ?? null;
  let bestDiff = Infinity;
  for (const r of rows) {
    const mid = (r.minWaistCm + r.maxWaistCm) / 2;
    const d = Math.abs(mid - waistCm);
    if (d < bestDiff) {
      best = r;
      bestDiff = d;
    }
  }
  const first = rows[0];
  const last = rows[rows.length - 1];
  const outOfChart =
    !first ||
    !last ||
    waistCm < first.minWaistCm - 4 ||
    waistCm > last.maxWaistCm + 4;
  return { row: best, outOfChart };
}

/** Conventional labeled pants waist: B = P + 2 inches. */
export function calculateBeltSizeFromPantsWaist(
  pantsWaistInches: number,
  category: SizingCategory,
): { targetInches: number; row: BeltChartRow | null; outOfChart: boolean } {
  const targetInches = pantsWaistInches + 2;
  const { row, outOfChart } = findClosestAvailableBeltSize(
    targetInches,
    category,
  );
  return { targetInches, row, outOfChart };
}

/** Existing fastening-point-to-hole length ≈ nominal belt size. */
export function calculateBeltSizeFromExistingBelt(
  lengthCm: number,
  category: SizingCategory,
): { row: BeltChartRow | null; outOfChart: boolean } {
  return findClosestAvailableBeltSize(cmToInches(lengthCm), category);
}

export function convertGeneralBeltSize(
  general: GeneralSize,
  category: SizingCategory,
): { rows: BeltChartRow[]; rangeInches: { min: number; max: number } | null } {
  const rows = getBeltChart(category).filter((r) => r.generalSize === general);
  if (rows.length === 0) return { rows: [], rangeInches: null };
  const inches = rows.map((r) => r.numericBeltInches);
  return {
    rows,
    rangeInches: {
      min: Math.min(...inches),
      max: Math.max(...inches),
    },
  };
}

function buildResult(params: {
  row: BeltChartRow | null;
  rangeRows?: BeltChartRow[];
  category: SizingCategory;
  system: SizingSystem;
  method: MeasurementMethod;
  isApproximate: boolean;
  outOfChart: boolean;
  explanation: string;
  warnings: string[];
  formulaSteps: string[];
}): BeltSizeResult {
  const {
    row,
    rangeRows,
    category,
    system,
    method,
    isApproximate,
    outOfChart,
    explanation,
    warnings,
    formulaSteps,
  } = params;

  const all = rangeRows && rangeRows.length > 0 ? rangeRows : row ? [row] : [];
  const primary = row ?? all[0] ?? null;

  let recommendedSizeRangeCm: BeltSizeResult['recommendedSizeRangeCm'] = null;
  if (all.length > 1) {
    const cms = all.map((r) => inchesToCm(r.numericBeltInches));
    recommendedSizeRangeCm = { min: Math.min(...cms), max: Math.max(...cms) };
  }

  const inches = primary?.numericBeltInches ?? null;
  const cm = inches != null ? inchesToCm(inches) : null;

  return {
    recommendedBeltSizeCm: cm,
    recommendedBeltSizeInches: inches,
    recommendedSizeRangeCm,
    recommendedGeneralSize: primary?.generalSize ?? null,
    approximateWaistRangeCm: primary
      ? { min: primary.minWaistCm, max: primary.maxWaistCm }
      : null,
    clothingHint: null,
    sizingCategory: category,
    sizingSystem: system,
    measurementMethod: method,
    isApproximate,
    outOfChart,
    explanation,
    warnings: [...warnings, CHART_SOURCE],
    formulaSteps,
    inchesDisplay: inches != null ? `${fmt(inches, 0)} in` : null,
    cmDisplay: cm != null ? `${fmt(cm, 2)} cm` : null,
  };
}

export function computeBeltSize(params: {
  sizingCategory: SizingCategory;
  measurementMethod: MeasurementMethod;
  numericalBeltSize: number | null;
  numericalUnit: LengthUnit;
  generalBeltSize: GeneralSize;
  waistCircumference: number | null;
  waistUnit: LengthUnit;
  existingBeltLength: number | null;
  existingUnit: LengthUnit;
  clothingSize: string | null;
  sizingSystem: SizingSystem;
  pantsWaistInches: number | null;
}): BeltSizeResult | null {
  const {
    sizingCategory: category,
    measurementMethod: method,
    sizingSystem: system,
  } = params;

  const warnings: string[] = [
    'Estimated conventional size — check your brand’s chart before buying.',
  ];

  if (method === 'numerical-belt-size') {
    if (params.numericalBeltSize == null) return null;
    const cm = convertLengthToCm(
      params.numericalBeltSize,
      params.numericalUnit,
    );
    const inches = cmToInches(cm);
    const { row, outOfChart } = findClosestAvailableBeltSize(inches, category);
    return buildResult({
      row,
      category,
      system,
      method,
      isApproximate: true,
      outOfChart,
      explanation: `Entered numerical size ${fmt(params.numericalBeltSize, 2)} ${params.numericalUnit} (${fmt(inches, 2)} in / ${fmt(cm, 2)} cm) maps to chart size ${row ? `${row.numericBeltInches} in (${row.generalSize})` : 'n/a'}.`,
      warnings: outOfChart
        ? [...warnings, 'Measurement is outside the illustrative chart span.']
        : warnings,
      formulaSteps: [
        `Input → ${fmt(inches, 2)} in = ${fmt(cm, 2)} cm`,
        `Closest chart: ${row ? `${row.numericBeltInches} in / ${row.generalSize}` : '—'}`,
      ],
    });
  }

  if (method === 'general-belt-size') {
    const { rows, rangeInches } = convertGeneralBeltSize(
      params.generalBeltSize,
      category,
    );
    if (!rangeInches || rows.length === 0) return null;
    const mid = (rangeInches.min + rangeInches.max) / 2;
    const { row } = findClosestAvailableBeltSize(mid, category);
    return buildResult({
      row,
      rangeRows: rows,
      category,
      system,
      method,
      isApproximate: true,
      outOfChart: false,
      explanation: `General size ${params.generalBeltSize} maps to about ${rangeInches.min}–${rangeInches.max} in on the ${category} chart.`,
      warnings,
      formulaSteps: [
        `${params.generalBeltSize} → ${rangeInches.min}–${rangeInches.max} in`,
        `Display pick: ${row ? `${row.numericBeltInches} in` : '—'}`,
      ],
    });
  }

  if (method === 'waist-circumference') {
    if (params.waistCircumference == null) return null;
    const waistCm = convertLengthToCm(
      params.waistCircumference,
      params.waistUnit,
    );
    const { row, outOfChart } = calculateBeltSizeFromWaist(waistCm, category);
    return buildResult({
      row,
      category,
      system,
      method,
      isApproximate: true,
      outOfChart,
      explanation: `Belt-wearing circumference ${fmt(waistCm, 1)} cm matched to chart belt ${row ? `${row.numericBeltInches} in` : 'n/a'} (no +2 added — body measure ≠ pants label).`,
      warnings: outOfChart
        ? [...warnings, 'Waist is outside the illustrative chart span.']
        : warnings,
      formulaSteps: [
        `Waist = ${fmt(waistCm, 2)} cm`,
        `Chart match: ${row ? `${row.numericBeltInches} in (${row.generalSize}), waist band ${row.minWaistCm}–${row.maxWaistCm} cm` : '—'}`,
      ],
    });
  }

  if (method === 'existing-belt-length') {
    if (params.existingBeltLength == null) return null;
    const lenCm = convertLengthToCm(
      params.existingBeltLength,
      params.existingUnit,
    );
    const { row, outOfChart } = calculateBeltSizeFromExistingBelt(
      lenCm,
      category,
    );
    return buildResult({
      row,
      category,
      system,
      method,
      isApproximate: true,
      outOfChart,
      explanation: `Fastening-point-to-used-hole ${fmt(lenCm, 1)} cm ≈ ${fmt(cmToInches(lenCm), 2)} in → chart ${row ? `${row.numericBeltInches} in` : 'n/a'}. Not overall end-to-end length.`,
      warnings,
      formulaSteps: [
        `L = ${fmt(lenCm, 2)} cm = ${fmt(cmToInches(lenCm), 2)} in`,
        `Closest nominal: ${row ? `${row.numericBeltInches} in` : '—'}`,
      ],
    });
  }

  // dress-pants-size
  if (params.clothingSize == null || params.clothingSize === '') return null;

  if (
    (category === 'men' &&
      (system === 'US' || system === 'UK') &&
      params.pantsWaistInches != null) ||
    (category === 'men' &&
      system === 'US' &&
      /^\d+$/.test(params.clothingSize))
  ) {
    // Prefer explicit pants waist when provided; else parse clothing size as inches label
    const pants =
      params.pantsWaistInches ??
      (system === 'US' || system === 'UK'
        ? Number(params.clothingSize)
        : null);
    if (pants != null && Number.isFinite(pants) && pants > 0) {
      const { targetInches, row, outOfChart } =
        calculateBeltSizeFromPantsWaist(pants, category);
      return buildResult({
        row,
        category,
        system,
        method,
        isApproximate: true,
        outOfChart,
        explanation: `Labeled pants waist ${fmt(pants, 0)} in → conventional B = P + 2 = ${fmt(targetInches, 0)} in (${fmt(inchesToCm(targetInches), 2)} cm).`,
        warnings,
        formulaSteps: [
          `B = P + 2 = ${fmt(pants, 0)} + 2 = ${fmt(targetInches, 0)} in`,
          `= ${fmt(inchesToCm(targetInches), 2)} cm`,
          `Chart: ${row ? `${row.numericBeltInches} in / ${row.generalSize}` : '—'}`,
        ],
      });
    }
  }

  const maps = getClothingOptions(category, system);
  const hit = maps.find((m) => m.clothingSize === params.clothingSize);
  if (!hit) return null;

  if (hit.pantsWaistInches != null && category === 'men') {
    const { targetInches, row, outOfChart } = calculateBeltSizeFromPantsWaist(
      hit.pantsWaistInches,
      category,
    );
    return buildResult({
      row,
      category,
      system,
      method,
      isApproximate: true,
      outOfChart,
      explanation: `${system} pants size ${hit.clothingSize} (label ${hit.pantsWaistInches} in) → B = P + 2 = ${targetInches} in.`,
      warnings,
      formulaSteps: [
        `P = ${hit.pantsWaistInches} in`,
        `B = P + 2 = ${targetInches} in`,
      ],
    });
  }

  // Women / EU: mid-waist → chart (no pants +2)
  const midWaist = (hit.minWaistCm + hit.maxWaistCm) / 2;
  const { row, outOfChart } = calculateBeltSizeFromWaist(midWaist, category);
  return buildResult({
    row,
    category,
    system,
    method,
    isApproximate: true,
    outOfChart,
    explanation: `${system} clothing size ${hit.clothingSize} ≈ waist ${hit.minWaistCm}–${hit.maxWaistCm} cm → belt ${row ? `${row.numericBeltInches} in` : 'n/a'}. Approximate chart mapping only.`,
    warnings,
    formulaSteps: [
      `Clothing ${hit.clothingSize} → waist ${hit.minWaistCm}–${hit.maxWaistCm} cm`,
      `Mid ${fmt(midWaist, 1)} cm → belt ${row ? `${row.numericBeltInches} in` : '—'}`,
    ],
  });
}
