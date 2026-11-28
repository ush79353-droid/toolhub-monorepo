/**
 * Bag fabric — pure folded-bottom tote cut model (mm internally).
 */

import type {
  AreaUnit,
  BagResult,
  ConstructionType,
  LengthUnit,
} from './types';

export const MM_PER_CM = 10;
export const MM_PER_M = 1000;
export const MM_PER_IN = 25.4;
export const MM_PER_FT = 304.8;

export function convertLengthToMm(value: number, unit: LengthUnit): number {
  if (unit === 'mm') return value;
  if (unit === 'cm') return value * MM_PER_CM;
  if (unit === 'm') return value * MM_PER_M;
  if (unit === 'in') return value * MM_PER_IN;
  return value * MM_PER_FT;
}

export function convertMmToLength(mm: number, unit: LengthUnit): number {
  if (unit === 'mm') return mm;
  if (unit === 'cm') return mm / MM_PER_CM;
  if (unit === 'm') return mm / MM_PER_M;
  if (unit === 'in') return mm / MM_PER_IN;
  return mm / MM_PER_FT;
}

export function convertLength(
  value: number,
  from: LengthUnit,
  to: LengthUnit,
): number {
  return convertMmToLength(convertLengthToMm(value, from), to);
}

/** Area: mm² → display unit. */
export function convertMm2ToArea(mm2: number, unit: AreaUnit): number {
  const cm2 = mm2 / 100;
  if (unit === 'cm2') return cm2;
  if (unit === 'm2') return cm2 / 10000;
  if (unit === 'in2') return cm2 / 6.4516;
  return cm2 / 929.0304;
}

export function convertArea(
  value: number,
  from: AreaUnit,
  to: AreaUnit,
): number {
  // to cm2 first
  let cm2 = value;
  if (from === 'm2') cm2 = value * 10000;
  else if (from === 'in2') cm2 = value * 6.4516;
  else if (from === 'ft2') cm2 = value * 929.0304;
  const mm2 = cm2 * 100;
  return convertMm2ToArea(mm2, to);
}

export function calculateFlatToteFabric(
  heightMm: number,
  widthMm: number,
  seamMm: number,
  hemMm: number,
): { fabricWidthMm: number; fabricHeightMm: number } {
  return {
    fabricWidthMm: widthMm + 2 * seamMm,
    fabricHeightMm: 2 * heightMm + 2 * hemMm,
  };
}

export function calculateBoxedToteFabric(
  heightMm: number,
  widthMm: number,
  depthMm: number,
  seamMm: number,
  hemMm: number,
): { fabricWidthMm: number; fabricHeightMm: number } {
  return {
    fabricWidthMm: widthMm + depthMm + 2 * seamMm,
    fabricHeightMm: 2 * heightMm + depthMm + 2 * hemMm,
  };
}

export function calculateFabricArea(
  fabricWidthMm: number,
  fabricHeightMm: number,
): number {
  return fabricWidthMm * fabricHeightMm;
}

export function getBagConstructionDescription(
  type: ConstructionType,
): string {
  if (type === 'boxed-corner-tote') {
    return 'Single-piece folded-bottom tote with boxed corners (depth included in the cut).';
  }
  return 'Single-piece folded-bottom flat tote (depth not applied to the cut).';
}

export function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  const rounded = Number(n.toFixed(digits));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return String(rounded);
}

export function computeBagFabric(params: {
  heightMm: number;
  widthMm: number;
  depthMm: number;
  boxCorners: boolean;
  seamMm: number;
  hemMm: number;
  displayUnit: LengthUnit;
  areaUnit: AreaUnit;
}): BagResult {
  const {
    heightMm,
    widthMm,
    depthMm,
    boxCorners,
    seamMm,
    hemMm,
    displayUnit,
    areaUnit,
  } = params;

  const constructionType: ConstructionType = boxCorners
    ? 'boxed-corner-tote'
    : 'flat-tote';

  const depthIgnored = !boxCorners && depthMm > 0;

  const cut = boxCorners
    ? calculateBoxedToteFabric(heightMm, widthMm, depthMm, seamMm, hemMm)
    : calculateFlatToteFabric(heightMm, widthMm, seamMm, hemMm);

  const areaMm2 = calculateFabricArea(
    cut.fabricWidthMm,
    cut.fabricHeightMm,
  );

  const fw = convertMmToLength(cut.fabricWidthMm, displayUnit);
  const fh = convertMmToLength(cut.fabricHeightMm, displayUnit);
  const area = convertMm2ToArea(areaMm2, areaUnit);

  const u = displayUnit;
  const formulaSteps = boxCorners
    ? [
        `F_w = W + D + 2S = ${fmt(convertMmToLength(widthMm, u), 2)} + ${fmt(convertMmToLength(depthMm, u), 2)} + 2×${fmt(convertMmToLength(seamMm, u), 2)} = ${fmt(fw, 2)} ${u}`,
        `F_h = 2H + D + 2T = 2×${fmt(convertMmToLength(heightMm, u), 2)} + ${fmt(convertMmToLength(depthMm, u), 2)} + 2×${fmt(convertMmToLength(hemMm, u), 2)} = ${fmt(fh, 2)} ${u}`,
        `A = F_w × F_h = ${fmt(area, areaUnit === 'm2' ? 4 : 0)} ${areaUnit === 'cm2' ? 'cm²' : areaUnit === 'm2' ? 'm²' : areaUnit === 'in2' ? 'in²' : 'ft²'}`,
      ]
    : [
        `F_w = W + 2S = ${fmt(convertMmToLength(widthMm, u), 2)} + 2×${fmt(convertMmToLength(seamMm, u), 2)} = ${fmt(fw, 2)} ${u}`,
        `F_h = 2H + 2T = 2×${fmt(convertMmToLength(heightMm, u), 2)} + 2×${fmt(convertMmToLength(hemMm, u), 2)} = ${fmt(fh, 2)} ${u}`,
        `A = F_w × F_h = ${fmt(area, areaUnit === 'm2' ? 4 : 0)} ${areaUnit === 'cm2' ? 'cm²' : areaUnit === 'm2' ? 'm²' : areaUnit === 'in2' ? 'in²' : 'ft²'}`,
      ];

  const constructionDescription =
    getBagConstructionDescription(constructionType);

  let interpretation = `For a tote ${fmt(convertMmToLength(heightMm, u), 2)} ${u} high × ${fmt(convertMmToLength(widthMm, u), 2)} ${u} wide`;
  if (boxCorners) {
    interpretation += ` × ${fmt(convertMmToLength(depthMm, u), 2)} ${u} deep with boxed corners`;
  }
  interpretation += `, cut one rectangular piece about ${fmt(fw, 2)} ${u} wide × ${fmt(fh, 2)} ${u} high. ${constructionDescription}`;
  if (depthIgnored) {
    interpretation +=
      ' Entered depth is not applied while box corners are off.';
  }
  interpretation +=
    ' Rectangular cutting area only — not roll yardage, lining, or handles.';

  const areaLabel =
    areaUnit === 'cm2'
      ? 'cm²'
      : areaUnit === 'm2'
        ? 'm²'
        : areaUnit === 'in2'
          ? 'in²'
          : 'ft²';

  return {
    fabricWidthMm: cut.fabricWidthMm,
    fabricHeightMm: cut.fabricHeightMm,
    fabricAreaMm2: areaMm2,
    constructionType,
    finishedHeightMm: heightMm,
    finishedWidthMm: widthMm,
    finishedDepthMm: depthMm,
    sideSeamAllowanceMm: seamMm,
    topHemAllowanceMm: hemMm,
    depthIgnored,
    fabricWidthDisplay: `${fmt(fw, 2)} ${u}`,
    fabricHeightDisplay: `${fmt(fh, 2)} ${u}`,
    fabricAreaDisplay: `${fmt(area, areaUnit === 'm2' ? 4 : 1)} ${areaLabel}`,
    formulaSteps,
    interpretation,
    constructionDescription,
  };
}
