import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * UI scaffold placeholder — real money-factor lease math lands in the engine commit.
 * Returns null so the form can render empty results until formulas are wired.
 */
export function calculateCarLease(_input: {
  msrp: number;
  negotiatedPrice: number;
  leaseTermMonths: number;
  salesTaxPercent: number;
  residualFactorPercent: number;
  moneyFactor: number;
  dealerFee: number;
  registrationFee: number;
  downPayment: number;
  tradeInValue: number;
  otherReductions: number;
}): {
  netCapitalizedCost: number;
  residualValue: number;
  monthlyDepreciation: number;
  monthlyLeaseFee: number;
  monthlyBasePayment: number;
  monthlySalesTax: number;
  monthlyLeasePayment: number;
} | null {
  return null;
}

/** Display rounding only — never used inside the formulas. */
export function formatCarLeaseMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
