/**
 * Circle skirt geometry — pure math.
 * Waist arc: W = 2π R f  ⇒  R = W / (2π f)
 * Outer: R_o = R + L
 * Radial cut: F = L + R + A (A = waist seam + hem allowances)
 * Hem circ: C = 2π R_o f
 */

import type {
  CircleSkirtResult,
  CircleSkirtType,
  FabricEstimate,
  LengthUnit,
} from './types';
import { SKIRT_TYPE_LABELS } from './types';

export const CM_PER_MM = 0.1;
export const CM_PER_M = 100;
export const CM_PER_IN = 2.54;
export const CM_PER_FT = 30.48;

export function convertLengthToCm(value: number, unit: LengthUnit): number {
  if (unit === 'cm') return value;
  if (unit === 'mm') return value * CM_PER_MM;
  if (unit === 'm') return value * CM_PER_M;
  if (unit === 'in') return value * CM_PER_IN;
  return value * CM_PER_FT;
}

export function convertCmToLength(cm: number, unit: LengthUnit): number {
  if (unit === 'cm') return cm;
  if (unit === 'mm') return cm / CM_PER_MM;
  if (unit === 'm') return cm / CM_PER_M;
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

export function formatMeasurement(
  cm: number,
  unit: LengthUnit,
  digits = 2,
): string {
  return `${fmt(convertCmToLength(cm, unit), digits)} ${unit}`;
}

export function getCircleFraction(skirtType: CircleSkirtType): number {
  if (skirtType === 'full') return 1;
  if (skirtType === 'threeQuarter') return 0.75;
  if (skirtType === 'half') return 0.5;
  return 0.25;
}

/** R = W / (2π f) */
export function calculateWaistRadius(
  waistCm: number,
  circleFraction: number,
): number {
  return waistCm / (2 * Math.PI * circleFraction);
}

export function calculateOuterRadius(
  waistRadiusCm: number,
  skirtLengthCm: number,
): number {
  return waistRadiusCm + skirtLengthCm;
}

export function calculateRadialCuttingDimension(
  waistRadiusCm: number,
  skirtLengthCm: number,
  allowanceCm: number,
): number {
  return skirtLengthCm + waistRadiusCm + allowanceCm;
}

export function calculateHemCircumference(
  outerRadiusCm: number,
  circleFraction: number,
): number {
  return 2 * Math.PI * outerRadiusCm * circleFraction;
}

/**
 * Simplified fabric estimate: needs diameter ≈ 2 × outer (+allowances) along
 * both axes for a single-piece full layout; half/quarter may fold.
 * Returns null length when width is insufficient for a simple layout.
 */
export function calculateFabricEstimate(args: {
  skirtType: CircleSkirtType;
  outerRadiusCm: number;
  radialCuttingCm: number;
  fabricWidthCm: number;
}): FabricEstimate {
  const { skirtType, outerRadiusCm, radialCuttingCm, fabricWidthCm } = args;
  const neededSpan = 2 * outerRadiusCm;

  // Quarter/half often cut on fold — need at least radial dimension on fold edge
  let minWidth: number;
  if (skirtType === 'full' || skirtType === 'threeQuarter') {
    minWidth = neededSpan;
  } else if (skirtType === 'half') {
    minWidth = Math.max(neededSpan / 2, radialCuttingCm);
  } else {
    minWidth = radialCuttingCm;
  }

  if (fabricWidthCm + 1e-9 < minWidth) {
    return {
      fabricWidthCm,
      estimatedFabricLengthCm: null,
      layoutSupported: false,
      warning: `Fabric width ${fmt(fabricWidthCm, 1)} cm is less than ~${fmt(minWidth, 1)} cm needed for a simple single-piece layout. Use panels/seams or wider fabric.`,
    };
  }

  // Length along bolt ≈ radial span (diameter for full when laid flat)
  const estimated =
    skirtType === 'full' || skirtType === 'threeQuarter'
      ? neededSpan
      : radialCuttingCm;

  return {
    fabricWidthCm,
    estimatedFabricLengthCm: estimated,
    layoutSupported: true,
    warning: null,
  };
}

export function calculateCircleSkirtResults(args: {
  skirtType: CircleSkirtType;
  waistCm: number;
  skirtLengthCm: number;
  waistSeamAllowanceCm: number;
  hemAllowanceCm: number;
  fabricWidthCm: number | null;
}): CircleSkirtResult {
  const f = getCircleFraction(args.skirtType);
  const R = calculateWaistRadius(args.waistCm, f);
  const finishedOuter = calculateOuterRadius(R, args.skirtLengthCm);
  const A = args.waistSeamAllowanceCm + args.hemAllowanceCm;
  const radial = calculateRadialCuttingDimension(
    R,
    args.skirtLengthCm,
    A,
  );
  // Cutting outer includes allowances on the radial path
  const cuttingOuter = R + args.skirtLengthCm + A;
  const hem = calculateHemCircumference(finishedOuter, f);

  const warnings: string[] = [];
  if (A > 0) {
    warnings.push(
      'Allowances affect cutting dimensions only — finished waist radius uses measured waist without adding seam into R.',
    );
  }

  let fabricEstimate: FabricEstimate | null = null;
  if (args.fabricWidthCm != null && args.fabricWidthCm > 0) {
    fabricEstimate = calculateFabricEstimate({
      skirtType: args.skirtType,
      outerRadiusCm: cuttingOuter,
      radialCuttingCm: radial,
      fabricWidthCm: args.fabricWidthCm,
    });
    if (fabricEstimate.warning) warnings.push(fabricEstimate.warning);
  }

  const formulaSteps = [
    `f = ${f} (${SKIRT_TYPE_LABELS[args.skirtType]})`,
    `R = W / (2πf) = ${fmt(args.waistCm, 2)} / (2π×${f}) = ${fmt(R, 2)} cm`,
    `R_outer (finished) = R + L = ${fmt(R, 2)} + ${fmt(args.skirtLengthCm, 2)} = ${fmt(finishedOuter, 2)} cm`,
    `A = waist seam + hem = ${fmt(args.waistSeamAllowanceCm, 2)} + ${fmt(args.hemAllowanceCm, 2)} = ${fmt(A, 2)} cm`,
    `F_radial = L + R + A = ${fmt(radial, 2)} cm`,
    `C_hem = 2π R_outer f = ${fmt(hem, 2)} cm`,
  ];

  return {
    circleFraction: f,
    waistRadiusCm: R,
    outerRadiusCm: cuttingOuter,
    radialCuttingDimensionCm: radial,
    hemCircumferenceCm: hem,
    finishedOuterRadiusCm: finishedOuter,
    waistSeamAllowanceCm: args.waistSeamAllowanceCm,
    hemAllowanceCm: args.hemAllowanceCm,
    skirtType: args.skirtType,
    fabricEstimate,
    formulaSteps,
    explanation: `${SKIRT_TYPE_LABELS[args.skirtType]}: waist opening is an arc of fraction ${f} of a full circle. Radial cutting length is skirt length plus waist radius plus allowances — not always equal to purchased fabric yardage.`,
    warnings,
  };
}
