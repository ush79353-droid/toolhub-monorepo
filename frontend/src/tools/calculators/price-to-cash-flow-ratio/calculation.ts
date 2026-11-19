import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export function formatPriceCashFlowMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Display rounding for the dimensionless P/CF multiple (not used in math). */
export function formatPriceToCashFlowRatio(ratio: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(ratio);
}

/**
 * Cash Flow per Share = Cash Flow / Shares Outstanding
 * Price to Cash Flow = Price per Share / Cash Flow per Share
 *
 * Inputs must already be in one common currency. Returns full-precision values.
 * When CFPS is exactly 0, ratio is undefined (not Infinity).
 * Negative cash flow is allowed; nonnegative price required when computing ratio.
 */
export function calculatePriceToCashFlow(input: {
  cashFlow: number;
  sharesOutstanding: number;
  pricePerShare?: number | null;
}): {
  cashFlowPerShare: number;
  priceToCashFlowRatio: number | null;
  ratioUndefined: boolean;
} | null {
  const { cashFlow, sharesOutstanding, pricePerShare } = input;

  if (![cashFlow, sharesOutstanding].every(Number.isFinite)) {
    return null;
  }
  if (!(sharesOutstanding > 0)) {
    return null;
  }

  const cashFlowPerShare = cashFlow / sharesOutstanding;
  if (!Number.isFinite(cashFlowPerShare)) {
    return null;
  }

  if (cashFlowPerShare === 0) {
    return {
      cashFlowPerShare,
      priceToCashFlowRatio: null,
      ratioUndefined: true,
    };
  }

  if (pricePerShare === undefined || pricePerShare === null) {
    return {
      cashFlowPerShare,
      priceToCashFlowRatio: null,
      ratioUndefined: false,
    };
  }

  if (!Number.isFinite(pricePerShare) || pricePerShare < 0) {
    return null;
  }

  const priceToCashFlowRatio = pricePerShare / cashFlowPerShare;
  if (!Number.isFinite(priceToCashFlowRatio)) {
    return null;
  }

  return {
    cashFlowPerShare,
    priceToCashFlowRatio,
    ratioUndefined: false,
  };
}
