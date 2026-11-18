/**
 * Debt to Equity Ratio = Total Liabilities / Stockholders' Equity
 * Both amounts must already be in the same currency.
 * Preserves full IEEE precision; never returns NaN or Infinity.
 * Equity must be nonzero; negative equity yields a negative ratio when liabilities are positive.
 */
export function calculateDebtToEquityRatio(input: {
  totalLiabilities: number;
  stockholdersEquity: number;
}): number | null {
  const { totalLiabilities, stockholdersEquity } = input;

  if (![totalLiabilities, stockholdersEquity].every(Number.isFinite)) return null;
  if (stockholdersEquity === 0) return null;

  const ratio = totalLiabilities / stockholdersEquity;
  return Number.isFinite(ratio) ? ratio : null;
}

/** Display formatting for the dimensionless D/E ratio. */
export function formatDebtToEquityRatio(ratio: number): string {
  if (!Number.isFinite(ratio)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(ratio);
}
