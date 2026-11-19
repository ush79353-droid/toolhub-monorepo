/**
 * Return on Sales (%) = (Operating Profit / Net Sales) × 100
 * Amounts must already share one currency. Full IEEE precision; never NaN/Infinity.
 * Negative operating profit and ROS are allowed. Zero operating profit → 0% when sales > 0.
 * Net sales must be strictly greater than zero (zero sales → undefined, not 0%).
 */
export function calculateReturnOnSales(input: {
  operatingProfit: number;
  netSales: number;
}): { rosPercent: number } | null {
  const { operatingProfit, netSales } = input;
  if (![operatingProfit, netSales].every(Number.isFinite)) return null;
  if (!(netSales > 0)) return null;

  const rosPercent = (operatingProfit / netSales) * 100;
  if (!Number.isFinite(rosPercent)) return null;

  return { rosPercent };
}

export function formatReturnOnSalesPercent(percent: number): string {
  if (!Number.isFinite(percent)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(percent);
}

export function shareResultText(params: {
  title: string;
  operatingProfitLabel: string;
  netSalesLabel: string;
  rosPercent: string;
  currencyNote: string;
}): string {
  return [
    `${params.title} — Omega Calculators`,
    `Operating profit: ${params.operatingProfitLabel}`,
    `Net sales: ${params.netSalesLabel}`,
    `Return on sales: ${params.rosPercent}%`,
    params.currencyNote,
  ].join('\n');
}
