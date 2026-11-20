import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Average Total Assets = (Beginning + Ending) / 2.
 * Both balances must be finite and ≥ 0.
 */
export function calculateAverageAssets(
  beginningAssets: number,
  endingAssets: number
): number | null {
  if (
    !Number.isFinite(beginningAssets) ||
    beginningAssets < 0 ||
    !Number.isFinite(endingAssets) ||
    endingAssets < 0
  ) {
    return null;
  }
  const average = beginningAssets / 2 + endingAssets / 2;
  return Number.isFinite(average) ? average : null;
}

/**
 * Total Asset Turnover = Revenue / Average Total Assets.
 * Null when average assets ≤ 0 (undefined — never Infinity).
 * Zero revenue with positive average → 0.
 */
export function calculateTotalAssetTurnover(
  revenue: number,
  averageAssets: number
): number | null {
  if (
    !Number.isFinite(revenue) ||
    revenue < 0 ||
    !Number.isFinite(averageAssets) ||
    averageAssets <= 0
  ) {
    return null;
  }
  const tat = revenue / averageAssets;
  return Number.isFinite(tat) ? tat : null;
}

export function interpretTotalAssetTurnover(
  tat: number | null,
  averageAssets: number,
  revenue: number | null,
  status: string
): string {
  if (status === 'zeroAverageAssets' || averageAssets <= 0) {
    return 'Total asset turnover is unavailable because average total assets must be greater than zero.';
  }
  if (revenue === null) {
    return 'Average assets calculated. Enter revenue to compute total asset turnover.';
  }
  if (tat === null || !Number.isFinite(tat)) {
    return 'Total asset turnover could not be determined from the inputs.';
  }
  if (tat === 0) {
    return 'Total asset turnover of 0.00× means no revenue was generated against a positive average asset base during the period.';
  }
  return `Total asset turnover of ${formatTat(tat)}× means about ${formatTat(tat)} of revenue per 1 of average total assets. This measures asset utilization, not profitability — compare with industry peers and the same reporting period.`;
}

export function formatTatMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatTat(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}
