import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Enterprise Value = Market Cap + Total Debt + Minority Interest + Preferred Shares − Cash
 * EV to Sales = Enterprise Value / Sales
 *
 * Inputs must already share one calculation currency. Full precision.
 * Sales must be > 0 for a defined ratio; sales === 0 → undefined (not Infinity).
 * Negative EV is allowed.
 */
export function calculateEvToSales(input: {
  marketCap: number;
  totalDebt: number;
  minorityInterest: number;
  preferredShares: number;
  cash: number;
  sales: number;
}): {
  enterpriseValue: number;
  evToSales: number | null;
  ratioUndefined: boolean;
} | null {
  const {
    marketCap,
    totalDebt,
    minorityInterest,
    preferredShares,
    cash,
    sales,
  } = input;

  if (
    ![
      marketCap,
      totalDebt,
      minorityInterest,
      preferredShares,
      cash,
      sales,
    ].every(Number.isFinite)
  ) {
    return null;
  }

  const enterpriseValue =
    marketCap + totalDebt + minorityInterest + preferredShares - cash;
  if (!Number.isFinite(enterpriseValue)) return null;

  if (sales === 0) {
    return { enterpriseValue, evToSales: null, ratioUndefined: true };
  }
  if (!(sales > 0)) {
    return null;
  }

  const evToSales = enterpriseValue / sales;
  if (!Number.isFinite(evToSales)) return null;

  return { enterpriseValue, evToSales, ratioUndefined: false };
}

export function formatEvMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatEvToSalesRatio(ratio: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(ratio);
}
