import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  TAXES_INSURANCE_FEES_UNAVAILABLE_REASON,
  calculateMonthlyPayment,
  formatSimpleMortgageMoney,
  termToPaymentCount,
} from './calculation';
import type {
  SimpleMortgageFieldErrors,
  SimpleMortgageInput,
  SimpleMortgageResult,
} from './types';

export interface SimpleMortgageValidation {
  isValid: boolean;
  errors: SimpleMortgageFieldErrors;
  result: SimpleMortgageResult | null;
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

export function validateSimpleMortgageInput(
  input: SimpleMortgageInput,
  rates?: CurrencyRatesSnapshot | null
): SimpleMortgageValidation {
  const errors: SimpleMortgageFieldErrors = {};

  const amount = parseNumber(input.loanAmount);
  const rate = parseNumber(input.annualInterestRatePercent);
  const term = parseNumber(input.loanTerm);

  if (amount.blank) {
    errors.loanAmount = 'Enter a loan amount.';
  } else if (amount.invalid || amount.value === null) {
    errors.loanAmount = 'Enter a valid loan amount.';
  } else if (!(amount.value > 0)) {
    errors.loanAmount = 'Loan amount must be greater than zero.';
  }

  if (rate.blank) {
    errors.annualInterestRatePercent = 'Enter a yearly interest rate.';
  } else if (rate.invalid || rate.value === null) {
    errors.annualInterestRatePercent = 'Enter a valid yearly interest rate.';
  } else if (rate.value < 0) {
    errors.annualInterestRatePercent = 'Yearly interest rate cannot be negative.';
  }

  if (term.blank) {
    errors.loanTerm = 'Enter a loan term.';
  } else if (term.invalid || term.value === null) {
    errors.loanTerm = 'Enter a valid loan term.';
  } else if (!(term.value > 0)) {
    errors.loanTerm = 'Loan term must be greater than zero.';
  } else if (input.termUnit === 'mos' && !Number.isInteger(term.value)) {
    errors.loanTerm = 'Loan term months must be a whole number.';
  }

  if (input.includeTaxesInsuranceFees) {
    errors.form = TAXES_INSURANCE_FEES_UNAVAILABLE_REASON;
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

  return {
    isValid: true,
    errors: {},
    result: {
      monthlyPaymentInLoanCurrency: monthlyInLoan,
      monthlyPayment: monthlyDisplay.amount,
      monthlyPaymentCurrency: input.monthlyPaymentCurrency,
      formattedMonthlyPayment: formatSimpleMortgageMoney(
        monthlyDisplay.amount,
        input.monthlyPaymentCurrency
      ),
      paymentCount,
    },
  };
}
