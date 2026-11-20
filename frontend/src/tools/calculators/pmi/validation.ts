import {
  calculateAnnualPmi,
  calculateDownPaymentAmount,
  calculateDownPaymentPercentage,
  calculateLoanToValueRatio,
  calculateMonthlyPmi,
  calculateMortgageAmount,
  evaluatePmiApplicability,
  formatPmiMoney,
  formatPmiPercent,
  pmiApplicabilityMessage,
} from './calculation';
import type { PmiFieldErrors, PmiInput, PmiResult } from './types';

export interface PmiValidation {
  isValid: boolean;
  errors: PmiFieldErrors;
  result: PmiResult | null;
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

/**
 * Validates PMI inputs. Down payment uses an explicit amount or percentage mode
 * (no circular sync). PMI math uses the entered rate even when LTV ≤ 80%;
 * applicability guidance is separate.
 */
export function validatePmiInput(input: PmiInput): PmiValidation {
  const errors: PmiFieldErrors = {};

  const homeParsed = parseNumber(input.homePrice);
  let homePrice: number | null = null;
  if (homeParsed.blank) {
    // wait
  } else if (homeParsed.invalid || homeParsed.value === null) {
    errors.homePrice = 'Enter a valid home price.';
  } else if (homeParsed.value <= 0) {
    errors.homePrice = 'Home price must be greater than zero.';
  } else {
    homePrice = homeParsed.value;
  }

  let downPaymentAmount: number | null = null;
  let downPaymentPercentage: number | null = null;

  if (input.downPaymentMode === 'amount') {
    const amountParsed = parseNumber(input.downPaymentAmount);
    if (amountParsed.blank) {
      // wait
    } else if (amountParsed.invalid || amountParsed.value === null) {
      errors.downPaymentAmount = 'Enter a valid down payment amount.';
    } else if (amountParsed.value < 0) {
      errors.downPaymentAmount = 'Down payment cannot be negative.';
    } else if (homePrice !== null && amountParsed.value > homePrice) {
      errors.downPaymentAmount = 'Down payment cannot exceed home price.';
    } else {
      downPaymentAmount = amountParsed.value;
      if (homePrice !== null) {
        downPaymentPercentage = calculateDownPaymentPercentage(
          homePrice,
          downPaymentAmount
        );
      }
    }
  } else {
    const pctParsed = parseNumber(input.downPaymentPercentage);
    if (pctParsed.blank) {
      // wait
    } else if (pctParsed.invalid || pctParsed.value === null) {
      errors.downPaymentPercentage = 'Enter a valid down payment percentage.';
    } else if (pctParsed.value < 0 || pctParsed.value > 100) {
      errors.downPaymentPercentage =
        'Down payment percentage must be between 0% and 100%.';
    } else {
      downPaymentPercentage = pctParsed.value;
      if (homePrice !== null) {
        downPaymentAmount = calculateDownPaymentAmount(
          homePrice,
          downPaymentPercentage
        );
      }
    }
  }

  const rateParsed = parseNumber(input.annualPmiRate);
  let annualPmiRate: number | null = null;
  if (rateParsed.blank) {
    // wait
  } else if (rateParsed.invalid || rateParsed.value === null) {
    errors.annualPmiRate = 'Enter a valid annual PMI rate.';
  } else if (rateParsed.value < 0) {
    errors.annualPmiRate = 'Annual PMI rate cannot be negative.';
  } else if (rateParsed.value > 100) {
    errors.annualPmiRate = 'Annual PMI rate must be 100% or less.';
  } else {
    annualPmiRate = rateParsed.value;
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    homePrice === null ||
    downPaymentAmount === null ||
    downPaymentPercentage === null ||
    annualPmiRate === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const mortgageAmount = calculateMortgageAmount(homePrice, downPaymentAmount);
  if (mortgageAmount === null) {
    errors.form = 'Unable to calculate mortgage amount.';
    return { isValid: false, errors, result: null };
  }

  const ltv = calculateLoanToValueRatio(mortgageAmount, homePrice);
  if (ltv === null) {
    errors.form = 'Unable to calculate loan-to-value ratio.';
    return { isValid: false, errors, result: null };
  }

  const annualPmi = calculateAnnualPmi(mortgageAmount, annualPmiRate);
  const monthlyPmi =
    annualPmi === null ? null : calculateMonthlyPmi(annualPmi);
  if (annualPmi === null || monthlyPmi === null) {
    errors.form = 'Unable to calculate PMI premiums.';
    return { isValid: false, errors, result: null };
  }

  const applicability = evaluatePmiApplicability(ltv);
  const currency = input.currency;

  const result: PmiResult = {
    homePrice,
    downPaymentAmount,
    downPaymentPercentage,
    mortgageAmount,
    loanToValueRatio: ltv,
    annualPmiRate,
    annualPmi,
    monthlyPmi,
    applicability,
    currency,
    formattedHomePrice: formatPmiMoney(homePrice, currency),
    formattedDownPaymentAmount: formatPmiMoney(downPaymentAmount, currency),
    formattedDownPaymentPercentage: formatPmiPercent(downPaymentPercentage),
    formattedMortgageAmount: formatPmiMoney(mortgageAmount, currency),
    formattedLoanToValueRatio: formatPmiPercent(ltv),
    formattedAnnualPmiRate: formatPmiPercent(annualPmiRate),
    formattedAnnualPmi: formatPmiMoney(annualPmi, currency),
    formattedMonthlyPmi: formatPmiMoney(monthlyPmi, currency),
    applicabilityMessage: pmiApplicabilityMessage(applicability),
  };

  return { isValid: true, errors, result };
}
