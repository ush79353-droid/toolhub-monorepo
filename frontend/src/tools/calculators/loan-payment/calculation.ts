import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  PAYMENT_FREQUENCY_OPTIONS,
  type PaymentFrequency,
} from './types';

export function formatLoanPaymentMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Display periodic rate % with up to 6 decimals; trim trailing zeros. */
export function formatPeriodicRatePercent(ratePercent: number): string {
  if (!Number.isFinite(ratePercent)) return '—';
  const rounded = Math.round(ratePercent * 1_000_000) / 1_000_000;
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  const text = String(rounded);
  return text.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
}

export function paymentsPerYear(frequency: PaymentFrequency): number {
  return (
    PAYMENT_FREQUENCY_OPTIONS.find((o) => o.value === frequency)?.periodsPerYear ??
    1
  );
}

/**
 * n = (years + months/12) × paymentsPerYear, rounded to a whole installment count.
 */
export function installmentCount(
  years: number,
  months: number,
  frequency: PaymentFrequency
): number | null {
  if (![years, months].every(Number.isFinite)) return null;
  if (years < 0 || months < 0 || months > 11) return null;
  if (!Number.isInteger(years) || !Number.isInteger(months)) return null;
  const termYears = years + months / 12;
  if (!(termYears > 0)) return null;
  const n = Math.round(termYears * paymentsPerYear(frequency));
  return n > 0 ? n : null;
}

/**
 * Nominal periodic rate matching payment frequency (project convention when no
 * separate compounding selector is shown): r = (annualPercent / 100) / ppy.
 */
export function periodicInterestRate(
  annualRatePercent: number,
  frequency: PaymentFrequency
): number | null {
  if (!Number.isFinite(annualRatePercent) || annualRatePercent < 0) return null;
  const ppy = paymentsPerYear(frequency);
  if (!(ppy > 0)) return null;
  if (annualRatePercent === 0) return 0;
  const r = annualRatePercent / 100 / ppy;
  return Number.isFinite(r) && r > -1 ? r : null;
}

/**
 * Payment = P × r / (1 − (1+r)^(-n)); when r = 0, Payment = P / n.
 * Uses expm1/log1p for numerical stability. Full precision — round only for display.
 */
export function amortizingPayment(
  principal: number,
  periodicRate: number,
  installments: number
): number | null {
  if (![principal, periodicRate, installments].every(Number.isFinite)) return null;
  if (!(principal > 0) || !(installments > 0) || periodicRate < 0) return null;

  if (periodicRate === 0) {
    const payment = principal / installments;
    return Number.isFinite(payment) ? payment : null;
  }

  const denom = -Math.expm1(-installments * Math.log1p(periodicRate));
  if (!(denom > 0)) return null;
  const payment = (principal * periodicRate) / denom;
  return Number.isFinite(payment) ? payment : null;
}

export interface LoanPaymentCanonicalInput {
  principal: number;
  annualRatePercent: number;
  termYears: number;
  termMonths: number;
  paymentFrequency: PaymentFrequency;
}

export interface LoanPaymentCanonicalResult {
  numberOfInstallments: number;
  periodicInterestRate: number;
  periodicInterestRatePercent: number;
  periodicPayment: number;
  loanPaymentTotal: number;
}

export function calculateLoanPayment(
  input: LoanPaymentCanonicalInput
): LoanPaymentCanonicalResult | null {
  const { principal, annualRatePercent, termYears, termMonths, paymentFrequency } =
    input;

  if (
    ![principal, annualRatePercent, termYears, termMonths].every(Number.isFinite) ||
    !(principal > 0) ||
    annualRatePercent < 0
  ) {
    return null;
  }

  const n = installmentCount(termYears, termMonths, paymentFrequency);
  if (n === null) return null;

  const r = periodicInterestRate(annualRatePercent, paymentFrequency);
  if (r === null) return null;

  const payment = amortizingPayment(principal, r, n);
  if (payment === null) return null;

  const total = payment * n;
  if (!Number.isFinite(total)) return null;

  return {
    numberOfInstallments: n,
    periodicInterestRate: r,
    periodicInterestRatePercent: r * 100,
    periodicPayment: payment,
    loanPaymentTotal: total,
  };
}
