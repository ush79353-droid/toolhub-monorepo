import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateMonthlyPayment,
  formatStudentLoanMoney,
  termToPaymentCount,
} from './calculation';
import type {
  StudentLoanFieldErrors,
  StudentLoanInput,
  StudentLoanResult,
} from './types';

export interface StudentLoanValidation {
  isValid: boolean;
  errors: StudentLoanFieldErrors;
  result: StudentLoanResult | null;
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
 * Validates inputs, amortizes in loan currency at full precision,
 * then converts monthly payment into its display currency.
 */
export function validateStudentLoanInput(
  input: StudentLoanInput,
  rates?: CurrencyRatesSnapshot | null
): StudentLoanValidation {
  const errors: StudentLoanFieldErrors = {};

  const balance = parseNumber(input.loanBalance);
  const rate = parseNumber(input.annualInterestRatePercent);
  const years = parseNumber(input.termYears);
  const months = parseNumber(input.termMonths);

  if (balance.blank) {
    errors.loanBalance = 'Enter a loan balance.';
  } else if (balance.invalid || balance.value === null) {
    errors.loanBalance = 'Enter a valid loan balance.';
  } else if (balance.value <= 0) {
    errors.loanBalance = 'Loan balance must be greater than zero.';
  }

  if (rate.blank) {
    errors.annualInterestRatePercent = 'Enter an interest rate.';
  } else if (rate.invalid || rate.value === null) {
    errors.annualInterestRatePercent = 'Enter a valid interest rate.';
  } else if (rate.value < 0) {
    errors.annualInterestRatePercent = 'Interest rate cannot be negative.';
  }

  if (!years.blank && (years.invalid || years.value === null)) {
    errors.termYears = 'Enter a valid number of years.';
  } else if (!years.blank && years.value !== null && years.value < 0) {
    errors.termYears = 'Remaining term years cannot be negative.';
  } else if (
    !years.blank &&
    years.value !== null &&
    !Number.isInteger(years.value)
  ) {
    errors.termYears = 'Remaining term years must be a whole number.';
  }

  if (!months.blank && (months.invalid || months.value === null)) {
    errors.termMonths = 'Enter a valid number of months.';
  } else if (
    !months.blank &&
    months.value !== null &&
    (!Number.isInteger(months.value) || months.value < 0 || months.value > 11)
  ) {
    errors.termMonths = 'Remaining term months must be a whole number from 0 to 11.';
  }

  const termYears = years.blank ? 0 : years.value!;
  const termMonths = months.blank ? 0 : months.value!;
  if (years.blank && (months.blank || termMonths === 0)) {
    errors.termYears = errors.termYears ?? 'Enter a remaining term.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const paymentCount = termToPaymentCount(termYears, termMonths);
  if (paymentCount === null) {
    errors.termYears =
      'Remaining term must produce a positive number of monthly payments.';
    return { isValid: false, errors, result: null };
  }

  const monthlyInLoan = calculateMonthlyPayment({
    principal: balance.value!,
    annualRatePercent: rate.value!,
    paymentCount,
  });
  if (monthlyInLoan === null) {
    errors.form = 'This combination does not produce a finite monthly payment.';
    return { isValid: false, errors, result: null };
  }

  const monthlyDisplay = convertMoney(
    monthlyInLoan,
    input.loanCurrency,
    input.monthlyPaymentCurrency,
    rates
  );
  if (!monthlyDisplay.ok) {
    errors.form = monthlyDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const result: StudentLoanResult = {
    monthlyPaymentInLoanCurrency: monthlyInLoan,
    monthlyPayment: monthlyDisplay.amount,
    monthlyPaymentCurrency: input.monthlyPaymentCurrency,
    formattedMonthlyPayment: formatStudentLoanMoney(
      monthlyDisplay.amount,
      input.monthlyPaymentCurrency
    ),
    paymentCount,
  };

  return { isValid: true, errors: {}, result };
}
