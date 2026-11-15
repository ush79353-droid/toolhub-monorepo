import type { TreynorRatioResult } from './types';

function formatPercent(value: number): string {
  const rounded = Number(value.toFixed(4));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(rounded);
}

/**
 * Portfolio Return (%) = ((Ending − Beginning) / Beginning) × 100
 * Treynor Ratio = (Portfolio Return − Risk-Free Rate) / Beta
 * Uses percentage-point values in the numerator; display with % unit.
 */
export function calculateTreynorRatio(input: {
  beginningValue: number;
  endingValue: number;
  riskFreeRatePercent: number;
  beta: number;
}): TreynorRatioResult | null {
  const { beginningValue, endingValue, riskFreeRatePercent, beta } = input;

  if (
    ![beginningValue, endingValue, riskFreeRatePercent, beta].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(beginningValue > 0)) return null;
  if (endingValue < 0) return null;
  if (!(beta > 0)) return null;

  const portfolioReturnPercent =
    ((endingValue - beginningValue) / beginningValue) * 100;
  if (!Number.isFinite(portfolioReturnPercent)) return null;

  const treynorRatioPercent =
    (portfolioReturnPercent - riskFreeRatePercent) / beta;
  if (!Number.isFinite(treynorRatioPercent)) return null;

  return {
    portfolioReturnPercent,
    treynorRatioPercent,
    formattedPortfolioReturn: formatPercent(portfolioReturnPercent),
    formattedTreynorRatio: formatPercent(treynorRatioPercent),
  };
}
