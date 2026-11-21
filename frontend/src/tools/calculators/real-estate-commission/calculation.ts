import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Real estate commission (flat percent of sale price):
 *   Commission Amount = House Price × Commission Rate / 100
 *   Owner Receives    = House Price − Commission Amount
 *
 * Inputs must already share one currency. Commission rate is a percent (0–100).
 * Returns full-precision amounts. Rejects non-finite inputs. Zero commission is valid.
 */
export function calculateRealEstateCommission(input: {
  housePrice: number;
  commissionPercent: number;
}): { commissionAmount: number; ownerReceives: number } | null {
  const { housePrice, commissionPercent } = input;
  if (![housePrice, commissionPercent].every(Number.isFinite)) {
    return null;
  }
  if (housePrice < 0) return null;
  if (commissionPercent < 0 || commissionPercent > 100) return null;

  const commissionAmount = (housePrice * commissionPercent) / 100;
  const ownerReceives = housePrice - commissionAmount;

  if (![commissionAmount, ownerReceives].every(Number.isFinite)) {
    return null;
  }

  return { commissionAmount, ownerReceives };
}

/** Display rounding only — never used inside the formulas. */
export function formatRealEstateCommissionMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
