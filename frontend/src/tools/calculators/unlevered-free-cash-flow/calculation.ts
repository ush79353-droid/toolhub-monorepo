import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Unlevered free cash flow from EBIT:
 *   NOPAT = EBIT × (1 − ETR / 100)
 *   UFCF  = NOPAT + DA − CapEx − ΔWC
 *
 * Inputs must already be in one common currency. CapEx is positive spending.
 * Positive ΔWC is a cash outflow; negative ΔWC increases cash. Interest and
 * mandatory debt repayments are not deducted. Negative EBIT and negative UFCF
 * are allowed. Rejects non-finite inputs and ETR outside 0–100.
 */
export function calculateUnleveredFreeCashFlow(input: {
  ebit: number;
  etrPercent: number;
  da: number;
  capex: number;
  changeInWc: number;
}): { nopat: number; ufcf: number } | null {
  const { ebit, etrPercent, da, capex, changeInWc } = input;
  if (![ebit, etrPercent, da, capex, changeInWc].every(Number.isFinite)) {
    return null;
  }
  if (etrPercent < 0 || etrPercent > 100) {
    return null;
  }
  const nopat = ebit * (1 - etrPercent / 100);
  const ufcf = nopat + da - capex - changeInWc;
  if (![nopat, ufcf].every(Number.isFinite)) {
    return null;
  }
  return { nopat, ufcf };
}

/** Display rounding only — never used inside the formula. */
export function formatUfcfMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
