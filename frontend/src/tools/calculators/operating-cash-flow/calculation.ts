import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Indirect-method working-capital cash adjustment.
 * Balance changes use ending − beginning:
 *   WC adj = −ΔInventories − ΔAR + ΔAP + ΔIncome tax payable
 *
 * Rejects non-finite inputs. Negative adjustments are valid.
 */
export function calculateWorkingCapitalCashAdjustment(input: {
  changeInInventories: number;
  changeInAr: number;
  changeInAp: number;
  changeInIncomeTaxPayable: number;
}): number | null {
  const {
    changeInInventories,
    changeInAr,
    changeInAp,
    changeInIncomeTaxPayable,
  } = input;
  if (
    ![
      changeInInventories,
      changeInAr,
      changeInAp,
      changeInIncomeTaxPayable,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  const adj =
    -changeInInventories -
    changeInAr +
    changeInAp +
    changeInIncomeTaxPayable;
  return Number.isFinite(adj) ? adj : null;
}

/**
 * Indirect-method operating cash flow.
 * Inputs must already be in one common currency.
 *   OCF = NI + Depreciation + Amortization + WC cash adj + Net other
 *
 * WC cash adj should already follow −ΔInv −ΔAR +ΔAP +ΔTax payable.
 * Negative OCF is valid. Rejects non-finite inputs.
 */
export function calculateOperatingCashFlow(input: {
  netIncome: number;
  depreciation: number;
  amortization: number;
  workingCapitalCashAdjustment: number;
  netOtherCashFlows: number;
}): number | null {
  const {
    netIncome,
    depreciation,
    amortization,
    workingCapitalCashAdjustment,
    netOtherCashFlows,
  } = input;
  if (
    ![
      netIncome,
      depreciation,
      amortization,
      workingCapitalCashAdjustment,
      netOtherCashFlows,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  const ocf =
    netIncome +
    depreciation +
    amortization +
    workingCapitalCashAdjustment +
    netOtherCashFlows;
  return Number.isFinite(ocf) ? ocf : null;
}

/** Display rounding only — never used inside the formulas. */
export function formatOcfMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
