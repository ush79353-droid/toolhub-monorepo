import type { SharpeRatioResult } from './types';

function formatPercent(value: number): string {
  const rounded = Number(value.toFixed(4));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(rounded);
}

function formatRatio(value: number): string {
  const rounded = Number(value.toFixed(4));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(rounded);
}

/**
 * Risk Premium (%) = Investment Return − Risk-Free Return
 * Sharpe Ratio = Risk Premium / Standard Deviation (unitless; same % scale)
 */
export function calculateSharpeRatio(input: {
  investmentReturnPercent: number;
  riskFreeReturnPercent: number;
  standardDeviationPercent: number;
}): SharpeRatioResult | null {
  const {
    investmentReturnPercent,
    riskFreeReturnPercent,
    standardDeviationPercent,
  } = input;

  if (
    ![
      investmentReturnPercent,
      riskFreeReturnPercent,
      standardDeviationPercent,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(standardDeviationPercent > 0)) return null;

  const riskPremiumPercent = investmentReturnPercent - riskFreeReturnPercent;
  if (!Number.isFinite(riskPremiumPercent)) return null;

  const sharpeRatio = riskPremiumPercent / standardDeviationPercent;
  if (!Number.isFinite(sharpeRatio)) return null;

  return {
    riskPremiumPercent,
    sharpeRatio,
    formattedRiskPremium: formatPercent(riskPremiumPercent),
    formattedSharpeRatio: formatRatio(sharpeRatio),
  };
}
