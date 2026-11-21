import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Simplified levered free cash flow:
 *   Levered FCF = EBITDA − CapEx − ΔWC − Debt repayments
 *
 * Inputs must already be in one common currency. CapEx and mandatory debt
 * repayments are treated as positive outflows. Negative ΔWC and negative
 * results are valid. This is not a complete FCFE model (EBITDA excludes cash
 * interest and taxes). Rejects non-finite inputs.
 */
export function calculateLeveredFreeCashFlow(input: {
  ebitda: number;
  capex: number;
  changeInWc: number;
  debtRepayments: number;
}): number | null {
  const { ebitda, capex, changeInWc, debtRepayments } = input;
  if (![ebitda, capex, changeInWc, debtRepayments].every(Number.isFinite)) {
    return null;
  }
  const leveredFcf = ebitda - capex - changeInWc - debtRepayments;
  return Number.isFinite(leveredFcf) ? leveredFcf : null;
}

/** Display rounding only — never used inside the formula. */
export function formatLeveredFcfMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
