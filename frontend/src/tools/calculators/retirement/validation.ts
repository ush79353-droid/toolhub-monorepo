import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculateRetirement,
  periodToAnnual,
  toRetirementResult,
} from './calculation';
import type {
  RetirementFieldErrors,
  RetirementInput,
  RetirementResult,
} from './types';

export interface RetirementValidation {
  isValid: boolean;
  errors: RetirementFieldErrors;
  result: RetirementResult | null;
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
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export function validateRetirementInput(
  input: RetirementInput
): RetirementValidation {
  const errors: RetirementFieldErrors = {};
  const currency = input.currency;
  const symbol = getCurrencySymbol(currency);
  let hasFieldError = false;

  const currentAge = parseNumber(input.currentAge);
  if (currentAge.blank) {
    errors.currentAge = 'Enter your current age.';
    hasFieldError = true;
  } else if (currentAge.invalid || currentAge.value === null) {
    errors.currentAge = 'Enter a valid current age.';
    hasFieldError = true;
  } else if (currentAge.value < 0 || currentAge.value > 120) {
    errors.currentAge = 'Current age must be between 0 and 120.';
    hasFieldError = true;
  }

  const retirementAge = parseNumber(input.retirementAge);
  if (retirementAge.blank) {
    errors.retirementAge = 'Enter your retirement age.';
    hasFieldError = true;
  } else if (retirementAge.invalid || retirementAge.value === null) {
    errors.retirementAge = 'Enter a valid retirement age.';
    hasFieldError = true;
  } else if (retirementAge.value < 0 || retirementAge.value > 120) {
    errors.retirementAge = 'Retirement age must be between 0 and 120.';
    hasFieldError = true;
  }

  const lifeExpectancy = parseNumber(input.lifeExpectancy);
  if (lifeExpectancy.blank) {
    errors.lifeExpectancy = 'Enter a life expectancy.';
    hasFieldError = true;
  } else if (lifeExpectancy.invalid || lifeExpectancy.value === null) {
    errors.lifeExpectancy = 'Enter a valid life expectancy.';
    hasFieldError = true;
  } else if (lifeExpectancy.value <= 0 || lifeExpectancy.value > 130) {
    errors.lifeExpectancy = 'Life expectancy must be between 0 and 130.';
    hasFieldError = true;
  }

  const savings = parseNumber(input.savingsAmount);
  if (savings.blank) {
    // Treat blank ongoing savings as zero.
  } else if (savings.invalid || savings.value === null) {
    errors.savingsAmount = 'Enter a valid savings amount.';
    hasFieldError = true;
  } else if (savings.value < 0) {
    errors.savingsAmount = 'Savings cannot be negative.';
    hasFieldError = true;
  }

  const already = parseNumber(input.alreadySaved);
  if (already.blank) {
    // Blank already-saved → 0
  } else if (already.invalid || already.value === null) {
    errors.alreadySaved = 'Enter a valid amount already saved.';
    hasFieldError = true;
  } else if (already.value < 0) {
    errors.alreadySaved = 'Amount already saved cannot be negative.';
    hasFieldError = true;
  }

  const ret = parseNumber(input.investmentReturn);
  if (ret.blank) {
    errors.investmentReturn = 'Enter the expected investment return.';
    hasFieldError = true;
  } else if (ret.invalid || ret.value === null) {
    errors.investmentReturn = 'Enter a valid investment return.';
    hasFieldError = true;
  } else if (ret.value <= -100) {
    errors.investmentReturn = 'Return cannot be −100% or lower.';
    hasFieldError = true;
  }

  const pension = parseNumber(input.governmentPension);
  if (pension.blank) {
    // blank → 0
  } else if (pension.invalid || pension.value === null) {
    errors.governmentPension = 'Enter a valid government pension.';
    hasFieldError = true;
  } else if (pension.value < 0) {
    errors.governmentPension = 'Government pension cannot be negative.';
    hasFieldError = true;
  }

  const col = parseNumber(input.costOfLiving);
  if (col.blank) {
    // blank → 0
  } else if (col.invalid || col.value === null) {
    errors.costOfLiving = 'Enter a valid cost of living.';
    hasFieldError = true;
  } else if (col.value < 0) {
    errors.costOfLiving = 'Cost of living cannot be negative.';
    hasFieldError = true;
  }

  if (hasFieldError) {
    return { isValid: false, errors, result: null };
  }

  if (
    currentAge.value === null ||
    retirementAge.value === null ||
    lifeExpectancy.value === null ||
    ret.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const annualSavings = periodToAnnual(
    savings.value ?? 0,
    input.savingsPeriod
  );
  const governmentPensionAnnual = periodToAnnual(
    pension.value ?? 0,
    input.governmentPensionPeriod
  );
  const costOfLivingAnnual = periodToAnnual(
    col.value ?? 0,
    input.costOfLivingPeriod
  );

  const mathInput = {
    sex: input.sex,
    country: input.country,
    currentAge: currentAge.value,
    retirementAge: retirementAge.value,
    lifeExpectancy: lifeExpectancy.value,
    annualSavings,
    alreadySaved: already.value ?? 0,
    annualReturnPercent: ret.value,
    governmentPensionAnnual,
    costOfLivingAnnual,
  };

  const math = calculateRetirement(mathInput);
  if (math === null) {
    errors.form = 'Unable to project with these inputs.';
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors,
    result: toRetirementResult(
      math,
      mathInput,
      currency,
      symbol,
      input.incomeDisplayPeriod
    ),
  };
}
