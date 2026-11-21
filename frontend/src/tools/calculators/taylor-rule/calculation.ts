/**
 * Inflation gap = π − π*  (percentage points)
 * Output gap y = ((Y − Y*) / Y*) × 100
 * Taylor rule: i = r* + π + a(π − π*) + b·y
 * Standard a = b = 0.5
 * Approx. ex-ante real: r ≈ i − πᵉ  (assumption when πᵉ supplied)
 * Rates stored as percent numbers (4 means 4%), not decimals.
 * Currency/magnitude are denomination only — not FX conversion.
 */

import {
  GDP_MAGNITUDE_OPTIONS,
  type GdpMagnitude,
} from './types';

export function magnitudeFactor(magnitude: GdpMagnitude): number {
  return GDP_MAGNITUDE_OPTIONS.find((o) => o.id === magnitude)?.factor ?? 1;
}

export function magnitudeLabel(magnitude: GdpMagnitude): string {
  return GDP_MAGNITUDE_OPTIONS.find((o) => o.id === magnitude)?.label ?? 'Units';
}

export function toBaseUnits(amount: number, magnitude: GdpMagnitude): number {
  return amount * magnitudeFactor(magnitude);
}

export function fromBaseUnits(
  baseUnits: number,
  magnitude: GdpMagnitude
): number {
  return baseUnits / magnitudeFactor(magnitude);
}

export function calculateInflationGap(
  currentInflation: number,
  targetInflation: number
): number | null {
  if (!Number.isFinite(currentInflation) || !Number.isFinite(targetInflation)) {
    return null;
  }
  return currentInflation - targetInflation;
}

export function calculateOutputGap(
  actualGDP: number,
  potentialGDP: number
): number | null {
  if (
    !Number.isFinite(actualGDP) ||
    !Number.isFinite(potentialGDP) ||
    actualGDP <= 0 ||
    potentialGDP <= 0
  ) {
    return null;
  }
  const result = ((actualGDP - potentialGDP) / potentialGDP) * 100;
  return Number.isFinite(result) ? result : null;
}

export function calculateTaylorRuleRate(
  neutralRealRate: number,
  currentInflation: number,
  inflationGap: number,
  outputGap: number,
  inflationCoefficient = 0.5,
  outputCoefficient = 0.5
): number | null {
  const values = [
    neutralRealRate,
    currentInflation,
    inflationGap,
    outputGap,
    inflationCoefficient,
    outputCoefficient,
  ];
  if (values.some((v) => !Number.isFinite(v))) return null;
  const result =
    neutralRealRate +
    currentInflation +
    inflationCoefficient * inflationGap +
    outputCoefficient * outputGap;
  return Number.isFinite(result) ? result : null;
}

export function calculateApproximateRealRate(
  nominalRate: number,
  expectedInflation: number
): number | null {
  if (!Number.isFinite(nominalRate) || !Number.isFinite(expectedInflation)) {
    return null;
  }
  return nominalRate - expectedInflation;
}

export function applyPolicyFloor(
  rate: number,
  floor: number
): number | null {
  if (!Number.isFinite(rate) || !Number.isFinite(floor)) return null;
  return Math.max(rate, floor);
}

export function formatPercentPoints(value: number): string {
  const n = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
    signDisplay: 'exceptZero',
  }).format(value);
  return `${n} percentage points`;
}

export function formatPercent(value: number): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
    signDisplay: 'exceptZero',
  }).format(value)}%`;
}

export function formatRate(value: number): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value)}%`;
}

export function formatDisplayAmount(amountInMagnitude: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(amountInMagnitude);
}

export function formatGdpAmount(
  baseUnits: number,
  currencyCode: string,
  preferredMagnitude: GdpMagnitude
): string {
  const display = fromBaseUnits(baseUnits, preferredMagnitude);
  return `${currencyCode} ${formatDisplayAmount(display)} ${magnitudeLabel(preferredMagnitude).toLowerCase()}`;
}
