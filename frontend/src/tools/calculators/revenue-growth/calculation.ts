import { solveCagr } from '@/tools/calculators/cagr/calculation';

export function formatRevenueGrowthPercent(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const rounded = Number(value.toFixed(8));
  return new Intl.NumberFormat('en-US', {
    useGrouping: false,
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  }).format(rounded);
}

/**
 * Total Growth (%) = (Final − Initial) / Initial × 100
 * Initial must be nonzero.
 */
export function calculateTotalRevenueGrowth(
  initialRevenue: number,
  finalRevenue: number
): number | null {
  if (![initialRevenue, finalRevenue].every(Number.isFinite)) return null;
  if (initialRevenue === 0) return null;
  const growth = ((finalRevenue - initialRevenue) / initialRevenue) * 100;
  return Number.isFinite(growth) ? growth : null;
}

/**
 * Growth Rate (%) = [(Final / Initial)^(1 / Periods) − 1] × 100
 * Requires positive initial, positive final, and positive periods.
 * Reuses the verified CAGR solver (final=0 → −100 is rejected here by the positive-final rule).
 */
export function calculateRevenueGrowthRate(
  initialRevenue: number,
  finalRevenue: number,
  periods: number
): number | null {
  if (![initialRevenue, finalRevenue, periods].every(Number.isFinite)) {
    return null;
  }
  if (!(initialRevenue > 0) || !(finalRevenue > 0) || !(periods > 0)) {
    return null;
  }
  return solveCagr(initialRevenue, finalRevenue, periods);
}
