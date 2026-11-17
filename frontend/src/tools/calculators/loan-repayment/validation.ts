import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { calculateLoanRepayment } from './calculation';
import type {
  LoanRepaymentFieldErrors,
  LoanRepaymentInput,
  LoanRepaymentResult,
} from './types';

export interface LoanRepaymentValidation {
  isValid: boolean;
  errors: LoanRepaymentFieldErrors;
  result: LoanRepaymentResult | null;
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

export function validateLoanRepaymentInput(
  input: LoanRepaymentInput,
  rates?: CurrencyRatesSnapshot | null
): LoanRepaymentValidation {
  const errors: LoanRepaymentFieldErrors = {};

  if (input.paymentType === 'balloon') {
    errors.form =
      'Balloon payment is shown in the reference, but no residual/balloon amount is specified. Results stay blocked until a verified balloon convention is available.';
    return { isValid: false, errors, result: null };
  }

  const amount = parseNumber(input.loanAmount);
  const years = parseNumber(input.termYears);
  const months = parseNumber(input.termMonths);
  const rate = parseNumber(input.interestRatePercent);
  const extra = parseNumber(input.extraMonthlyPayment);

  if (amount.blank || amount.invalid || amount.value === null) {
    errors.loanAmount = 'Enter a valid loan amount.';
  } else if (amount.value <= 0) {
    errors.loanAmount = 'Loan amount must be greater than zero.';
  }

  if (years.blank || years.invalid || years.value === null) {
    errors.termYears = 'Enter a valid number of years.';
  } else if (years.value < 0) {
    errors.termYears = 'Years cannot be negative.';
  }

  if (months.blank || months.invalid || months.value === null) {
    errors.termMonths = 'Enter a valid number of months.';
  } else if (months.value < 0) {
    errors.termMonths = 'Months cannot be negative.';
  } else if (months.value >= 12) {
    errors.termMonths = 'Months must be between 0 and 11.';
  }

  if (
    !errors.termYears &&
    !errors.termMonths &&
    years.value !== null &&
    months.value !== null &&
    years.value === 0 &&
    months.value === 0
  ) {
    errors.termYears = 'Loan term must be greater than zero.';
  }

  if (rate.blank || rate.invalid || rate.value === null) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (rate.value < 0) {
    errors.interestRatePercent = 'Interest rate cannot be negative.';
  }

  if (extra.blank) {
    // treat blank as 0
  } else if (extra.invalid || extra.value === null) {
    errors.extraMonthlyPayment = 'Enter a valid extra monthly payment.';
  } else if (extra.value < 0) {
    errors.extraMonthlyPayment = 'Extra monthly payment cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const extraRaw = extra.blank || extra.value === null ? 0 : extra.value!;
  let extraInLoanCurrency = extraRaw;

  if (input.extraPaymentCurrency !== input.loanCurrency && extraRaw !== 0) {
    if (!rates?.available) {
      errors.form = CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
      return { isValid: false, errors, result: null };
    }
    const converted = convertCurrency({
      amount: extraRaw,
      from: input.extraPaymentCurrency,
      to: input.loanCurrency,
      rates: rates.rates,
    });
    if (!converted.ok) {
      errors.form = CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
      return { isValid: false, errors, result: null };
    }
    extraInLoanCurrency = converted.amount;
  }

  const result = calculateLoanRepayment({
    principal: amount.value!,
    annualRatePercent: rate.value!,
    compounding: input.compoundingFrequency,
    termYears: years.value!,
    termMonths: months.value!,
    extraMonthly: extraInLoanCurrency,
    paymentType: input.paymentType,
    currency: input.loanCurrency,
  });

  if (!result) {
    errors.form = 'This combination does not produce a finite amortization schedule.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
