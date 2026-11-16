import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export function formatStudentLoanMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** n = years × 12 + months. */
export function termToPaymentCount(
  termYears: number,
  termMonths: number
): number | null {
  if (![termYears, termMonths].every(Number.isFinite)) return null;
  if (termYears < 0 || termMonths < 0) return null;
  const n = termYears * 12 + termMonths;
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

/**
 * Fixed-rate amortizing monthly payment.
 * r = APR/100/12
 * When r > 0: M = P × r × (1+r)^n / ((1+r)^n − 1)
 * When r = 0: M = P / n
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
    const growth = Math.pow(1 + r, paymentCount);
    if (!Number.isFinite(growth)) return null;
    const denom = growth - 1;
    if (!(denom > 0)) return null;
    payment = (principal * r * growth) / denom;
  }

  return Number.isFinite(payment) ? payment : null;
}
