import type { CostOfEquityResult } from './types';

function formatPercent(value: number): string {
  const rounded = Number(value.toFixed(4));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(rounded);
}

/**
 * Dividend Growth Model (Gordon Growth), treating Dividend as expected next-year D₁
 * (not D₀). Callers must pass D₁ and P₀ already in the same currency.
 * Cost of Equity (%) = (D₁ / P₀) × 100 + g%
 * Example: D₁=10, P₀=100, g=3% → 13%; D₁=5, P₀=100, g=4% → 9%
 */
export function calculateCostOfEquityDividend(input: {
  dividendPerShare: number;
  sharePrice: number;
  growthRatePercent: number;
}): CostOfEquityResult | null {
  const { dividendPerShare, sharePrice, growthRatePercent } = input;

  if (![dividendPerShare, sharePrice, growthRatePercent].every(Number.isFinite)) {
    return null;
  }
  if (dividendPerShare < 0) return null;
  if (!(sharePrice > 0)) return null;

  const costOfEquityPercent = (dividendPerShare / sharePrice) * 100 + growthRatePercent;
  if (!Number.isFinite(costOfEquityPercent)) return null;

  return {
    costOfEquityPercent,
    formattedCostOfEquity: formatPercent(costOfEquityPercent),
  };
}
