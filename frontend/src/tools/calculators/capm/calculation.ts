import type { CapmResult } from './types';

function formatPercent(value: number): string {
  const rounded = Number(value.toFixed(4));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(rounded);
}

/**
 * CAPM (percentage-point inputs; beta unitless):
 * Asset Risk Premium (%) = Beta × (Rm − Rf)
 * Expected Return R (%) = Rf + Beta × (Rm − Rf)
 */
export function calculateCapm(input: {
  riskFreeRatePercent: number;
  marketReturnPercent: number;
  beta: number;
}): CapmResult | null {
  const { riskFreeRatePercent, marketReturnPercent, beta } = input;

  if (![riskFreeRatePercent, marketReturnPercent, beta].every(Number.isFinite)) {
    return null;
  }

  const marketRiskPremium = marketReturnPercent - riskFreeRatePercent;
  const assetRiskPremiumPercent = beta * marketRiskPremium;
  const expectedReturnPercent = riskFreeRatePercent + assetRiskPremiumPercent;

  if (![assetRiskPremiumPercent, expectedReturnPercent].every(Number.isFinite)) {
    return null;
  }

  return {
    assetRiskPremiumPercent,
    expectedReturnPercent,
    formattedAssetRiskPremium: formatPercent(assetRiskPremiumPercent),
    formattedExpectedReturn: formatPercent(expectedReturnPercent),
  };
}
