import {
  calculateLifetimeEarningsResults,
  isLifetimeEarningsInputBlank,
  parseOptionalNumber,
} from './calculation';
import type {
  LifetimeEarningsFieldErrors,
  LifetimeEarningsInput,
  LifetimeEarningsResult,
} from './types';

export interface LifetimeEarningsValidation {
  isValid: boolean;
  incomplete: boolean;
  errors: LifetimeEarningsFieldErrors;
  result: LifetimeEarningsResult | null;
}

const MAX_AGE = 120;
const MAX_SALARY = 1e15;
const MAX_GROWTH = 1000;

export function validateLifetimeEarningsInput(
  input: LifetimeEarningsInput,
): LifetimeEarningsValidation {
  const errors: LifetimeEarningsFieldErrors = {};

  if (isLifetimeEarningsInputBlank(input)) {
    return { isValid: false, incomplete: true, errors: {}, result: null };
  }

  const currentAge = parseOptionalNumber(input.currentAge);
  const retirementAge = parseOptionalNumber(input.retirementAge);
  const currentSalary = parseOptionalNumber(input.currentSalary);
  const growth = parseOptionalNumber(input.annualSalaryIncrease);

  if (
    currentAge === null ||
    !Number.isInteger(currentAge) ||
    currentAge < 0 ||
    currentAge > MAX_AGE
  ) {
    errors.currentAge = 'Enter a valid whole-number current age.';
  }
  if (
    retirementAge === null ||
    !Number.isInteger(retirementAge) ||
    retirementAge < 0 ||
    retirementAge > MAX_AGE
  ) {
    errors.retirementAge = 'Enter a valid whole-number retirement age.';
  }
  if (
    currentAge !== null &&
    retirementAge !== null &&
    !(retirementAge > currentAge)
  ) {
    errors.retirementAge = 'Retirement age must be greater than current age.';
  }
  if (currentSalary === null || !(currentSalary > 0) || currentSalary > MAX_SALARY) {
    errors.currentSalary = 'Enter a positive annual salary.';
  }
  if (growth === null || growth < 0 || growth > MAX_GROWTH) {
    errors.annualSalaryIncrease =
      'Enter an expected annual increase of 0% or more.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, incomplete: false, errors, result: null };
  }

  const result = calculateLifetimeEarningsResults({
    currentAge: currentAge!,
    retirementAge: retirementAge!,
    currentSalary: currentSalary!,
    annualSalaryIncreasePercent: growth!,
    currency: input.currency,
  });

  if (!result) {
    return {
      isValid: false,
      incomplete: false,
      errors: { form: 'Unable to calculate with the provided values.' },
      result: null,
    };
  }

  return { isValid: true, incomplete: false, errors: {}, result };
}
