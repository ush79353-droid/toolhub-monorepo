import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateMonthlyPayment,
  calculateTotalInterest,
  formatBoatLoanMoney,
  termToPaymentCount,
} from './calculation';
import type {
  BoatLoanFieldErrors,
  BoatLoanInput,
  BoatLoanResult,
} from './types';

export interface BoatLoanValidation {
  isValid: boolean;
  errors: BoatLoanFieldErrors;
  result: BoatLoanResult | null;
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
 * then converts monthly payment and total interest into their display currencies.
 */
export function validateBoatLoanInput(
  input: BoatLoanInput,
  rates?: CurrencyRatesSnapshot | null
): BoatLoanValidation {
  const errors: BoatLoanFieldErrors = {};

  const amount = parseNumber(input.loanAmount);
  const term = parseNumber(input.loanTerm);
  const rate = parseNumber(input.annualInterestRatePercent);

  if (amount.blank) {
    errors.loanAmount = 'Enter a loan amount.';
  } else if (amount.invalid || amount.value === null) {
    errors.loanAmount = 'Enter a valid loan amount.';
  } else if (amount.value <= 0) {
    errors.loanAmount = 'Loan amount must be greater than zero.';
  }

  if (term.blank) {
    errors.loanTerm = 'Enter a loan term.';
  } else if (term.invalid || term.value === null) {
    errors.loanTerm = 'Enter a valid loan term.';
  } else if (term.value <= 0) {
    errors.loanTerm = 'Loan term must be greater than zero.';
  }

  if (rate.blank) {
    errors.annualInterestRatePercent = 'Enter an annual interest rate.';
  } else if (rate.invalid || rate.value === null) {
    errors.annualInterestRatePercent = 'Enter a valid annual interest rate.';
  } else if (rate.value < 0) {
    errors.annualInterestRatePercent = 'Annual interest rate cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const paymentCount = termToPaymentCount(term.value!, input.termUnit);
  if (paymentCount === null) {
    errors.loanTerm = 'Loan term must produce a positive number of monthly payments.';
    return { isValid: false, errors, result: null };
  }

  const monthlyInLoan = calculateMonthlyPayment({
    principal: amount.value!,
    annualRatePercent: rate.value!,
    paymentCount,
  });
  if (monthlyInLoan === null) {
    errors.form = 'This combination does not produce a finite monthly payment.';
    return { isValid: false, errors, result: null };
  }

  const interestInLoan = calculateTotalInterest({
    principal: amount.value!,
    monthlyPayment: monthlyInLoan,
    paymentCount,
  });
  if (interestInLoan === null) {
    errors.form = 'This combination does not produce a finite total interest.';
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

  const interestDisplay = convertMoney(
    interestInLoan,
    input.loanCurrency,
    input.totalInterestCurrency,
    rates
  );
  if (!interestDisplay.ok) {
    errors.form = interestDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const result: BoatLoanResult = {
    monthlyPaymentInLoanCurrency: monthlyInLoan,
    monthlyPayment: monthlyDisplay.amount,
    monthlyPaymentCurrency: input.monthlyPaymentCurrency,
    formattedMonthlyPayment: formatBoatLoanMoney(
      monthlyDisplay.amount,
      input.monthlyPaymentCurrency
    ),
    totalInterestInLoanCurrency: interestInLoan,
    totalInterest: interestDisplay.amount,
    totalInterestCurrency: input.totalInterestCurrency,
    formattedTotalInterest: formatBoatLoanMoney(
      interestDisplay.amount,
      input.totalInterestCurrency
    ),
    paymentCount,
  };

  return { isValid: true, errors: {}, result };
}
