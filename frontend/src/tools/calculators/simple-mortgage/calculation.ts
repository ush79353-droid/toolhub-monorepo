import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { TermUnit } from './types';

export function formatSimpleMortgageMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** n = years × 12, or months when unit is mos. */
export function termToPaymentCount(
  term: number,
  unit: TermUnit
): number | null {
  if (!Number.isFinite(term) || !(term > 0)) return null;
  const n = unit === 'yrs' ? term * 12 : term;
  if (!Number.isFinite(n) || !(n > 0)) return null;
  if (unit === 'mos' && !Number.isInteger(term)) return null;
  return n;
}

/**
 * Fixed-rate monthly amortizing payment.
 * r = APR/1200; M = P × r / (1 − (1+r)^(-n)); when r = 0, M = P / n.
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
  if (!(principal > 0) || !(paymentCount > 0) || annualRatePercent < 0) {
    return null;
  }

  const r = annualRatePercent / 1200;
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

export const TAXES_INSURANCE_FEES_UNAVAILABLE_REASON =
  'Include taxes, insurance, and fees is shown in the reference, but no verified tax, insurance, or fee amounts appear when the option is checked. Results stay blocked while this option is enabled so charges are not invented.';
