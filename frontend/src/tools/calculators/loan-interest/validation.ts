import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateLoanInterest,
  formatLoanInterestMoney,
  termYears,
} from './calculation';
import type {
  LoanInterestFieldErrors,
  LoanInterestInput,
  LoanInterestResult,
} from './types';

export interface LoanInterestValidation {
  isValid: boolean;
  errors: LoanInterestFieldErrors;
  result: LoanInterestResult | null;
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
 * Validate inputs, amortize in loan-balance currency at full precision,
 * then convert interest / total / payment into their independent display currencies.
 */
export function validateLoanInterestInput(
  input: LoanInterestInput,
  rates?: CurrencyRatesSnapshot | null
): LoanInterestValidation {
  const errors: LoanInterestFieldErrors = {};

  const balance = parseNumber(input.loanBalance);
  const term = parseNumber(input.loanTerm);
  const rate = parseNumber(input.interestRatePercent);

  if (balance.blank) {
    errors.loanBalance = 'Enter a loan balance.';
  } else if (balance.invalid || balance.value === null) {
    errors.loanBalance = 'Enter a valid loan balance.';
  } else if (!(balance.value > 0)) {
    errors.loanBalance = 'Loan balance must be greater than zero.';
  }

  if (term.blank) {
    errors.loanTerm = 'Enter a loan term.';
  } else if (term.invalid || term.value === null) {
    errors.loanTerm = 'Enter a valid loan term.';
  } else if (!(term.value > 0)) {
    errors.loanTerm = 'Loan term must be greater than zero.';
  }

  if (rate.blank) {
    errors.interestRatePercent = 'Enter an interest rate.';
  } else if (rate.invalid || rate.value === null) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (rate.value < 0) {
    errors.interestRatePercent = 'Interest rate cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const years = termYears(term.value!, input.termUnit);
  if (!Number.isFinite(years) || !(years > 0)) {
    errors.loanTerm = 'Loan term must be greater than zero.';
    return { isValid: false, errors, result: null };
  }

  const canonical = calculateLoanInterest({
    principal: balance.value!,
    annualRatePercent: rate.value!,
    termYears: years,
    paymentFrequency: input.paymentFrequency,
    compoundingFrequency: input.compoundingFrequency,
  });

  if (!canonical) {
    errors.form = 'This combination does not produce a valid loan result.';
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.loanCurrency;
  const interestDisplay = convertMoney(
    canonical.totalInterest,
    calcCurrency,
    input.interestCurrency,
    rates
  );
  const totalDisplay = convertMoney(
    canonical.totalPayment,
    calcCurrency,
    input.totalCurrency,
    rates
  );
  const paymentDisplay = convertMoney(
    canonical.periodicPayment,
    calcCurrency,
    input.paymentCurrency,
    rates
  );

  if (!interestDisplay.ok) {
    errors.form = interestDisplay.message;
    return { isValid: false, errors, result: null };
  }
  if (!totalDisplay.ok) {
    errors.form = totalDisplay.message;
    return { isValid: false, errors, result: null };
  }
  if (!paymentDisplay.ok) {
    errors.form = paymentDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const result: LoanInterestResult = {
    loanBalance: canonical.principal,
    periodicPayment: canonical.periodicPayment,
    paymentCount: canonical.paymentCount,
    totalPayment: canonical.totalPayment,
    totalInterest: canonical.totalInterest,
    paymentLabel: canonical.paymentLabel,
    paymentsPerYear: canonical.paymentsPerYear,
    chartPoints: canonical.chartPoints,
    calcCurrency,
    formattedInterest: formatLoanInterestMoney(
      interestDisplay.amount,
      input.interestCurrency
    ),
    formattedTotalPayment: formatLoanInterestMoney(
      totalDisplay.amount,
      input.totalCurrency
    ),
    formattedPeriodicPayment: formatLoanInterestMoney(
      paymentDisplay.amount,
      input.paymentCurrency
    ),
    interestDisplay: interestDisplay.amount,
    totalDisplay: totalDisplay.amount,
    paymentDisplay: paymentDisplay.amount,
    loanCurrency: input.loanCurrency,
    interestCurrency: input.interestCurrency,
    totalCurrency: input.totalCurrency,
    paymentCurrency: input.paymentCurrency,
  };

  return { isValid: true, errors: {}, result };
}
