/**
 * Interest Coverage Ratio = EBIT / Interest Expense
 * Both amounts must already be in the same currency.
 * Preserves full IEEE precision; never returns NaN or Infinity.
 */
export function calculateInterestCoverageRatio(input: {
  ebit: number;
  interestExpense: number;
}): number | null {
  const { ebit, interestExpense } = input;

  if (![ebit, interestExpense].every(Number.isFinite)) return null;
  if (!(interestExpense > 0)) return null;

  const ratio = ebit / interestExpense;
  return Number.isFinite(ratio) ? ratio : null;
}

/** Display formatting for the dimensionless coverage ratio. */
export function formatCoverageRatio(ratio: number): string {
  if (!Number.isFinite(ratio)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(ratio);
}
