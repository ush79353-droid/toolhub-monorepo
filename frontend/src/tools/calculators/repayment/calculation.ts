import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  COMPOUND_OPTIONS,
  MAX_SCHEDULE_ROWS,
  PAYMENT_OPTIONS,
  type AmortizationRow,
  type CompoundFrequency,
  type PaymentFrequency,
} from './types';

const RATE_TOL = 1e-14;
const BALANCE_TOL = 1e-8;

export function compoundingPeriodsPerYear(
  compounding: CompoundFrequency
): number {
  return (
    COMPOUND_OPTIONS.find((o) => o.value === compounding)?.periodsPerYear ?? 12
  );
}

export function paymentsPerYear(frequency: PaymentFrequency): number {
  return (
    PAYMENT_OPTIONS.find((o) => o.value === frequency)?.periodsPerYear ?? 12
  );
}

export function paymentFrequencyLabel(frequency: PaymentFrequency): string {
  return (
    PAYMENT_OPTIONS.find((o) => o.value === frequency)?.label ?? 'Every month'
  );
}

/**
 * Effective interest rate per payment period.
 * i = (1 + j/m)^(m/p) − 1
 */
export function calculateEffectivePeriodicRate(
  annualPercent: number,
  compounding: CompoundFrequency,
  paymentFreq: PaymentFrequency
): number | null {
  if (!Number.isFinite(annualPercent) || annualPercent < 0) return null;
  if (annualPercent === 0) return 0;

  const m = compoundingPeriodsPerYear(compounding);
  const p = paymentsPerYear(paymentFreq);
  if (!(m > 0) || !(p > 0)) return null;

  const j = annualPercent / 100;
  // Stable: expm1((m/p) * log1p(j/m))
  const ratio = j / m;
  if (ratio <= -1) return null;
  const i = Math.expm1((m / p) * Math.log1p(ratio));
  return Number.isFinite(i) && i >= -RATE_TOL ? Math.max(0, i) : null;
}

/** Calendar term → payment count (years + months/12) × payments/year, rounded. */
export function termToPaymentCount(
  years: number,
  months: number,
  payPerYear: number
): number | null {
  if (
    !Number.isFinite(years) ||
    !Number.isFinite(months) ||
    years < 0 ||
    months < 0 ||
    !Number.isInteger(years) ||
    !Number.isInteger(months) ||
    !(payPerYear > 0)
  ) {
    return null;
  }
  const termYears = years + months / 12;
  if (!(termYears > 0)) return null;
  const n = Math.round(termYears * payPerYear);
  return n > 0 ? n : null;
}

/**
 * Fixed-term amortizing installment.
 * A = P · i / (1 − (1+i)^−n); i=0 → P/n
 */
export function calculateFixedTermPayment(
  principal: number,
  periodicRate: number,
  periods: number
): number | null {
  if (
    !Number.isFinite(principal) ||
    principal < 0 ||
    !Number.isFinite(periodicRate) ||
    periodicRate < 0 ||
    !Number.isFinite(periods) ||
    periods <= 0 ||
    !Number.isInteger(periods)
  ) {
    return null;
  }
  if (principal === 0) return 0;
  if (periodicRate < RATE_TOL) {
    const a = principal / periods;
    return Number.isFinite(a) ? a : null;
  }
  const growth = (1 + periodicRate) ** periods;
  if (!Number.isFinite(growth) || growth <= 1) return null;
  const a = (principal * periodicRate * growth) / (growth - 1);
  return Number.isFinite(a) ? a : null;
}

export type FixedInstallmentTermResult =
  | { ok: true; theoreticalPeriods: number }
  | { ok: false; reason: 'too-low' | 'invalid' };

/**
 * Theoretical periods for fixed installment: n = −ln(1 − Pi/A) / ln(1+i)
 */
export function calculateFixedInstallmentPeriods(
  principal: number,
  periodicRate: number,
  installment: number
): FixedInstallmentTermResult {
  if (
    !Number.isFinite(principal) ||
    principal < 0 ||
    !Number.isFinite(periodicRate) ||
    periodicRate < 0 ||
    !Number.isFinite(installment) ||
    installment <= 0
  ) {
    return { ok: false, reason: 'invalid' };
  }
  if (principal === 0) return { ok: true, theoreticalPeriods: 0 };

  if (periodicRate < RATE_TOL) {
    return { ok: true, theoreticalPeriods: principal / installment };
  }

  const interestOnly = principal * periodicRate;
  if (installment <= interestOnly + RATE_TOL) {
    return { ok: false, reason: 'too-low' };
  }

  const ratio = 1 - (principal * periodicRate) / installment;
  if (!(ratio > 0) || !(ratio < 1)) {
    return { ok: false, reason: 'too-low' };
  }
  const n = -Math.log(ratio) / Math.log1p(periodicRate);
  if (!Number.isFinite(n) || n <= 0) return { ok: false, reason: 'invalid' };
  return { ok: true, theoreticalPeriods: n };
}

export interface AmortizationBuildResult {
  schedule: AmortizationRow[];
  totalInterest: number;
  totalRepayment: number;
  numberOfPayments: number;
  finalPayment: number;
  regularPayment: number;
}

/**
 * Build amortizing schedule with final payment adjustment.
 * Caps at MAX_SCHEDULE_ROWS.
 */
export function generateAmortizationSchedule(
  principal: number,
  periodicRate: number,
  regularPayment: number,
  maxPeriods: number
): AmortizationBuildResult | null {
  if (
    !Number.isFinite(principal) ||
    principal < 0 ||
    !Number.isFinite(periodicRate) ||
    periodicRate < 0 ||
    !Number.isFinite(regularPayment) ||
    regularPayment < 0 ||
    !Number.isFinite(maxPeriods) ||
    maxPeriods <= 0
  ) {
    return null;
  }

  const schedule: AmortizationRow[] = [];
  let balance = principal;
  let cumPrincipal = 0;
  let cumInterest = 0;
  const limit = Math.min(Math.ceil(maxPeriods), MAX_SCHEDULE_ROWS);

  for (let k = 1; k <= limit && balance > BALANCE_TOL; k += 1) {
    const interest = balance * periodicRate;
    let payment = regularPayment;

    // Final or near-final: pay off remaining
    if (k === limit || payment >= balance + interest - BALANCE_TOL) {
      payment = balance + interest;
    }

    // Guard: payment must cover interest if balance still large
    if (payment + BALANCE_TOL < interest && balance > BALANCE_TOL) {
      return null;
    }

    let principalPaid = payment - interest;
    if (principalPaid > balance) {
      principalPaid = balance;
      payment = principalPaid + interest;
    }

    balance = Math.max(0, balance - principalPaid);
    if (balance < BALANCE_TOL) balance = 0;

    cumPrincipal += principalPaid;
    cumInterest += interest;

    schedule.push({
      paymentNumber: k,
      paymentAmount: payment,
      principalPaid,
      interestPaid: interest,
      remainingBalance: balance,
      cumulativePrincipal: cumPrincipal,
      cumulativeInterest: cumInterest,
    });

    if (balance === 0) break;
  }

  if (schedule.length === 0) {
    return {
      schedule: [],
      totalInterest: 0,
      totalRepayment: 0,
      numberOfPayments: 0,
      finalPayment: 0,
      regularPayment,
    };
  }

  const last = schedule[schedule.length - 1]!;
  return {
    schedule,
    totalInterest: cumInterest,
    totalRepayment: cumPrincipal + cumInterest,
    numberOfPayments: schedule.length,
    finalPayment: last.paymentAmount,
    regularPayment,
  };
}

export function formatRepMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function interpretRepayment(
  payment: number,
  count: number,
  totalInterest: number,
  freqLabel: string,
  currency: SupportedCurrency
): string {
  return `Pay ${formatRepMoney(payment, currency)} ${freqLabel.toLowerCase()} for ${count} payment${count === 1 ? '' : 's'}. Total interest ≈ ${formatRepMoney(totalInterest, currency)}. Constant-rate amortizing estimate — not a lender quote.`;
}
