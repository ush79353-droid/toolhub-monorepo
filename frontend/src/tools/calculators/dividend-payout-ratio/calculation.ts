/**
 * Dividend payout ratio formulas (full precision; round only for display).
 *
 * Company:  payout % = totalDividends / netIncome × 100
 * Per share: payout % = declaredDps / dilutedEps × 100
 *
 * Zero denominator → undefined (null), never 0%.
 * Above 100% and negative ratios are mathematically valid.
 */

/** Display rounding for payout percent (not used in math). */
export function formatPayoutPercent(percent: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(percent);
}

/**
 * Company dividend payout ratio (%).
 * Returns null when netIncome is zero or inputs are non-finite.
 */
export function calculateCompanyPayoutRatio(input: {
  totalDividends: number;
  netIncome: number;
}): number | null {
  const { totalDividends, netIncome } = input;
  if (![totalDividends, netIncome].every(Number.isFinite)) {
    return null;
  }
  if (netIncome === 0) {
    return null;
  }
  const percent = (totalDividends / netIncome) * 100;
  return Number.isFinite(percent) ? percent : null;
}

/**
 * Per-share dividend payout ratio (%).
 * Returns null when dilutedEps is zero or inputs are non-finite.
 */
export function calculatePerSharePayoutRatio(input: {
  declaredDps: number;
  dilutedEps: number;
}): number | null {
  const { declaredDps, dilutedEps } = input;
  if (![declaredDps, dilutedEps].every(Number.isFinite)) {
    return null;
  }
  if (dilutedEps === 0) {
    return null;
  }
  const percent = (declaredDps / dilutedEps) * 100;
  return Number.isFinite(percent) ? percent : null;
}
