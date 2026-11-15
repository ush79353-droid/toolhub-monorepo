import type { AnnualizedReturnResult } from './types';

function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 1e6) / 1e6;
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(rounded);
}

function annualizeGrowthFactor(growth: number, years: number): number | null {
  if (!Number.isFinite(growth) || !Number.isFinite(years) || years <= 0) return null;
  if (growth < 0) return null;
  if (growth === 0) return -100; // complete loss → −100% annualized
  const annualized = (growth ** (1 / years) - 1) * 100;
  if (!Number.isFinite(annualized)) return null;
  return annualized;
}

/**
 * Annualized Return (%) = ((1 + R / 100)^(1 / n) − 1) × 100
 * Rejects R < −100%. R = −100% is a complete loss (−100% annualized).
 */
export function calculateFromTotalReturn(
  totalReturnPercent: number,
  holdingPeriodYears: number
): AnnualizedReturnResult | null {
  if (!Number.isFinite(totalReturnPercent) || !Number.isFinite(holdingPeriodYears)) {
    return null;
  }
  if (holdingPeriodYears <= 0) return null;
  if (totalReturnPercent < -100) return null;

  const annualized = annualizeGrowthFactor(
    1 + totalReturnPercent / 100,
    holdingPeriodYears
  );
  if (annualized === null) return null;

  return {
    annualizedReturnPercent: annualized,
    display: formatPercent(annualized),
  };
}

/**
 * Annualized Return (%) = ((Ending / Beginning)^(1 / n) − 1) × 100
 * Beginning > 0; ending ≥ 0. Ending 0 → complete loss (−100%).
 */
export function calculateFromValues(
  beginningValue: number,
  endingValue: number,
  holdingPeriodYears: number
): AnnualizedReturnResult | null {
  if (
    !Number.isFinite(beginningValue) ||
    !Number.isFinite(endingValue) ||
    !Number.isFinite(holdingPeriodYears)
  ) {
    return null;
  }
  if (holdingPeriodYears <= 0) return null;
  if (beginningValue <= 0) return null;
  if (endingValue < 0) return null;

  const annualized = annualizeGrowthFactor(
    endingValue / beginningValue,
    holdingPeriodYears
  );
  if (annualized === null) return null;

  return {
    annualizedReturnPercent: annualized,
    display: formatPercent(annualized),
  };
}
