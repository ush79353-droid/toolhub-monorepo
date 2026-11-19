/**
 * Cash Flow to Debt Ratio (%) = Operating Cash Flow / Total Debt × 100
 * Negative OCF allowed. Total debt must be ≥ 0. Zero debt → undefined (not Infinity).
 */
export function calculateCashFlowToDebtPercent(
  operatingCashFlow: number,
  totalDebt: number
): number | null {
  if (![operatingCashFlow, totalDebt].every(Number.isFinite)) return null;
  if (totalDebt < 0) return null;
  if (totalDebt === 0) return null;
  const percent = (operatingCashFlow / totalDebt) * 100;
  return Number.isFinite(percent) ? percent : null;
}

/**
 * Debt to Cash Flow Ratio = Total Debt / Operating Cash Flow (dimensionless multiple).
 * Zero OCF → undefined. Negative OCF yields a negative multiple when debt &gt; 0.
 */
export function calculateDebtToCashFlowRatio(
  totalDebt: number,
  operatingCashFlow: number
): number | null {
  if (![totalDebt, operatingCashFlow].every(Number.isFinite)) return null;
  if (totalDebt < 0) return null;
  if (operatingCashFlow === 0) return null;
  const ratio = totalDebt / operatingCashFlow;
  return Number.isFinite(ratio) ? ratio : null;
}

/** Total Debt = Short-term Debt + Long-term Debt (same currency). */
export function sumDebtComponents(
  shortTermDebt: number,
  longTermDebt: number
): number | null {
  if (![shortTermDebt, longTermDebt].every(Number.isFinite)) return null;
  if (shortTermDebt < 0 || longTermDebt < 0) return null;
  const total = shortTermDebt + longTermDebt;
  return Number.isFinite(total) ? total : null;
}

export function formatRatioPercent(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 1e10) / 1e10;
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  const text = rounded.toFixed(10).replace(/\.?0+$/, '');
  return text === '-0' ? '0' : text;
}

export function formatDebtMultiple(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 1e10) / 1e10;
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  const text = rounded.toFixed(10).replace(/\.?0+$/, '');
  return text === '-0' ? '0' : text;
}
