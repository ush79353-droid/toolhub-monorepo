import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateLoanPayment,
  formatLoanPaymentMoney,
  formatPeriodicRatePercent,
} from './calculation';
import {
  PAYMENT_FREQUENCY_OPTIONS,
  type LoanPaymentFieldErrors,
  type LoanPaymentInput,
  type LoanPaymentResult,
  type PaymentFrequency,
} from './types';

export interface LoanPaymentValidation {
  isValid: boolean;
  errors: LoanPaymentFieldErrors;
  result: LoanPaymentResult | null;
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

function isPaymentFrequency(value: string): value is PaymentFrequency {
  return PAYMENT_FREQUENCY_OPTIONS.some((o) => o.value === value);
}

function convertMoney(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
  rates: CurrencyRatesSnapshot | null | undefined
): { ok: true; amount: number } | { ok: false; message: string } {
  if (from === to) return { ok: true, amount };
  if (!rates?.available) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  const converted = convertCurrency({
    amount,
    from,
    to,
    rates: rates.rates,
  });
  if (!converted.ok) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  return { ok: true, amount: converted.amount };
}

/**
 * Validates inputs, runs the amortizing engine in loan currency at full precision,
 * then converts money results into independent display currencies (display-only
 * rounding). Rates, installment counts, and durations are never FX-converted.
 */
export function validateLoanPaymentInput(
  input: LoanPaymentInput,
  rates?: CurrencyRatesSnapshot | null
): LoanPaymentValidation {
  const errors: LoanPaymentFieldErrors = {};

  const amount = parseNumber(input.loanAmount);
  const rate = parseNumber(input.annualRatePercent);
  const years = parseNumber(input.termYears);
  const months = parseNumber(input.termMonths);

  if (!amount.blank && (amount.invalid || amount.value === null)) {
    errors.loanAmount = 'Enter a valid loan amount.';
  } else if (!amount.blank && amount.value !== null && !(amount.value > 0)) {
    errors.loanAmount = 'Loan amount must be greater than zero.';
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.annualRatePercent = 'Enter a valid annual rate.';
  } else if (!rate.blank && rate.value !== null && rate.value < 0) {
    errors.annualRatePercent = 'Annual rate cannot be negative.';
  }

  if (!years.blank && (years.invalid || years.value === null)) {
    errors.termYears = 'Enter a valid number of years.';
  } else if (
    !years.blank &&
    years.value !== null &&
    (years.value < 0 || !Number.isInteger(years.value))
  ) {
    errors.termYears = 'Years must be a whole number of 0 or more.';
  }

  if (!months.blank && (months.invalid || months.value === null)) {
    errors.termMonths = 'Enter a valid number of months.';
  } else if (
    !months.blank &&
    months.value !== null &&
    (!Number.isInteger(months.value) || months.value < 0 || months.value > 11)
  ) {
    errors.termMonths = 'Months must be a whole number from 0 to 11.';
  }

  if (!isPaymentFrequency(input.paymentFrequency)) {
    errors.paymentFrequency = 'Select a valid payment frequency.';
  }

  const incomplete =
    amount.blank ||
    rate.blank ||
    years.blank ||
    months.blank ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const yearValue = years.value!;
  const monthValue = months.value!;
  if (yearValue === 0 && monthValue === 0) {
    errors.termYears = 'Loan term must be greater than zero.';
    return { isValid: false, errors, result: null };
  }

  const computed = calculateLoanPayment({
    principal: amount.value!,
    annualRatePercent: rate.value!,
    termYears: yearValue,
    termMonths: monthValue,
    paymentFrequency: input.paymentFrequency,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const paymentOut = convertMoney(
    computed.periodicPayment,
    input.loanCurrency,
    input.paymentCurrency,
    rates
  );
  if (!paymentOut.ok) {
    errors.form = paymentOut.message;
    return { isValid: false, errors, result: null };
  }

  const totalOut = convertMoney(
    computed.loanPaymentTotal,
    input.loanCurrency,
    input.totalCurrency,
    rates
  );
  if (!totalOut.ok) {
    errors.form = totalOut.message;
    return { isValid: false, errors, result: null };
  }

  const result: LoanPaymentResult = {
    numberOfInstallments: computed.numberOfInstallments,
    periodicInterestRate: computed.periodicInterestRate,
    periodicInterestRatePercent: computed.periodicInterestRatePercent,
    periodicPaymentInLoan: computed.periodicPayment,
    periodicPayment: paymentOut.amount,
    loanPaymentTotalInLoan: computed.loanPaymentTotal,
    loanPaymentTotal: totalOut.amount,
    loanCurrency: input.loanCurrency,
    paymentCurrency: input.paymentCurrency,
    totalCurrency: input.totalCurrency,
    formattedNumberOfInstallments: String(computed.numberOfInstallments),
    formattedPeriodicInterestRate: formatPeriodicRatePercent(
      computed.periodicInterestRatePercent
    ),
    formattedPeriodicPayment: formatLoanPaymentMoney(
      paymentOut.amount,
      input.paymentCurrency
    ),
    formattedLoanPaymentTotal: formatLoanPaymentMoney(
      totalOut.amount,
      input.totalCurrency
    ),
  };

  return { isValid: true, errors: {}, result };
}
