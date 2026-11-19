import {
  calculateIncomePercentile,
  parseOptionalNumber,
} from './calculation';
import type {
  UsIncomePercentileFieldErrors,
  UsIncomePercentileInput,
  UsIncomePercentileResult,
} from './types';

export function validateUsIncomePercentileInput(
  input: UsIncomePercentileInput,
): {
  isValid: boolean;
  errors: UsIncomePercentileFieldErrors;
  result: UsIncomePercentileResult | null;
  incomplete: boolean;
} {
  const income = parseOptionalNumber(input.annualIncome);
  if (income === null) {
    return { isValid: false, errors: {}, result: null, incomplete: true };
  }
  if (income < 0) {
    return {
      isValid: false,
      errors: {
        annualIncome:
          'Enter zero or a positive income. Negative amounts are not ranked; the person-income table mixes losses into its lowest bin.',
      },
      result: null,
      incomplete: false,
    };
  }
  const result = calculateIncomePercentile({
    incomeType: input.incomeType,
    annualIncome: income,
  });
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to compare that income with the published tables.' },
      result: null,
      incomplete: false,
    };
  }
  return { isValid: true, errors: {}, result, incomplete: false };
}
