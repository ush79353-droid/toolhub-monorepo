import type {
  BusinessLoanFieldErrors,
  BusinessLoanInput,
  BusinessLoanParsedValues,
} from './types';

export function validateBusinessLoanInput(input: BusinessLoanInput): {
  isValid: boolean;
  errors: BusinessLoanFieldErrors;
  parsedValues: BusinessLoanParsedValues | null;
} {
  const errors: BusinessLoanFieldErrors = {};

  const parseNumber = (val: string): number | null => {
    const trimmed = val.trim().replace(/,/g, '');
    if (!trimmed) return null;
    const num = Number(trimmed);
    return Number.isFinite(num) ? num : NaN;
  };

  const loanAmount = parseNumber(input.loanAmount);
  if (loanAmount === null) {
    errors.loanAmount = 'Loan amount is required';
  } else if (Number.isNaN(loanAmount) || loanAmount <= 0) {
    errors.loanAmount = 'Loan amount must be greater than zero';
  }

  const interestRate = parseNumber(input.interestRate);
  if (interestRate === null) {
    errors.interestRate = 'Interest rate is required';
  } else if (Number.isNaN(interestRate) || interestRate < 0) {
    errors.interestRate = 'Interest rate cannot be negative';
  }

  const termYears = parseNumber(input.termYears) ?? 0;
  if (Number.isNaN(termYears) || termYears < 0) {
    errors.termYears = 'Years must be a non-negative number';
  }

  const termMonths = parseNumber(input.termMonths) ?? 0;
  if (Number.isNaN(termMonths) || termMonths < 0) {
    errors.termMonths = 'Months must be a non-negative number';
  }

  if (!errors.termYears && !errors.termMonths && termYears === 0 && termMonths === 0) {
    errors.termYears = 'Loan term must be at least 1 month';
  }

  const prepaidFee = parseNumber(input.prepaidFee) ?? 0;
  if (Number.isNaN(prepaidFee) || prepaidFee < 0) {
    errors.prepaidFee = 'Prepaid fee cannot be negative';
  }

  const loanedFee = parseNumber(input.loanedFee) ?? 0;
  if (Number.isNaN(loanedFee) || loanedFee < 0) {
    errors.loanedFee = 'Loaned fee cannot be negative';
  }

  const originationFee = parseNumber(input.originationFee) ?? 0;
  if (Number.isNaN(originationFee) || originationFee < 0) {
    errors.originationFee = 'Origination fee cannot be negative';
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    parsedValues: isValid
      ? {
          knownRate: input.knownRate,
          interestRate: interestRate!,
          compoundFrequency: input.compoundFrequency,
          loanAmount: loanAmount!,
          termYears,
          termMonths,
          paymentFrequency: input.paymentFrequency,
          prepaidFee,
          loanedFee,
          originationFee,
          originationFeeRepayment: input.originationFeeRepayment,
          currency: input.currency,
        }
      : null,
  };
}
