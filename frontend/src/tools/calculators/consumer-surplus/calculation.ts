import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** CS = WTP − P. Prices must be finite and ≥ 0. Signed difference returned as-is. */
export function calculateConsumerSurplus(
  willingPrice: number,
  actualPrice: number
): number | null {
  if (
    !Number.isFinite(willingPrice) ||
    willingPrice < 0 ||
    !Number.isFinite(actualPrice) ||
    actualPrice < 0
  ) {
    return null;
  }
  const cs = willingPrice - actualPrice;
  return Number.isFinite(cs) ? cs : null;
}

/** WTP = CS + P */
export function calculateWillingnessToPay(
  actualPrice: number,
  consumerSurplus: number
): number | null {
  if (
    !Number.isFinite(actualPrice) ||
    actualPrice < 0 ||
    !Number.isFinite(consumerSurplus)
  ) {
    return null;
  }
  const wtp = consumerSurplus + actualPrice;
  return Number.isFinite(wtp) ? wtp : null;
}

/** P = WTP − CS */
export function calculateActualPrice(
  willingPrice: number,
  consumerSurplus: number
): number | null {
  if (
    !Number.isFinite(willingPrice) ||
    willingPrice < 0 ||
    !Number.isFinite(consumerSurplus)
  ) {
    return null;
  }
  const price = willingPrice - consumerSurplus;
  return Number.isFinite(price) ? price : null;
}

/**
 * Savings % relative to WTP = (WTP − P) / WTP × 100.
 * Only when WTP > 0. Not a retail-list discount unless WTP equals list price.
 */
export function calculateSurplusPercentage(
  willingPrice: number,
  actualPrice: number
): number | null {
  if (
    !Number.isFinite(willingPrice) ||
    willingPrice <= 0 ||
    !Number.isFinite(actualPrice) ||
    actualPrice < 0
  ) {
    return null;
  }
  const pct = ((willingPrice - actualPrice) / willingPrice) * 100;
  return Number.isFinite(pct) ? pct : null;
}

export function formatCsMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
