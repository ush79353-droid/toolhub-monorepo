import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { paymentsPerYear, type PaymentFrequency } from './types';

export function formatLandLoanMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatLandLoanPercent(value: number): string {
  if (!Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(value);
}

/**
 * Whole payment count from years + months and frequency.
 * Monthly: N = 12Y + M.
 * Otherwise: N = (12Y + M) × f / 12, required to be a positive whole number.
 */
export function calculateNumberOfPayments(input: {
  termYears: number;
  termMonths: number;
  paymentFrequency: PaymentFrequency;
}): number | null {
  const { termYears: Y, termMonths: M, paymentFrequency } = input;
  if (![Y, M].every(Number.isFinite)) return null;
  if (Y < 0 || M < 0 || M > 11) return null;
  if (!(Y > 0 || M > 0)) return null;

  const totalMonths = 12 * Y + M;
  const f = paymentsPerYear(paymentFrequency);
  if (!(f > 0)) return null;

  if (paymentFrequency === 'monthly') {
    return totalMonths > 0 ? totalMonths : null;
  }

  const raw = (totalMonths * f) / 12;
  const n = Math.round(raw);
  if (!(n > 0) || Math.abs(raw - n) > 1e-9) return null;
  return n;
}

/**
 * Fixed-rate amortizing payment.
 * r = APR/(100×f); Payment = P×r/(1−(1+r)^(-N)); when r = 0, Payment = P/N.
 */
export function calculateLandLoanAmortization(input: {
  landValue: number;
  downPaymentPercent: number;
  annualRatePercent: number;
  termYears: number;
  termMonths: number;
  paymentFrequency: PaymentFrequency;
}): {
  downPayment: number;
  loanValue: number;
  numberOfPayments: number;
  periodicRatePercent: number;
  periodicPayment: number;
  totalPayment: number;
  totalInterest: number;
} | null {
  const {
    landValue: L,
    downPaymentPercent,
    annualRatePercent: APR,
    termYears,
    termMonths,
    paymentFrequency,
  } = input;

  if (![L, downPaymentPercent, APR, termYears, termMonths].every(Number.isFinite)) {
    return null;
  }
  if (!(L > 0) || downPaymentPercent < 0 || downPaymentPercent > 100 || APR < 0) {
    return null;
  }

  const downPayment = L * (downPaymentPercent / 100);
  const loanValue = L - downPayment;
  if (!(loanValue >= 0) || !Number.isFinite(loanValue)) return null;

  const numberOfPayments = calculateNumberOfPayments({
    termYears,
    termMonths,
    paymentFrequency,
  });
  if (numberOfPayments === null) return null;

  const f = paymentsPerYear(paymentFrequency);
  const periodicRatePercent = APR / f;
  const r = APR / (100 * f);

  let periodicPayment: number;
  if (loanValue === 0) {
    periodicPayment = 0;
  } else if (r === 0) {
    periodicPayment = loanValue / numberOfPayments;
  } else {
    const factor = Math.pow(1 + r, -numberOfPayments);
    if (!Number.isFinite(factor)) return null;
    const denom = 1 - factor;
    if (!(denom > 0)) return null;
    periodicPayment = (loanValue * r) / denom;
  }

  if (!Number.isFinite(periodicPayment)) return null;

  const totalPayment = periodicPayment * numberOfPayments;
  const totalInterest = totalPayment - loanValue;
  if (![totalPayment, totalInterest, periodicRatePercent].every(Number.isFinite)) {
    return null;
  }

  return {
    downPayment,
    loanValue,
    numberOfPayments,
    periodicRatePercent,
    periodicPayment,
    totalPayment,
    totalInterest,
  };
}
