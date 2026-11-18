import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export function formatRvLoanMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** N = years × 12 + months. */
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
 * Fixed-rate monthly amortizing payment on financed principal P.
 * r = APR/100/12; M = P × r / (1 − (1+r)^(-N)); when r = 0, M = P / N.
 * When P = 0, M = 0.
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
  if (principal === 0) return 0;

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

export function calculateRvLoanAmortization(input: {
  rvPrice: number;
  downPayment: number;
  annualRatePercent: number;
  paymentCount: number;
}): {
  loanAmount: number;
  monthlyPayment: number;
  totalPaid: number;
  costOfLoan: number;
} | null {
  const { rvPrice, downPayment, annualRatePercent, paymentCount } = input;
  if (
    ![rvPrice, downPayment, annualRatePercent, paymentCount].every(Number.isFinite)
  ) {
    return null;
  }
  if (rvPrice <= 0 || downPayment < 0 || downPayment > rvPrice) return null;
  if (paymentCount <= 0 || annualRatePercent < 0) return null;

  const loanAmount = rvPrice - downPayment;
  const monthlyPayment = calculateMonthlyPayment({
    principal: loanAmount,
    annualRatePercent,
    paymentCount,
  });
  if (monthlyPayment === null) return null;

  const totalPaid = monthlyPayment * paymentCount;
  const costOfLoan = totalPaid - loanAmount;
  if (![totalPaid, costOfLoan].every(Number.isFinite)) return null;

  return { loanAmount, monthlyPayment, totalPaid, costOfLoan };
}
