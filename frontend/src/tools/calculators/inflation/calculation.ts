/**
 * Historical: Adjusted = Amount × (CPI_target / CPI_reference)
 * Custom: FV = PV × (1+r)^t ; purchasingPowerFactor = 1/(1+r)^t
 */

import {
  US_CPI_U_ANNUAL,
  getUsCpiForYear,
} from '../buying-power/us-cpi-u-annual';
import type { CustomTimeUnit } from './types';

export function calculateHistoricalAdjusted(
  originalAmount: number,
  referenceCPI: number,
  targetCPI: number
): number {
  if (
    !Number.isFinite(originalAmount) ||
    !Number.isFinite(referenceCPI) ||
    !Number.isFinite(targetCPI)
  ) {
    throw new Error('Please enter valid numerical values.');
  }
  if (originalAmount < 0) {
    throw new Error('Amount cannot be negative.');
  }
  if (!(referenceCPI > 0) || !(targetCPI > 0)) {
    throw new Error('CPI values must be greater than zero.');
  }
  return originalAmount * (targetCPI / referenceCPI);
}

export function cumulativeInflationPercent(
  referenceCPI: number,
  targetCPI: number
): number {
  return (targetCPI / referenceCPI - 1) * 100;
}

/** Compound annualized rate over elapsed years t > 0. */
export function averageAnnualInflationPercent(
  referenceCPI: number,
  targetCPI: number,
  yearsElapsed: number
): number | null {
  if (!(yearsElapsed > 0)) return null;
  if (!(referenceCPI > 0) || !(targetCPI > 0)) return null;
  return (Math.pow(targetCPI / referenceCPI, 1 / yearsElapsed) - 1) * 100;
}

export function timePeriodToYears(
  period: number,
  unit: CustomTimeUnit
): number {
  if (!Number.isFinite(period) || period < 0) {
    throw new Error('Time period must be a nonnegative number.');
  }
  if (unit === 'years') return period;
  if (unit === 'months') return period / 12;
  return period / 4;
}

export function calculateCustomAdjusted(
  originalAmount: number,
  annualRatePercent: number,
  years: number
): {
  adjustedAmount: number;
  purchasingPowerFactor: number;
  cumulativeInflationPercent: number;
  monetaryChange: number;
} {
  if (!Number.isFinite(originalAmount) || originalAmount < 0) {
    throw new Error('Amount cannot be negative.');
  }
  if (!Number.isFinite(annualRatePercent)) {
    throw new Error('Enter a valid annual inflation rate.');
  }
  if (annualRatePercent <= -100) {
    throw new Error(
      'Inflation rate must be greater than −100% for this compounding model.'
    );
  }
  if (!Number.isFinite(years) || years < 0) {
    throw new Error('Time period cannot be negative.');
  }
  const r = annualRatePercent / 100;
  const growth = Math.pow(1 + r, years);
  if (!Number.isFinite(growth) || growth <= 0) {
    throw new Error('Unable to compute inflation-adjusted value.');
  }
  const adjustedAmount = originalAmount * growth;
  const purchasingPowerFactor = 1 / growth;
  return {
    adjustedAmount,
    purchasingPowerFactor,
    cumulativeInflationPercent: (growth - 1) * 100,
    monetaryChange: adjustedAmount - originalAmount,
  };
}

export function historicalPurchasingPowerFactor(
  referenceCPI: number,
  targetCPI: number
): number {
  return referenceCPI / targetCPI;
}

export function buildHistoricalChartPoints(
  referenceYear: number,
  targetYear: number
): { year: number; cpi: number }[] {
  const lo = Math.min(referenceYear, targetYear);
  const hi = Math.max(referenceYear, targetYear);
  return US_CPI_U_ANNUAL.filter((r) => r.year >= lo && r.year <= hi).map(
    (r) => ({ year: r.year, cpi: r.annualAverageCPI })
  );
}

export function buildCustomProjectionPoints(
  originalAmount: number,
  annualRatePercent: number,
  years: number,
  samples = 21
): { yearFraction: number; amount: number; purchasingPower: number }[] {
  const n = Math.max(2, samples);
  const points: {
    yearFraction: number;
    amount: number;
    purchasingPower: number;
  }[] = [];
  for (let i = 0; i < n; i++) {
    const t = years === 0 ? 0 : (years * i) / (n - 1);
    const { adjustedAmount, purchasingPowerFactor } = calculateCustomAdjusted(
      originalAmount,
      annualRatePercent,
      t
    );
    points.push({
      yearFraction: t,
      amount: adjustedAmount,
      purchasingPower: originalAmount * purchasingPowerFactor,
    });
  }
  return points;
}

export function resolveHistoricalCpi(year: number): number | null {
  return getUsCpiForYear(year)?.annualAverageCPI ?? null;
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCpi(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 3,
  }).format(value);
}

export function formatPercent(value: number, digits = 2): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return `${sign}${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Math.abs(value))}%`;
}

export function formatFactor(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  }).format(value);
}
