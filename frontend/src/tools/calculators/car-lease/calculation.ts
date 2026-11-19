import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Standard money-factor car lease:
 *   Residual = MSRP × Residual Factor / 100
 *   Net Cap = Negotiated + Dealer Fee + Registration Fee − Down − Trade-in − Other
 *   Dep/mo = (Net Cap − Residual) / Months
 *   Lease fee/mo = (Net Cap + Residual) × Money Factor
 *   Base = Dep + Lease fee
 *   Tax/mo = Base × Sales Tax / 100
 *   Payment = Base + Tax
 *
 * Fees are assumed financed into cap cost. Tax is monthly on the base payment.
 * Rejects non-finite inputs, non-positive term, negative money amounts/rates outside
 * allowed ranges, and negative or non-finite payments (no silent clamping).
 */
export function calculateCarLease(input: {
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
  const {
    msrp,
    negotiatedPrice,
    leaseTermMonths,
    salesTaxPercent,
    residualFactorPercent,
    moneyFactor,
    dealerFee,
    registrationFee,
    downPayment,
    tradeInValue,
    otherReductions,
  } = input;

  if (
    ![
      msrp,
      negotiatedPrice,
      leaseTermMonths,
      salesTaxPercent,
      residualFactorPercent,
      moneyFactor,
      dealerFee,
      registrationFee,
      downPayment,
      tradeInValue,
      otherReductions,
    ].every(Number.isFinite)
  ) {
    return null;
  }

  if (!(leaseTermMonths > 0) || !Number.isInteger(leaseTermMonths)) return null;
  if (msrp < 0 || negotiatedPrice < 0) return null;
  if (
    dealerFee < 0 ||
    registrationFee < 0 ||
    downPayment < 0 ||
    tradeInValue < 0 ||
    otherReductions < 0
  ) {
    return null;
  }
  if (salesTaxPercent < 0) return null;
  if (residualFactorPercent < 0) return null;
  if (moneyFactor < 0) return null;

  const residualValue = (msrp * residualFactorPercent) / 100;
  const netCapitalizedCost =
    negotiatedPrice +
    dealerFee +
    registrationFee -
    downPayment -
    tradeInValue -
    otherReductions;

  if (!Number.isFinite(residualValue) || residualValue < 0) return null;
  if (!Number.isFinite(netCapitalizedCost)) return null;

  const monthlyDepreciation =
    (netCapitalizedCost - residualValue) / leaseTermMonths;
  const monthlyLeaseFee = (netCapitalizedCost + residualValue) * moneyFactor;
  const monthlyBasePayment = monthlyDepreciation + monthlyLeaseFee;
  const monthlySalesTax = (monthlyBasePayment * salesTaxPercent) / 100;
  const monthlyLeasePayment = monthlyBasePayment + monthlySalesTax;

  if (
    ![
      monthlyDepreciation,
      monthlyLeaseFee,
      monthlyBasePayment,
      monthlySalesTax,
      monthlyLeasePayment,
    ].every(Number.isFinite)
  ) {
    return null;
  }

  // Unsupported cases: negative payment components (do not clamp).
  if (
    monthlyDepreciation < 0 ||
    monthlyLeaseFee < 0 ||
    monthlyBasePayment < 0 ||
    monthlySalesTax < 0 ||
    monthlyLeasePayment < 0
  ) {
    return null;
  }

  return {
    netCapitalizedCost,
    residualValue,
    monthlyDepreciation,
    monthlyLeaseFee,
    monthlyBasePayment,
    monthlySalesTax,
    monthlyLeasePayment,
  };
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
