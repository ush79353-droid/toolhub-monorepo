/**
 * Debt to Capital Ratio = Interest Bearing Debt / (Interest Bearing Debt + Shareholder’s Equity)
 * Both amounts must already be in the same currency.
 * Preserves full IEEE precision; never returns NaN or Infinity.
 */
export function calculateDebtToCapitalRatio(input: {
  interestBearingDebt: number;
  shareholdersEquity: number;
}): number | null {
  const { interestBearingDebt, shareholdersEquity } = input;

  if (![interestBearingDebt, shareholdersEquity].every(Number.isFinite)) {
    return null;
  }

  const totalCapital = interestBearingDebt + shareholdersEquity;
  if (!Number.isFinite(totalCapital) || totalCapital === 0) {
    return null;
  }

  const ratio = interestBearingDebt / totalCapital;
  return Number.isFinite(ratio) ? ratio : null;
}

/** Display formatting for the dimensionless debt-to-capital ratio. */
export function formatDebtToCapitalRatio(ratio: number): string {
  if (!Number.isFinite(ratio)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(ratio);
}
