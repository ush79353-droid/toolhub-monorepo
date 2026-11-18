import {
  calculatePayment,
  formatPaymentUsd,
  formatPaymentUsdPlain,
} from './calculation';
import type {
  PaymentFieldErrors,
  PaymentInput,
  PaymentResult,
} from './types';

export interface PaymentValidation {
  isValid: boolean;
  errors: PaymentFieldErrors;
  result: PaymentResult | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

export function validatePaymentInput(input: PaymentInput): PaymentValidation {
  const errors: PaymentFieldErrors = {};

  const amount = parseNumber(input.loanAmount);
  const term = parseNumber(input.loanTermYears);
  const rate = parseNumber(input.interestRatePercent);
  const fixedPmt = parseNumber(input.monthlyPayment);

  if (!amount.blank && (amount.invalid || amount.value === null)) {
    errors.loanAmount = 'Enter a valid loan amount.';
  } else if (!amount.blank && amount.value !== null && !(amount.value > 0)) {
    errors.loanAmount = 'Loan amount must be greater than zero.';
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (!rate.blank && rate.value !== null && rate.value < 0) {
    errors.interestRatePercent = 'Interest rate cannot be negative.';
  }

  if (input.mode === 'fixed-term') {
    if (!term.blank && (term.invalid || term.value === null)) {
      errors.loanTermYears = 'Enter a valid loan term.';
    } else if (!term.blank && term.value !== null && !(term.value > 0)) {
      errors.loanTermYears = 'Loan term must be greater than zero.';
    } else if (!term.blank && term.value !== null && term.value > 100) {
      errors.loanTermYears = 'Loan term cannot exceed 100 years.';
    }
  } else {
    if (!fixedPmt.blank && (fixedPmt.invalid || fixedPmt.value === null)) {
      errors.monthlyPayment = 'Enter a valid monthly payment.';
    } else if (!fixedPmt.blank && fixedPmt.value !== null && !(fixedPmt.value > 0)) {
      errors.monthlyPayment = 'Monthly payment must be greater than zero.';
    }
  }

  const incomplete =
    amount.blank ||
    rate.blank ||
    (input.mode === 'fixed-term' ? term.blank : fixedPmt.blank) ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const calc = calculatePayment({
    mode: input.mode,
    principal: amount.value!,
    annualRatePercent: rate.value!,
    loanTermYears: input.mode === 'fixed-term' ? term.value! : 0,
    fixedMonthlyPayment: input.mode === 'fixed-payments' ? fixedPmt.value! : 0,
  });

  if (!calc) {
    errors.form =
      input.mode === 'fixed-payments'
        ? 'This monthly payment is too low to pay off the loan (or the combination is invalid).'
        : 'This combination does not produce a finite payment schedule.';
    return { isValid: false, errors, result: null };
  }

  const total = calc.totalRepayment;
  const principalPercent =
    total > 0 ? (amount.value! / total) * 100 : 100;
  const interestPercent = Math.max(0, 100 - principalPercent);

  const yearsLabel =
    Math.abs(calc.termYearsDisplay - Math.round(calc.termYearsDisplay)) < 1e-9
      ? String(Math.round(calc.termYearsDisplay))
      : formatPaymentUsdPlain(calc.termYearsDisplay).replace(/\.00$/, '');

  const result: PaymentResult = {
    monthlyPayment: calc.monthlyPayment,
    numberOfPayments: calc.numberOfPayments,
    totalRepayment: calc.totalRepayment,
    totalInterest: calc.totalInterest,
    principal: amount.value!,
    termYearsDisplay: calc.termYearsDisplay,
    principalPercent,
    interestPercent,
    monthlySchedule: calc.monthlySchedule,
    annualSchedule: calc.annualSchedule,
    chartPoints: calc.chartPoints,
    formattedMonthlyPayment: formatPaymentUsd(calc.monthlyPayment),
    formattedTotalRepayment: formatPaymentUsd(calc.totalRepayment),
    formattedTotalInterest: formatPaymentUsd(calc.totalInterest),
    summaryText: `You will need to pay ${formatPaymentUsd(calc.monthlyPayment)} every month for ${yearsLabel} years to payoff the debt.`,
  };

  return { isValid: true, errors: {}, result };
}
