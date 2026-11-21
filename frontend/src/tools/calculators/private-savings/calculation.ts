import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Private savings identity:
 *   Sp = Y − T − C
 *
 * Inputs must already be in one common currency. Returns full-precision Sp.
 * Zero and negative results (dissaving) are valid. Rejects non-finite inputs.
 */
export function calculatePrivateSavings(input: {
  totalIncome: number;
  taxes: number;
  consumption: number;
}): number | null {
  const { totalIncome, taxes, consumption } = input;
  if (![totalIncome, taxes, consumption].every(Number.isFinite)) {
    return null;
  }
  const privateSavings = totalIncome - taxes - consumption;
  return Number.isFinite(privateSavings) ? privateSavings : null;
}

/** Display rounding only — never used inside the identity. */
export function formatPrivateSavingsMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
