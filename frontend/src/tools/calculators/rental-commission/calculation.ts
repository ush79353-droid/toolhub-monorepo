import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Exact month fractions — not the rounded label percentages. */
export const HALF_MONTH_FRACTION = 0.5;
export const ONE_MONTH_FRACTION = 1;
export const ONE_HALF_MONTH_FRACTION = 1.5;

export function formatRentalCommissionMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/**
 * Core rental commission math in a single currency (full precision).
 * Preset fees use exact month fractions of monthly rent.
 * Custom fee uses annual rent × percent / 100.
 */
export function calculateRentalCommission(input: {
  annualRent: number;
  monthlyRent: number;
  customPercent: number;
}): {
  halfMonth: number;
  oneMonth: number;
  oneHalfMonth: number;
  customAmount: number;
} | null {
  const { annualRent, monthlyRent, customPercent } = input;
  if (![annualRent, monthlyRent, customPercent].every(Number.isFinite)) return null;
  if (annualRent < 0 || monthlyRent < 0 || customPercent < 0) return null;

  const halfMonth = monthlyRent * HALF_MONTH_FRACTION;
  const oneMonth = monthlyRent * ONE_MONTH_FRACTION;
  const oneHalfMonth = monthlyRent * ONE_HALF_MONTH_FRACTION;
  const customAmount = (annualRent * customPercent) / 100;

  if (![halfMonth, oneMonth, oneHalfMonth, customAmount].every(Number.isFinite)) {
    return null;
  }

  return { halfMonth, oneMonth, oneHalfMonth, customAmount };
}

export function annualFromMonthly(monthlyRent: number): number {
  return monthlyRent * 12;
}

export function monthlyFromAnnual(annualRent: number): number {
  return annualRent / 12;
}
