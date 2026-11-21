/**
 * Cash Ratio = Cash and Cash Equivalents / Current Liabilities
 * Amounts must already share one currency. Ratio is dimensionless (shown as Nx).
 * Inventory and receivables are never included in the numerator.
 */
export function calculateCashRatio(
  cashAndEquivalents: number,
  currentLiabilities: number
): number | null {
  if (![cashAndEquivalents, currentLiabilities].every(Number.isFinite)) return null;
  if (cashAndEquivalents < 0) return null;
  if (!(currentLiabilities > 0)) return null;
  const ratio = cashAndEquivalents / currentLiabilities;
  return Number.isFinite(ratio) ? ratio : null;
}

/** Display multiple with trimmed trailing zeros (e.g. 0.75, 1.5, 0). */
export function formatCashRatioMultiple(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 1e10) / 1e10;
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  const text = rounded.toFixed(10).replace(/\.?0+$/, '');
  return text === '-0' ? '0' : text;
}
