/**
 * EBITDA Margin (%) = (EBITDA / Total Revenues) × 100
 * Both amounts must already be in the same currency.
 * Preserves full IEEE precision; never returns NaN or Infinity.
 * Negative EBITDA (and negative margin) are allowed.
 */
export function calculateEbitdaMargin(input: {
  ebitda: number;
  totalRevenues: number;
}): number | null {
  const { ebitda, totalRevenues } = input;

  if (![ebitda, totalRevenues].every(Number.isFinite)) return null;
  if (!(totalRevenues !== 0)) return null;

  const margin = (ebitda / totalRevenues) * 100;
  return Number.isFinite(margin) ? margin : null;
}

/** Display formatting for the EBITDA margin percent. */
export function formatEbitdaMarginPercent(percent: number): string {
  if (!Number.isFinite(percent)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(percent);
}
