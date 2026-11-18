/**
 * TIE Ratio = EBIT / Total Interest
 * Both amounts must already be in the same currency.
 * Preserves full IEEE precision; never returns NaN or Infinity.
 */
export function calculateTimesInterestEarned(input: {
  ebit: number;
  totalInterest: number;
}): number | null {
  const { ebit, totalInterest } = input;

  if (![ebit, totalInterest].every(Number.isFinite)) return null;
  if (!(totalInterest > 0)) return null;

  const ratio = ebit / totalInterest;
  return Number.isFinite(ratio) ? ratio : null;
}

/** Display formatting for the dimensionless TIE ratio. */
export function formatTieRatio(ratio: number): string {
  if (!Number.isFinite(ratio)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(ratio);
}
