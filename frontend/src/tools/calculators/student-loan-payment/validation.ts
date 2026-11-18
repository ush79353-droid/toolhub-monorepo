import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { calculateStudentLoanPayment } from './calculation';
import type {
  StudentLoanPaymentFieldErrors,
  StudentLoanPaymentInput,
  StudentLoanPaymentParsed,
  StudentLoanPaymentResult,
} from './types';

export interface StudentLoanPaymentValidation {
  isValid: boolean;
  errors: StudentLoanPaymentFieldErrors;
  result: StudentLoanPaymentResult | null;
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

export function validateStudentLoanPaymentInput(
  input: StudentLoanPaymentInput,
  rates?: CurrencyRatesSnapshot | null
): StudentLoanPaymentValidation {
  const errors: StudentLoanPaymentFieldErrors = {};

  const loan = parseNumber(input.loanAmount);
  const rate = parseNumber(input.interestRate);
  const years = parseNumber(input.termYears);
  const months = parseNumber(input.termMonths);
  const prepaid = parseNumber(input.prepaidFee);
  const loaned = parseNumber(input.loanedFee);
  const origination = parseNumber(input.originationFee);

  if (loan.blank) {
    errors.loanAmount = 'Enter a loan amount.';
  } else if (loan.invalid || loan.value === null) {
    errors.loanAmount = 'Enter a valid loan amount.';
  } else if (!(loan.value > 0)) {
    errors.loanAmount = 'Loan amount must be greater than zero.';
  }

  if (rate.blank) {
    errors.interestRate = 'Enter an interest rate.';
  } else if (rate.invalid || rate.value === null) {
    errors.interestRate = 'Enter a valid interest rate.';
  } else if (rate.value < 0) {
    errors.interestRate = 'Interest rate cannot be negative.';
  }

  if (!years.blank && (years.invalid || years.value === null)) {
    errors.termYears = 'Enter a valid number of years.';
  } else if (!years.blank && years.value !== null && years.value < 0) {
    errors.termYears = 'Years cannot be negative.';
  } else if (
    !years.blank &&
    years.value !== null &&
    !Number.isInteger(years.value)
  ) {
    errors.termYears = 'Years must be a whole number.';
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

  const termYears = years.blank ? 0 : years.value!;
  const termMonths = months.blank ? 0 : months.value!;
  if (termYears === 0 && termMonths === 0) {
    errors.termYears = errors.termYears ?? 'Enter a loan term.';
  }

  if (prepaid.blank) {
    // blank prepaid treated as 0
  } else if (prepaid.invalid || prepaid.value === null) {
    errors.prepaidFee = 'Enter a valid prepaid fee.';
  } else if (prepaid.value < 0) {
    errors.prepaidFee = 'Prepaid fee cannot be negative.';
  }

  if (loaned.blank) {
    // blank loaned treated as 0
  } else if (loaned.invalid || loaned.value === null) {
    errors.loanedFee = 'Enter a valid loaned fee.';
  } else if (loaned.value < 0) {
    errors.loanedFee = 'Loaned fee cannot be negative.';
  }

  if (origination.blank) {
    // blank origination treated as 0
  } else if (origination.invalid || origination.value === null) {
    errors.originationFee = 'Enter a valid origination fee percent.';
  } else if (origination.value < 0) {
    errors.originationFee = 'Origination fee cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const canonical = input.loanCurrency;
  const prepaidConverted = convertMoney(
    prepaid.blank ? 0 : prepaid.value!,
    input.prepaidFeeCurrency,
    canonical,
    rates
  );
  if (!prepaidConverted.ok) {
    errors.form = prepaidConverted.message;
    return { isValid: false, errors, result: null };
  }

  const loanedConverted = convertMoney(
    loaned.blank ? 0 : loaned.value!,
    input.loanedFeeCurrency,
    canonical,
    rates
  );
  if (!loanedConverted.ok) {
    errors.form = loanedConverted.message;
    return { isValid: false, errors, result: null };
  }

  const parsed: StudentLoanPaymentParsed = {
    knownRate: input.knownRate,
    interestRate: rate.value!,
    compoundFrequency: input.compoundFrequency,
    loanAmount: loan.value!,
    termYears,
    termMonths,
    paymentFrequency: input.paymentFrequency,
    prepaidFee: prepaidConverted.amount,
    loanedFee: loanedConverted.amount,
    originationFeePercent: origination.blank ? 0 : origination.value!,
    originationFeeRepayment: input.originationFeeRepayment,
    currency: canonical,
  };

  if (
    parsed.originationFeeRepayment === 'from_loan' &&
    parsed.loanAmount * (parsed.originationFeePercent / 100) >= parsed.loanAmount
  ) {
    errors.originationFee =
      'Origination fee cannot be 100% or more when deducted from the loan amount.';
    return { isValid: false, errors, result: null };
  }

  const result = calculateStudentLoanPayment(parsed);
  if (!result) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
