/**
 * Winch Size — pure force model.
 * F_r = C·m·g·cosθ (rolling) or C·m·g (drag on level for load-moving base);
 * F_s = m·g·sinθ; F_t = F_r + F_s; F_req = F_t × SF × (line/derate adjustments).
 */

import type {
  CalculationMode,
  ForceUnit,
  SlopeUnit,
  WeightUnit,
  WinchSizeResult,
} from './types';
import { WINCH_RATING_TIERS_LBF } from './types';

export const G = 9.80665;
export const LB_PER_KG = 2.2046226218;
export const KG_PER_TONNE = 1000;
export const N_PER_LBF = 4.448221615;

export function convertWeightToKg(value: number, unit: WeightUnit): number {
  if (unit === 'kg') return value;
  if (unit === 'lb') return value / LB_PER_KG;
  return value * KG_PER_TONNE;
}

export function convertKgToWeight(kg: number, unit: WeightUnit): number {
  if (unit === 'kg') return kg;
  if (unit === 'lb') return kg * LB_PER_KG;
  return kg / KG_PER_TONNE;
}

/** Percent grade → degrees: θ = arctan(grade/100). */
export function convertSlopeToDegrees(
  value: number,
  unit: SlopeUnit,
): number {
  if (unit === 'degree') return value;
  return (Math.atan(value / 100) * 180) / Math.PI;
}

export function convertDegreesToSlope(
  degrees: number,
  unit: SlopeUnit,
): number {
  if (unit === 'degree') return degrees;
  return Math.tan((degrees * Math.PI) / 180) * 100;
}

export function calculateWeightForce(massKg: number): number {
  return massKg * G;
}

export function calculateRollingResistance(
  massKg: number,
  coefficient: number,
  slopeDegrees: number,
): number {
  const theta = (slopeDegrees * Math.PI) / 180;
  return coefficient * massKg * G * Math.cos(theta);
}

/** Non-rolling / sliding drag: μ·m·g·cosθ (same geometry, labeled drag). */
export function calculateDragResistance(
  massKg: number,
  coefficient: number,
  slopeDegrees: number,
): number {
  return calculateRollingResistance(massKg, coefficient, slopeDegrees);
}

export function calculateSlopeResistance(
  massKg: number,
  slopeDegrees: number,
): number {
  const theta = (slopeDegrees * Math.PI) / 180;
  return massKg * G * Math.sin(theta);
}

export function calculateTotalPullingForce(
  resistanceN: number,
  slopeN: number,
): number {
  return resistanceN + slopeN;
}

export function applySafetyFactor(forceN: number, sf: number): number {
  return forceN * sf;
}

export function convertNewtonsToPoundsForce(n: number): number {
  return n / N_PER_LBF;
}

export function convertNewtonsToKilogramForce(n: number): number {
  return n / G;
}

export function convertNewtonsToKilonewtons(n: number): number {
  return n / 1000;
}

export function convertNewtonsToForceUnit(
  n: number,
  unit: ForceUnit,
): number {
  if (unit === 'lbf') return convertNewtonsToPoundsForce(n);
  if (unit === 'kgf') return convertNewtonsToKilogramForce(n);
  return convertNewtonsToKilonewtons(n);
}

export function calculateWeightBasedWinchGuideline(
  massKg: number,
  factor = 1.5,
): number {
  return convertKgToWeight(massKg, 'lb') * factor;
}

export function selectWinchRatingTier(requiredLbf: number): {
  tier: number | null;
  exceeds: boolean;
} {
  for (const tier of WINCH_RATING_TIERS_LBF) {
    if (tier >= requiredLbf) return { tier, exceeds: false };
  }
  return { tier: null, exceeds: true };
}

export function fmt(n: number, digits = 1): string {
  if (!Number.isFinite(n)) return '—';
  const rounded = Number(n.toFixed(digits));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return String(rounded);
}

export function computeWinchSize(params: {
  calculationMode: CalculationMode;
  massKg: number;
  resistanceCoefficient: number;
  slopeDegrees: number;
  safetyFactor: number;
  resultUnit: ForceUnit;
  linePullPercent: number;
  lineMultiplier: number;
}): WinchSizeResult {
  const {
    calculationMode,
    massKg,
    resistanceCoefficient,
    slopeDegrees,
    safetyFactor,
    resultUnit,
    linePullPercent,
    lineMultiplier,
  } = params;

  const Fg = calculateWeightForce(massKg);
  const resistanceLabel =
    calculationMode === 'load-moving' ? 'Drag resistance' : 'Rolling resistance';

  const Fr =
    calculationMode === 'load-moving'
      ? calculateDragResistance(massKg, resistanceCoefficient, slopeDegrees)
      : calculateRollingResistance(massKg, resistanceCoefficient, slopeDegrees);

  const Fs = calculateSlopeResistance(massKg, slopeDegrees);
  const Ft = calculateTotalPullingForce(Fr, Fs);

  const linePullFactor = linePullPercent / 100;
  // Multi-line: illustrative mechanical advantage on required capacity (÷), not a promise of usable pull.
  const adjustedBase = applySafetyFactor(Ft, safetyFactor) / lineMultiplier;
  // Derating: if first-layer rating is only X% of stamped, need higher stamped rating.
  const adjusted =
    linePullFactor > 0 ? adjustedBase / linePullFactor : Number.NaN;

  const adjustedUnit = convertNewtonsToForceUnit(adjusted, resultUnit);

  const guideline =
    calculationMode === 'vehicle-recovery'
      ? calculateWeightBasedWinchGuideline(massKg, 1.5)
      : null;

  const compareLbf = convertNewtonsToPoundsForce(adjusted);
  const sizingLbf = Math.max(compareLbf, guideline ?? 0);
  const { tier, exceeds } = selectWinchRatingTier(sizingLbf);

  const unitLabel =
    resultUnit === 'lbf' ? 'lbf' : resultUnit === 'kgf' ? 'kgf' : 'kN';

  const formulaSteps = [
    `m = ${fmt(massKg, 2)} kg · g = ${G}`,
    `F_g = m·g = ${fmt(Fg, 1)} N`,
    `${resistanceLabel}: C=${fmt(resistanceCoefficient, 3)} · F_r = C·m·g·cos(θ) = ${fmt(Fr, 1)} N`,
    `F_s = m·g·sin(θ) = ${fmt(Fs, 1)} N · θ = ${fmt(slopeDegrees, 4)}°`,
    `F_t = F_r + F_s = ${fmt(Ft, 1)} N`,
    `F_req = F_t × ${fmt(safetyFactor, 2)} / MA(${fmt(lineMultiplier, 1)}) / derate(${fmt(linePullPercent, 0)}%) = ${fmt(adjusted, 1)} N ≈ ${fmt(adjustedUnit, resultUnit === 'kN' ? 3 : 0)} ${unitLabel}`,
  ];

  if (guideline != null) {
    formulaSteps.push(
      `Weight guideline (1.5× mass): ≈ ${fmt(guideline, 0)} lbf`,
    );
  }

  let interpretation = `${resistanceLabel} and slope components are planning estimates only. `;
  if (guideline != null) {
    interpretation += `The 1.5× vehicle-weight guideline (~${fmt(guideline, 0)} lbf) is a separate recreational rule of thumb — not a guarantee. `;
    if (guideline > compareLbf) {
      interpretation +=
        'In this case the weight-based guideline exceeds the simplified resistance estimate; real recovery loads can be far higher due to suction, obstacles, stalled wheels, or rigging. ';
    }
  }
  interpretation +=
    'Never exceed rated capacity of the winch, rope, mounts, or recovery hardware. Follow manufacturer instructions.';

  return {
    massKg,
    weightForceN: Fg,
    resistanceForceN: Fr,
    slopeForceN: Fs,
    totalPullingForceN: Ft,
    adjustedPullingForceN: adjusted,
    adjustedInResultUnit: adjustedUnit,
    guidelineWinchRatingLbf: guideline,
    recommendedTierLbf: tier,
    exceedsListedTiers: exceeds,
    resistanceLabel,
    slopeDegrees,
    safetyFactor,
    lineMultiplier,
    linePullFactor,
    formulaSteps,
    interpretation,
    adjustedDisplay: `${fmt(adjustedUnit, resultUnit === 'kN' ? 3 : 0)} ${unitLabel}`,
    guidelineDisplay:
      guideline != null ? `${fmt(guideline, 0)} lbf` : null,
    tierDisplay: exceeds
      ? 'Exceeds listed rating tiers'
      : tier != null
        ? `${tier.toLocaleString('en-US')} lb class (illustrative)`
        : null,
  };
}
