import type { IncomeElasticityClassification } from './types';

const UNIT_TOLERANCE = 1e-9;

/**
 * Standard % change using period 1 as baseline.
 * first must be > 0; second must be finite and ≥ 0 for quantities,
 * or > 0 for positive-income model (caller validates).
 */
export function calculateStandardPercentageChange(
  first: number,
  second: number
): number | null {
  if (
    !Number.isFinite(first) ||
    first <= 0 ||
    !Number.isFinite(second) ||
    second < 0
  ) {
    return null;
  }
  const pct = ((second - first) / first) * 100;
  return Number.isFinite(pct) ? pct : null;
}

/**
 * Midpoint (arc) % change.
 * Average of first and second must be > 0. Both values ≥ 0.
 */
export function calculateMidpointPercentageChange(
  first: number,
  second: number
): number | null {
  if (
    !Number.isFinite(first) ||
    first < 0 ||
    !Number.isFinite(second) ||
    second < 0
  ) {
    return null;
  }
  const avg = (first + second) / 2;
  if (avg <= 0) return null;
  const pct = ((second - first) / avg) * 100;
  return Number.isFinite(pct) ? pct : null;
}

export function calculateIncomePercentageChange(
  income1: number,
  income2: number,
  method: 'standard' | 'midpoint'
): number | null {
  return method === 'midpoint'
    ? calculateMidpointPercentageChange(income1, income2)
    : calculateStandardPercentageChange(income1, income2);
}

export function calculateQuantityPercentageChange(
  quantity1: number,
  quantity2: number,
  method: 'standard' | 'midpoint'
): number | null {
  return method === 'midpoint'
    ? calculateMidpointPercentageChange(quantity1, quantity2)
    : calculateStandardPercentageChange(quantity1, quantity2);
}

/**
 * YED = %ΔQd / %ΔY.
 * Returns null when income change is 0 (undefined / indeterminate when both 0).
 */
export function calculateIncomeElasticity(
  quantityChangePercent: number,
  incomeChangePercent: number
): number | null {
  if (
    !Number.isFinite(quantityChangePercent) ||
    !Number.isFinite(incomeChangePercent)
  ) {
    return null;
  }
  if (incomeChangePercent === 0) return null;
  const yed = quantityChangePercent / incomeChangePercent;
  return Number.isFinite(yed) ? yed : null;
}

export function classifyIncomeElasticity(
  yed: number
): IncomeElasticityClassification {
  if (!Number.isFinite(yed)) return 'unknown';
  if (yed < -UNIT_TOLERANCE) return 'inferior';
  if (Math.abs(yed) < UNIT_TOLERANCE) return 'zeroElasticity';
  if (Math.abs(yed - 1) < UNIT_TOLERANCE) return 'unitIncomeElasticity';
  if (yed > 0 && yed < 1) return 'normalNecessity';
  if (yed > 1) return 'incomeElasticNormal';
  return 'unknown';
}

export function interpretIncomeElasticity(
  yed: number,
  classification: IncomeElasticityClassification
): string {
  switch (classification) {
    case 'inferior':
      return `YED of ${formatYed(yed)} is negative — consistent with an inferior good over this income range (quantity demanded fell as income rose, or rose as income fell). Inferior does not mean low quality.`;
    case 'zeroElasticity':
      return 'YED of 0.00 — quantity demanded showed no measured response to the observed income change.';
    case 'normalNecessity':
      return `YED of ${formatYed(yed)} is positive but less than 1 — demand rises less than proportionally with income (necessity-type normal good under these observations).`;
    case 'unitIncomeElasticity':
      return `YED of ${formatYed(yed)} ≈ 1 — quantity demanded changes proportionally with income (unit income elasticity).`;
    case 'incomeElasticNormal':
      return `YED of ${formatYed(yed)} is greater than 1 — demand rises more than proportionally with income (income-elastic / luxury-type normal good under these observations). Classifications can vary by income range and market.`;
    default:
      return `Income elasticity of demand ≈ ${formatYed(yed)}.`;
  }
}

export function formatYed(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
    signDisplay: 'exceptZero',
  }).format(value);
}

export function formatPercentageChange(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'exceptZero',
  }).format(value);
}
