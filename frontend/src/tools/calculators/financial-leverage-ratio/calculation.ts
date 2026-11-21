import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Total Assets = Current + Non-current. Both ≥ 0. */
export function calculateTotalAssets(
  currentAssets: number,
  nonCurrentAssets: number
): number | null {
  if (
    !Number.isFinite(currentAssets) ||
    currentAssets < 0 ||
    !Number.isFinite(nonCurrentAssets) ||
    nonCurrentAssets < 0
  ) {
    return null;
  }
  const total = currentAssets + nonCurrentAssets;
  return Number.isFinite(total) ? total : null;
}

/**
 * Financial Leverage (equity multiplier) = Total Assets / Total Equity.
 * Returns null when equity is 0 (undefined). Allows negative equity (signed ratio).
 */
export function calculateFinancialLeverage(
  totalAssets: number,
  totalEquity: number
): number | null {
  if (
    !Number.isFinite(totalAssets) ||
    totalAssets < 0 ||
    !Number.isFinite(totalEquity) ||
    totalEquity === 0
  ) {
    return null;
  }
  const fl = totalAssets / totalEquity;
  return Number.isFinite(fl) ? fl : null;
}

/** Total Liabilities = Assets − Equity. */
export function calculateTotalLiabilities(
  totalAssets: number,
  totalEquity: number
): number | null {
  if (
    !Number.isFinite(totalAssets) ||
    totalAssets < 0 ||
    !Number.isFinite(totalEquity)
  ) {
    return null;
  }
  const liab = totalAssets - totalEquity;
  return Number.isFinite(liab) ? liab : null;
}

/** Equity Ratio = Equity / Assets (as percent 0–100 scale for display helper). */
export function calculateEquityRatio(
  totalEquity: number,
  totalAssets: number
): number | null {
  if (
    !Number.isFinite(totalEquity) ||
    !Number.isFinite(totalAssets) ||
    totalAssets <= 0
  ) {
    return null;
  }
  const ratio = (totalEquity / totalAssets) * 100;
  return Number.isFinite(ratio) ? ratio : null;
}

/** Liabilities / Equity when equity ≠ 0. */
export function calculateLiabilitiesToEquity(
  totalLiabilities: number,
  totalEquity: number
): number | null {
  if (
    !Number.isFinite(totalLiabilities) ||
    !Number.isFinite(totalEquity) ||
    totalEquity === 0
  ) {
    return null;
  }
  const ratio = totalLiabilities / totalEquity;
  return Number.isFinite(ratio) ? ratio : null;
}

export function interpretFinancialLeverage(
  leverage: number | null,
  totalAssets: number,
  totalEquity: number,
  status: string
): string {
  if (status === 'zeroEquity' || totalEquity === 0) {
    return 'Financial leverage cannot be calculated when total equity is zero: the equity multiplier is undefined.';
  }
  if (leverage === null || !Number.isFinite(leverage)) {
    return 'Financial leverage could not be determined from the inputs.';
  }
  if (totalEquity < 0) {
    return `Negative equity produces a signed leverage of ${formatLeverage(leverage)}×. Conventional positive-ratio interpretations (for example “higher leverage means more assets per equity dollar”) are unreliable; review liabilities and financial position.`;
  }
  if (leverage === 1) {
    return 'Financial leverage of 1.00× indicates total assets equal book equity. Under a standard balance sheet with nonnegative liabilities, that implies no liabilities.';
  }
  if (leverage > 1) {
    return `Financial leverage of ${formatLeverage(leverage)}× means about ${formatLeverage(leverage)} dollars of assets per dollar of book equity. Higher values indicate more assets relative to the equity base and typically more liability financing; assess with debt structure, coverage, and industry norms.`;
  }
  if (leverage > 0 && leverage < 1) {
    return `Financial leverage of ${formatLeverage(leverage)}× is below 1 with positive equity. That is generally inconsistent with Assets = Liabilities + Equity when liabilities are nonnegative; review the inputs.`;
  }
  return `Financial leverage is ${formatLeverage(leverage)}× under the entered assumptions.`;
}

export function formatFlMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatLeverage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
