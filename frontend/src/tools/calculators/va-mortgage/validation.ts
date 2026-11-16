import {
  calculateVaMortgage,
  formatVaMoney,
  formatVaPercent,
} from './calculation';
import type {
  VaMortgageFieldErrors,
  VaMortgageInput,
  VaMortgageResult,
} from './types';

export interface VaMortgageValidation {
  isValid: boolean;
  errors: VaMortgageFieldErrors;
  result: VaMortgageResult | null;
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

export function validateVaMortgageInput(input: VaMortgageInput): VaMortgageValidation {
  const errors: VaMortgageFieldErrors = {};

  const price = parseNumber(input.homePrice);
  const down = parseNumber(input.downPayment);
  const term = parseNumber(input.loanTermYears);
  const rate = parseNumber(input.interestRatePercent);

  if (price.blank) {
    errors.homePrice = 'Enter a home price.';
  } else if (price.invalid || price.value === null) {
    errors.homePrice = 'Enter a valid home price.';
  } else if (!(price.value > 0)) {
    errors.homePrice = 'Home price must be greater than zero.';
  }

  if (down.blank) {
    errors.downPayment = 'Enter a down payment.';
  } else if (down.invalid || down.value === null) {
    errors.downPayment = 'Enter a valid down payment.';
  } else if (down.value < 0) {
    errors.downPayment = 'Down payment cannot be negative.';
  } else if (input.downPaymentUnit === 'percent' && down.value >= 100) {
    errors.downPayment = 'Down payment percent must be less than 100%.';
  } else if (
    input.downPaymentUnit === 'amount' &&
    price.value !== null &&
    down.value >= price.value
  ) {
    errors.downPayment = 'Down payment must be less than the home price.';
  }

  if (term.blank) {
    errors.loanTermYears = 'Enter a loan term.';
  } else if (term.invalid || term.value === null) {
    errors.loanTermYears = 'Enter a valid loan term.';
  } else if (!(term.value > 0)) {
    errors.loanTermYears = 'Loan term must be greater than zero.';
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

  const computed = calculateVaMortgage({
    homePrice: price.value!,
    downPayment: down.value!,
    downPaymentUnit: input.downPaymentUnit,
    loanTermYears: term.value!,
    interestRatePercent: rate.value!,
    eligibility: input.eligibility,
    usedVaLoanBefore: input.usedVaLoanBefore,
    serviceRelatedDisability: input.serviceRelatedDisability,
    fundingFeePayment: input.fundingFeePayment,
  });

  if (!computed) {
    errors.form = 'This combination does not produce a finite VA mortgage result.';
    return { isValid: false, errors, result: null };
  }

  const result: VaMortgageResult = {
    ...computed,
    formattedHomePrice: formatVaMoney(computed.homePrice),
    formattedDownPayment: formatVaMoney(computed.downPayment),
    formattedFundingFee: formatVaMoney(computed.fundingFee),
    formattedFundingFeeRatePercent: formatVaPercent(computed.fundingFeeRatePercent),
    formattedLoanAmount: formatVaMoney(computed.loanAmount),
    formattedMonthlyPayment: formatVaMoney(computed.monthlyPayment),
    formattedTotalOfPayments: formatVaMoney(computed.totalOfPayments),
    formattedTotalInterest: formatVaMoney(computed.totalInterest),
  };

  return { isValid: true, errors: {}, result };
}
