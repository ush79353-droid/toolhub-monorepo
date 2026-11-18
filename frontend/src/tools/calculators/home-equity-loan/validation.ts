import {
  CLOSING_COSTS_UNAVAILABLE_REASON,
  calculateHomeEquityLoan,
  formatUsdAmount,
} from './calculation';
import type {
  HomeEquityLoanFieldErrors,
  HomeEquityLoanInput,
  HomeEquityLoanResult,
} from './types';

export interface HomeEquityLoanValidation {
  isValid: boolean;
  errors: HomeEquityLoanFieldErrors;
  result: HomeEquityLoanResult | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '').replace(/^\$/, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

export function validateHomeEquityLoanInput(
  input: HomeEquityLoanInput
): HomeEquityLoanValidation {
  const errors: HomeEquityLoanFieldErrors = {};

  const amount = parseNumber(input.loanAmount);
  const rate = parseNumber(input.annualInterestRatePercent);
  const term = parseNumber(input.loanTermYears);

  if (amount.blank) {
    errors.loanAmount = 'Enter a loan amount.';
  } else if (amount.invalid || amount.value === null) {
    errors.loanAmount = 'Enter a valid loan amount.';
  } else if (!(amount.value > 0)) {
    errors.loanAmount = 'Loan amount must be greater than zero.';
  }

  if (rate.blank) {
    errors.annualInterestRatePercent = 'Enter an annual interest rate.';
  } else if (rate.invalid || rate.value === null) {
    errors.annualInterestRatePercent = 'Enter a valid annual interest rate.';
  } else if (rate.value < 0) {
    errors.annualInterestRatePercent = 'Annual interest rate cannot be negative.';
  }

  if (term.blank) {
    errors.loanTermYears = 'Enter a loan term in years.';
  } else if (term.invalid || term.value === null) {
    errors.loanTermYears = 'Enter a valid loan term.';
  } else if (!(term.value > 0)) {
    errors.loanTermYears = 'Loan term must be greater than zero.';
  } else if (!Number.isInteger(term.value)) {
    errors.loanTermYears = 'Loan term years must be a whole number.';
  }

  if (input.includeClosingCosts) {
    errors.form = CLOSING_COSTS_UNAVAILABLE_REASON;
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateHomeEquityLoan({
    principal: amount.value!,
    annualRatePercent: rate.value!,
    termYears: term.value!,
  });

  if (!computed) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const result: HomeEquityLoanResult = {
    monthlyPayment: computed.monthlyPayment,
    paymentCount: computed.paymentCount,
    totalOfPayments: computed.totalOfPayments,
    totalInterest: computed.totalInterest,
    principal: amount.value!,
    principalSharePercent: computed.principalSharePercent,
    interestSharePercent: computed.interestSharePercent,
    formattedMonthlyPayment: formatUsdAmount(computed.monthlyPayment),
    formattedTotalOfPayments: formatUsdAmount(computed.totalOfPayments),
    formattedTotalInterest: formatUsdAmount(computed.totalInterest),
    formattedPrincipal: formatUsdAmount(amount.value!),
  };

  return { isValid: true, errors: {}, result };
}
