import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Total Debt = Long-term Debt + Short-term Debt
 * Amounts must already share one currency.
 */
export function calculateTotalDebt(
  longTermDebt: number,
  shortTermDebt: number
): number | null {
  if (![longTermDebt, shortTermDebt].every(Number.isFinite)) return null;
  const total = longTermDebt + shortTermDebt;
  return Number.isFinite(total) ? total : null;
}

/**
 * Debt to Assets Ratio (%) = (Total Debt / Total Assets) × 100
 * Requires positive total assets. Zero debt → 0%. No artificial cap above 100%.
 */
export function calculateDebtToAssetsRatioPercent(
  totalDebt: number,
  totalAssets: number
): number | null {
  if (![totalDebt, totalAssets].every(Number.isFinite)) return null;
  if (!(totalAssets > 0)) return null;
  const ratio = (totalDebt / totalAssets) * 100;
  return Number.isFinite(ratio) ? ratio : null;
}

/** Display money (no currency symbol — symbol is shown beside the field). */
export function formatDebtMoneyAmount(
  amount: number,
  currency: SupportedCurrency
): string {
  if (!Number.isFinite(amount)) return '';
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Display percent with up to 6 meaningful decimals; trim trailing zeros. */
export function formatRatioPercent(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 1e10) / 1e10;
  const text = rounded.toFixed(10).replace(/\.?0+$/, '');
  return text === '-0' ? '0' : text;
}
