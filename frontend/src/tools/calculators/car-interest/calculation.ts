import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export function formatCarInterestMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Loan Amount = Car Price − Down Payment − Trade-in Value */
export function calculateLoanAmount(
  carPrice: number,
  downPayment: number,
  tradeInValue: number
): number | null {
  if (![carPrice, downPayment, tradeInValue].every(Number.isFinite)) return null;
  if (carPrice < 0 || downPayment < 0 || tradeInValue < 0) return null;
  const loanAmount = carPrice - downPayment - tradeInValue;
  return Number.isFinite(loanAmount) ? loanAmount : null;
}

/** n = Years × 12 + Months; must be a positive whole number of months. */
export function calculatePaymentCount(
  termYears: number,
  termMonths: number
): number | null {
  if (![termYears, termMonths].every(Number.isFinite)) return null;
  if (termYears < 0 || termMonths < 0 || termMonths > 11) return null;
  if (!Number.isInteger(termYears) || !Number.isInteger(termMonths)) return null;
  const n = termYears * 12 + termMonths;
  return n > 0 ? n : null;
}

/**
 * r = Annual Interest Rate / 1200
 * Monthly Payment = P × r / (1 − (1+r)^(-n)); when r = 0, M = P / n.
 * Full precision — display rounding happens later.
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
  if (principal < 0 || paymentCount <= 0 || annualRatePercent < 0) return null;

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

/** Total Interest = Monthly Payment × n − P (full-precision payment). */
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
