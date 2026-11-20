import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { PmiApplicability } from './types';

export function calculateDownPaymentAmount(
  homePrice: number,
  downPaymentPercentage: number
): number | null {
  if (
    !Number.isFinite(homePrice) ||
    !Number.isFinite(downPaymentPercentage) ||
    homePrice <= 0 ||
    downPaymentPercentage < 0 ||
    downPaymentPercentage > 100
  ) {
    return null;
  }
  const amount = homePrice * (downPaymentPercentage / 100);
  return Number.isFinite(amount) ? amount : null;
}

export function calculateDownPaymentPercentage(
  homePrice: number,
  downPaymentAmount: number
): number | null {
  if (
    !Number.isFinite(homePrice) ||
    !Number.isFinite(downPaymentAmount) ||
    homePrice <= 0 ||
    downPaymentAmount < 0 ||
    downPaymentAmount > homePrice
  ) {
    return null;
  }
  const pct = (downPaymentAmount / homePrice) * 100;
  return Number.isFinite(pct) ? pct : null;
}

export function calculateMortgageAmount(
  homePrice: number,
  downPaymentAmount: number
): number | null {
  if (
    !Number.isFinite(homePrice) ||
    !Number.isFinite(downPaymentAmount) ||
    homePrice <= 0 ||
    downPaymentAmount < 0 ||
    downPaymentAmount > homePrice
  ) {
    return null;
  }
  const loan = homePrice - downPaymentAmount;
  return Number.isFinite(loan) ? loan : null;
}

export function calculateLoanToValueRatio(
  mortgageAmount: number,
  homePrice: number
): number | null {
  if (
    !Number.isFinite(mortgageAmount) ||
    !Number.isFinite(homePrice) ||
    homePrice <= 0 ||
    mortgageAmount < 0
  ) {
    return null;
  }
  const ltv = (mortgageAmount / homePrice) * 100;
  return Number.isFinite(ltv) ? ltv : null;
}

/** Annual PMI = Loan Amount × (Annual PMI Rate / 100). */
export function calculateAnnualPmi(
  mortgageAmount: number,
  annualPmiRatePercent: number
): number | null {
  if (
    !Number.isFinite(mortgageAmount) ||
    !Number.isFinite(annualPmiRatePercent) ||
    mortgageAmount < 0 ||
    annualPmiRatePercent < 0
  ) {
    return null;
  }
  const annual = mortgageAmount * (annualPmiRatePercent / 100);
  return Number.isFinite(annual) ? annual : null;
}

/** Monthly PMI = Annual PMI / 12. */
export function calculateMonthlyPmi(annualPmi: number): number | null {
  if (!Number.isFinite(annualPmi) || annualPmi < 0) return null;
  const monthly = annualPmi / 12;
  return Number.isFinite(monthly) ? monthly : null;
}

/**
 * Simplified conventional purchase-loan guideline:
 * LTV > 80% → PMI may be required; LTV ≤ 80% → often not required.
 * Not a universal underwriting rule.
 */
export function evaluatePmiApplicability(
  loanToValueRatio: number
): PmiApplicability {
  if (!Number.isFinite(loanToValueRatio) || loanToValueRatio < 0) {
    return 'unknown';
  }
  if (loanToValueRatio > 80) return 'mayBeRequired';
  return 'generallyNotRequired';
}

export function pmiApplicabilityMessage(
  applicability: PmiApplicability
): string {
  switch (applicability) {
    case 'mayBeRequired':
      return 'Under a simplified conventional purchase-loan guideline (LTV above 80%), borrower-paid PMI may be required. Actual requirements depend on the lender and loan product.';
    case 'generallyNotRequired':
      return 'Under a simplified conventional purchase-loan guideline (LTV at or below 80%), borrower-paid PMI is often not required. This is not a universal exemption.';
    default:
      return 'Enter a valid home price and down payment to see simplified PMI applicability guidance.';
  }
}

export function formatPmiMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatPmiPercent(value: number, digits = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}
