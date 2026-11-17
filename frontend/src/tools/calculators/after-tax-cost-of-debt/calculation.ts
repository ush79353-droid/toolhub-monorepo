/**
 * After-tax cost of debt helpers (pure).
 * Tax rate from incomes is an effective estimate, not a statutory marginal bracket.
 */

/** Marginal Tax Rate (%) = (1 − Net Income / Pre-tax Income) × 100 */
export function calculateMarginalTaxRatePercent(
  netIncome: number,
  pretaxIncome: number
): number | null {
  if (![netIncome, pretaxIncome].every(Number.isFinite)) return null;
  if (!(pretaxIncome > 0) && pretaxIncome !== 0) return null;
  if (pretaxIncome === 0) return null;
  const rate = (1 - netIncome / pretaxIncome) * 100;
  return Number.isFinite(rate) ? rate : null;
}

/** After-tax Cost of Debt (%) = Cost of Debt (%) × (1 − Tax Rate (%) / 100) */
export function calculateAfterTaxCostOfDebtPercent(
  costOfDebtPercent: number,
  taxRatePercent: number
): number | null {
  if (![costOfDebtPercent, taxRatePercent].every(Number.isFinite)) return null;
  const after = costOfDebtPercent * (1 - taxRatePercent / 100);
  return Number.isFinite(after) ? after : null;
}

/** Display percent with up to 6 meaningful decimals; trim trailing zeros. */
export function formatPercentValue(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 1e10) / 1e10;
  const text = rounded.toFixed(10).replace(/\.?0+$/, '');
  return text === '-0' ? '0' : text;
}
