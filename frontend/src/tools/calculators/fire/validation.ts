import {
  calculateFirePlan,
  isFireInputBlank,
  parseOptionalNumber,
} from './calculation';
import type { FireFieldErrors, FireInput, FireResult } from './types';

export interface FireValidation {
  isValid: boolean;
  incomplete: boolean;
  errors: FireFieldErrors;
  result: FireResult | null;
}

export function validateFireInput(input: FireInput): FireValidation {
  const errors: FireFieldErrors = {};

  if (isFireInputBlank(input)) {
    return { isValid: false, incomplete: true, errors: {}, result: null };
  }

  const currentAge = parseOptionalNumber(input.currentAge);
  const retirementAge = parseOptionalNumber(input.retirementAge);
  const lifeExpectancy = parseOptionalNumber(input.lifeExpectancy);
  const annualIncome = parseOptionalNumber(input.annualIncome);
  let expenses = parseOptionalNumber(input.expenses);
  const currentSavings = parseOptionalNumber(input.currentSavings);
  const investmentReturn = parseOptionalNumber(input.investmentReturnPercent);
  const expenseInflation = parseOptionalNumber(input.expenseInflationPercent);
  const salaryGrowth = parseOptionalNumber(input.salaryGrowthPercent);
  const swr = parseOptionalNumber(input.safeWithdrawalRatePercent);

  if (currentAge === null || currentAge < 0 || currentAge > 120) {
    errors.currentAge = 'Enter a valid current age.';
  }
  if (retirementAge === null || retirementAge < 0 || retirementAge > 120) {
    errors.retirementAge = 'Enter a valid retirement age.';
  }
  if (lifeExpectancy === null || lifeExpectancy < 0 || lifeExpectancy > 130) {
    errors.lifeExpectancy = 'Enter a valid life expectancy.';
  }
  if (
    currentAge !== null &&
    retirementAge !== null &&
    !(retirementAge > currentAge)
  ) {
    errors.retirementAge = 'Retirement age must be greater than current age.';
  }
  if (
    retirementAge !== null &&
    lifeExpectancy !== null &&
    !(lifeExpectancy > retirementAge)
  ) {
    errors.lifeExpectancy = 'Life expectancy must be greater than retirement age.';
  }
  if (annualIncome === null || !(annualIncome > 0)) {
    errors.annualIncome = 'Enter an annual income greater than zero.';
  }
  if (expenses === null || !(expenses > 0)) {
    errors.expenses = 'Enter expenses greater than zero.';
  } else if (input.expenseFrequency === 'monthly') {
    expenses *= 12;
  }
  if (currentSavings === null || currentSavings < 0) {
    errors.currentSavings = 'Enter current savings of zero or more.';
  }
  if (investmentReturn === null || investmentReturn < -99) {
    errors.investmentReturnPercent = 'Enter a valid investment return.';
  }
  if (expenseInflation === null || expenseInflation < -99) {
    errors.expenseInflationPercent = 'Enter a valid expense inflation rate.';
  }
  if (salaryGrowth === null || salaryGrowth < -99) {
    errors.salaryGrowthPercent = 'Enter a valid salary growth rate.';
  }
  if (
    input.method !== 'traditional-fire' &&
    (swr === null || !(swr > 0) || swr > 100)
  ) {
    errors.safeWithdrawalRatePercent =
      'Enter a safe withdrawal rate between 0 and 100%.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, incomplete: false, errors, result: null };
  }

  const result = calculateFirePlan({
    currentAge: currentAge!,
    retirementAge: retirementAge!,
    lifeExpectancy: lifeExpectancy!,
    annualIncome: annualIncome!,
    annualExpenses: expenses!,
    currentSavings: currentSavings!,
    investmentReturnPercent: investmentReturn!,
    expenseInflationPercent: expenseInflation!,
    salaryGrowthPercent: salaryGrowth!,
    safeWithdrawalRatePercent: swr ?? 4,
    method: input.method,
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
