import type { JensensAlphaResult } from './types';

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
 * Expected Return (%) = Risk-Free Rate + Beta × (Market Return − Risk-Free Rate)
 * Jensen's Alpha (%) = Portfolio Return − Expected Return
 */
export function calculateJensensAlpha(input: {
  beginningValue: number;
  endingValue: number;
  riskFreeRatePercent: number;
  beta: number;
  marketReturnPercent: number;
}): JensensAlphaResult | null {
  const {
    beginningValue,
    endingValue,
    riskFreeRatePercent,
    beta,
    marketReturnPercent,
  } = input;

  if (
    ![beginningValue, endingValue, riskFreeRatePercent, beta, marketReturnPercent].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (beginningValue <= 0) return null;

  const portfolioReturnPercent =
    ((endingValue - beginningValue) / beginningValue) * 100;
  if (!Number.isFinite(portfolioReturnPercent)) return null;

  const expectedReturnPercent =
    riskFreeRatePercent + beta * (marketReturnPercent - riskFreeRatePercent);
  if (!Number.isFinite(expectedReturnPercent)) return null;

  const jensensAlphaPercent = portfolioReturnPercent - expectedReturnPercent;
  if (!Number.isFinite(jensensAlphaPercent)) return null;

  return {
    portfolioReturnPercent,
    expectedReturnPercent,
    jensensAlphaPercent,
    formattedPortfolioReturn: formatPercent(portfolioReturnPercent),
    formattedExpectedReturn: formatPercent(expectedReturnPercent),
    formattedJensensAlpha: formatPercent(jensensAlphaPercent),
  };
}
