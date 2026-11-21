/**
 * Net Profit Margin (%) = (Net Profit / Total Revenues) × 100
 * Amounts must already share one currency. Full IEEE precision; never NaN/Infinity.
 * Negative net profit and margin are allowed. Zero net profit → 0% when revenues > 0.
 * Total revenues must be strictly greater than zero.
 */
export function calculateNetProfitMargin(input: {
  netProfit: number;
  totalRevenues: number;
}): { marginPercent: number } | null {
  const { netProfit, totalRevenues } = input;
  if (![netProfit, totalRevenues].every(Number.isFinite)) return null;
  if (!(totalRevenues > 0)) return null;

  const marginPercent = (netProfit / totalRevenues) * 100;
  if (!Number.isFinite(marginPercent)) return null;

  return { marginPercent };
}

export function formatNetProfitMarginPercent(percent: number): string {
  if (!Number.isFinite(percent)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(percent);
}

export function shareResultText(params: {
  title: string;
  netProfitLabel: string;
  totalRevenuesLabel: string;
  marginPercent: string;
  currencyNote: string;
}): string {
  return [
    `${params.title} | Omega Calculators`,
    `Net profit: ${params.netProfitLabel}`,
    `Total revenues: ${params.totalRevenuesLabel}`,
    `Net profit margin: ${params.marginPercent}%`,
    params.currencyNote,
  ].join('\n');
}
