import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { FHA_UPFRONT_MIP_RATE } from './types';

export function formatFhaMoney(amount: number, currency: SupportedCurrency): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatFhaPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  }).format(value);
}

/** Level amortizing monthly payment on principal P. */
export function calculateMonthlyMortgagePayment(input: {
  principal: number;
  annualRatePercent: number;
  paymentCount: number;
}): number | null {
  const { principal, annualRatePercent, paymentCount } = input;
  if (![principal, annualRatePercent, paymentCount].every(Number.isFinite)) {
    return null;
  }
  if (!(principal > 0) || !(paymentCount > 0) || annualRatePercent < 0) return null;

  const r = annualRatePercent / 100 / 12;
  if (r === 0) {
    const m = principal / paymentCount;
    return Number.isFinite(m) ? m : null;
  }
  const denom = 1 - Math.pow(1 + r, -paymentCount);
  if (!(denom > 0)) return null;
  const m = (principal * r) / denom;
  return Number.isFinite(m) ? m : null;
}

export interface FhaLoanCanonical {
  totalDownPayment: number;
  baseLoanAmount: number;
  upfrontMip: number;
  monthlyMortgagePayment: number;
  monthlyMip: number;
  totalFhaLoanAmount: number;
  totalMonthlyPayment: number;
  totalCostOfLoan: number;
  periodicInterestRatePercent: number;
  numberOfPayments: number;
}

/**
 * FHA simplified reference model:
 * - Upfront MIP = Base × 1.75% (fixed, non-editable)
 * - Monthly mortgage amortizes BASE loan only (not base + upfront)
 * - Monthly MIP = Base × annual MIP / 12
 * - Total cost = total monthly × n (aggregate mortgage + MIP payments)
 */
export function calculateFhaLoanCanonical(input: {
  homePrice: number;
  downPaymentPercent: number;
  loanTermYears: number;
  interestRatePercent: number;
  annualMipPercent: number;
}): FhaLoanCanonical | null {
  const {
    homePrice,
    downPaymentPercent,
    loanTermYears,
    interestRatePercent,
    annualMipPercent,
  } = input;

  if (
    ![
      homePrice,
      downPaymentPercent,
      loanTermYears,
      interestRatePercent,
      annualMipPercent,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(homePrice > 0)) return null;
  if (!(downPaymentPercent >= 0) || !(downPaymentPercent < 100)) return null;
  if (!(loanTermYears > 0)) return null;
  if (interestRatePercent < 0 || annualMipPercent < 0) return null;

  const totalDownPayment = homePrice * (downPaymentPercent / 100);
  const baseLoanAmount = homePrice - totalDownPayment;
  if (!(baseLoanAmount > 0)) return null;

  const upfrontMip = baseLoanAmount * FHA_UPFRONT_MIP_RATE;
  const totalFhaLoanAmount = baseLoanAmount + upfrontMip;
  const numberOfPayments = Math.round(loanTermYears * 12);
  if (!(numberOfPayments > 0)) return null;

  const monthlyMortgagePayment = calculateMonthlyMortgagePayment({
    principal: baseLoanAmount,
    annualRatePercent: interestRatePercent,
    paymentCount: numberOfPayments,
  });
  if (monthlyMortgagePayment === null) return null;

  const monthlyMip = (baseLoanAmount * (annualMipPercent / 100)) / 12;
  if (!Number.isFinite(monthlyMip)) return null;

  const totalMonthlyPayment = monthlyMortgagePayment + monthlyMip;
  const totalCostOfLoan = totalMonthlyPayment * numberOfPayments;
  const periodicInterestRatePercent = interestRatePercent / 12;

  if (
    ![
      totalDownPayment,
      baseLoanAmount,
      upfrontMip,
      monthlyMortgagePayment,
      monthlyMip,
      totalFhaLoanAmount,
      totalMonthlyPayment,
      totalCostOfLoan,
      periodicInterestRatePercent,
    ].every(Number.isFinite)
  ) {
    return null;
  }

  return {
    totalDownPayment,
    baseLoanAmount,
    upfrontMip,
    monthlyMortgagePayment,
    monthlyMip,
    totalFhaLoanAmount,
    totalMonthlyPayment,
    totalCostOfLoan,
    periodicInterestRatePercent,
    numberOfPayments,
  };
}
