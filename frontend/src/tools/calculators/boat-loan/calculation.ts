import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { TermUnit } from './types';

export function formatBoatLoanMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Normalize loan term into monthly payment count. */
export function termToPaymentCount(term: number, unit: TermUnit): number | null {
  if (!Number.isFinite(term) || term <= 0) return null;
  const months = unit === 'yrs' ? term * 12 : term;
  if (!Number.isFinite(months) || months <= 0) return null;
  return months;
}

/**
 * Fixed-rate amortizing monthly payment.
 * r = APR/100/12; M = P × r / (1 − (1+r)^(-n)); when r = 0, M = P / n.
 */
export function calculateMonthlyPayment(input: {
  principal: number;
  annualRatePercent: number;
  paymentCount: number;
}): number | null {
  const { principal, annualRatePercent, paymentCount } = input;
  if (![principal, annualRatePercent, paymentCount].every(Number.isFinite)) {
    return null;
  }
  if (principal <= 0 || paymentCount <= 0 || annualRatePercent < 0) return null;

  const r = annualRatePercent / 100 / 12;
  let payment: number;
  if (r === 0) {
    payment = principal / paymentCount;
  } else {
    const factor = Math.pow(1 + r, -paymentCount);
    if (!Number.isFinite(factor)) return null;
    const denom = 1 - factor;
    if (!(denom > 0)) return null;
    payment = (principal * r) / denom;
  }

  return Number.isFinite(payment) ? payment : null;
}

/** Total interest = (M × n) − P using full-precision M. */
export function calculateTotalInterest(input: {
  principal: number;
  monthlyPayment: number;
  paymentCount: number;
}): number | null {
  const { principal, monthlyPayment, paymentCount } = input;
  if (![principal, monthlyPayment, paymentCount].every(Number.isFinite)) {
    return null;
  }
  const interest = monthlyPayment * paymentCount - principal;
  return Number.isFinite(interest) ? interest : null;
}
