/**
 * Curtain size — finished dimensions (not fabric cutting).
 * R = W+2E · Wc = R×F · Wp = Wc/N
 * sill: H+M+S · cafe: H×C · floor: Hr−Cf+P
 */

import type {
  CurtainFullness,
  CurtainSizeResult,
  CurtainType,
  LengthUnit,
} from './types';
import { CURTAIN_TYPE_LABELS } from './types';

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

export function convertCurtainMeasurementUnits(
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

export function getRecommendedFullnessMultiplier(
  fullness: CurtainFullness,
): number {
  if (fullness === 'standard') return 1.5;
  if (fullness === 'ultra') return 2.5;
  if (fullness === 'deluxe') return 2;
  return 2;
}

export function calculateEffectiveRodWidth(
  windowWidthCm: number,
  rodExtensionPerSideCm: number,
): number {
  return windowWidthCm + 2 * rodExtensionPerSideCm;
}

export function calculateTotalCurtainWidth(
  rodWidthCm: number,
  fullnessMultiplier: number,
): number {
  return rodWidthCm * fullnessMultiplier;
}

export function calculateCurtainWidthPerPanel(
  totalWidthCm: number,
  numberOfPanels: number,
): number {
  return totalWidthCm / numberOfPanels;
}

export function calculateSillCurtainLength(
  windowHeightCm: number,
  rodMountingHeightCm: number,
  extraBelowSillCm: number,
): number {
  return windowHeightCm + rodMountingHeightCm + extraBelowSillCm;
}

export function calculateCafeCurtainLength(
  windowHeightCm: number,
  coverageRatio: number,
): number {
  return windowHeightCm * coverageRatio;
}

export function calculateFloorCurtainLength(
  rodHeightAboveFloorCm: number,
  floorClearanceCm: number,
  puddlingLengthCm: number,
): number {
  return rodHeightAboveFloorCm - floorClearanceCm + puddlingLengthCm;
}

export function calculateRecommendedCurtainLength(args: {
  curtainType: CurtainType;
  windowHeightCm: number;
  rodMountingHeightCm: number;
  extraBelowSillCm: number;
  cafeCoverageRatio: number;
  rodHeightAboveFloorCm: number;
  floorClearanceCm: number;
  puddlingLengthCm: number;
}): number {
  if (args.curtainType === 'cafe') {
    return calculateCafeCurtainLength(
      args.windowHeightCm,
      args.cafeCoverageRatio,
    );
  }
  if (args.curtainType === 'extra-long') {
    return calculateFloorCurtainLength(
      args.rodHeightAboveFloorCm,
      args.floorClearanceCm,
      args.puddlingLengthCm,
    );
  }
  return calculateSillCurtainLength(
    args.windowHeightCm,
    args.rodMountingHeightCm,
    args.extraBelowSillCm,
  );
}

export function calculateCurtainSizeResults(args: {
  curtainType: CurtainType;
  fullnessMultiplier: number;
  windowHeightCm: number;
  windowWidthCm: number;
  rodMountingHeightCm: number;
  rodExtensionCm: number;
  extraLengthBelowSillCm: number;
  cafeCoverageRatio: number;
  rodHeightAboveFloorCm: number;
  floorClearanceCm: number;
  puddlingLengthCm: number;
  numberOfPanels: number;
}): CurtainSizeResult {
  const rod = calculateEffectiveRodWidth(
    args.windowWidthCm,
    args.rodExtensionCm,
  );
  const totalW = calculateTotalCurtainWidth(rod, args.fullnessMultiplier);
  const panelW = calculateCurtainWidthPerPanel(totalW, args.numberOfPanels);
  const length = calculateRecommendedCurtainLength({
    curtainType: args.curtainType,
    windowHeightCm: args.windowHeightCm,
    rodMountingHeightCm: args.rodMountingHeightCm,
    extraBelowSillCm: args.extraLengthBelowSillCm,
    cafeCoverageRatio: args.cafeCoverageRatio,
    rodHeightAboveFloorCm: args.rodHeightAboveFloorCm,
    floorClearanceCm: args.floorClearanceCm,
    puddlingLengthCm: args.puddlingLengthCm,
  });

  const warnings: string[] = [];
  if (args.fullnessMultiplier < 1.2 || args.fullnessMultiplier > 3.5) {
    warnings.push(
      'Fullness multiplier is unusual for typical drapery — check heading style and preferred look.',
    );
  }
  if (length <= 0) {
    warnings.push(
      'Finished curtain length is not positive — check floor clearance vs rod height.',
    );
  }
  if (
    args.curtainType === 'extra-long' &&
    args.floorClearanceCm > args.rodHeightAboveFloorCm
  ) {
    warnings.push(
      'Floor clearance exceeds rod height above floor — length would be negative without puddling.',
    );
  }

  const formulaSteps = [
    `R = W+2E = ${fmt(args.windowWidthCm, 1)}+2×${fmt(args.rodExtensionCm, 1)} = ${fmt(rod, 1)} cm`,
    `Wc = R×F = ${fmt(rod, 1)}×${fmt(args.fullnessMultiplier, 2)} = ${fmt(totalW, 1)} cm`,
    `Wp = Wc/N = ${fmt(totalW, 1)}/${args.numberOfPanels} = ${fmt(panelW, 1)} cm`,
    args.curtainType === 'cafe'
      ? `L_cafe = H×C = ${fmt(args.windowHeightCm, 1)}×${fmt(args.cafeCoverageRatio, 2)} = ${fmt(length, 1)} cm`
      : args.curtainType === 'extra-long'
        ? `L_floor = Hr−Cf+P = ${fmt(args.rodHeightAboveFloorCm, 1)}−${fmt(args.floorClearanceCm, 1)}+${fmt(args.puddlingLengthCm, 1)} = ${fmt(length, 1)} cm`
        : `L_sill = H+M+S = ${fmt(args.windowHeightCm, 1)}+${fmt(args.rodMountingHeightCm, 1)}+${fmt(args.extraLengthBelowSillCm, 1)} = ${fmt(length, 1)} cm`,
  ];

  return {
    effectiveRodWidthCm: rod,
    recommendedCurtainLengthCm: length,
    totalCurtainWidthCm: totalW,
    curtainWidthPerPanelCm: panelW,
    numberOfPanels: args.numberOfPanels,
    fullnessMultiplier: args.fullnessMultiplier,
    curtainType: args.curtainType,
    formulaSteps,
    explanation: `${CURTAIN_TYPE_LABELS[args.curtainType]} · finished flat width and length (not fabric cutting sizes). Use Curtain Panel Calculator for drops and yardage.`,
    warnings,
  };
}
