import { calculateSabbaticalResults } from './calculation';
import type {
  SabbaticalFieldErrors,
  SabbaticalInput,
  SabbaticalResult,
} from './types';

function parseNumber(val: string): number | null | typeof Number.NaN {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

export function validateSabbaticalInput(input: SabbaticalInput): {
  isValid: boolean;
  errors: SabbaticalFieldErrors;
  result: SabbaticalResult | null;
  incomplete: boolean;
} {
  const errors: SabbaticalFieldErrors = {};

  const savingsPercentage = parseNumber(input.savingsPercentage);
  const yearsToSave = parseNumber(input.yearsToSave);
  const desiredDuration = parseNumber(input.desiredDuration);
  const monthlyIncome = parseNumber(input.monthlyIncome);
  const monthlySavings = parseNumber(input.monthlySavings);
  const currentSavings = parseNumber(input.currentSavings);
  const monthlyExpenses = parseNumber(input.monthlyExpenses);
  const bufferPercentage = parseNumber(input.bufferPercentage);

  const required = [
    savingsPercentage,
    yearsToSave,
    desiredDuration,
    monthlyIncome,
    monthlySavings,
    currentSavings,
    monthlyExpenses,
    bufferPercentage,
  ];

  if (required.some((v) => v === null)) {
    return { isValid: false, errors: {}, result: null, incomplete: true };
  }

  if (
    Number.isNaN(savingsPercentage) ||
    (savingsPercentage as number) < 0 ||
    (savingsPercentage as number) > 100
  ) {
    errors.savingsPercentage = 'Enter a savings percentage between 0 and 100.';
  }

  if (Number.isNaN(yearsToSave) || (yearsToSave as number) <= 0) {
    errors.yearsToSave = 'Years to save must be greater than zero.';
  }

  if (Number.isNaN(desiredDuration) || (desiredDuration as number) <= 0) {
    errors.desiredDuration = 'Desired sabbatical duration must be greater than zero.';
  }

  if (Number.isNaN(monthlyIncome) || (monthlyIncome as number) < 0) {
    errors.monthlyIncome = 'Monthly income cannot be negative.';
  }

  if (Number.isNaN(monthlySavings) || (monthlySavings as number) < 0) {
    errors.monthlySavings = 'Monthly savings cannot be negative.';
  }

  if (Number.isNaN(currentSavings) || (currentSavings as number) < 0) {
    errors.currentSavings = 'Current savings cannot be negative.';
  }

  if (Number.isNaN(monthlyExpenses) || (monthlyExpenses as number) < 0) {
    errors.monthlyExpenses = 'Monthly sabbatical expenses cannot be negative.';
  }

  if (
    Number.isNaN(bufferPercentage) ||
    (bufferPercentage as number) < 0 ||
    (bufferPercentage as number) > 100
  ) {
    errors.bufferPercentage = 'Buffer percentage must be between 0 and 100.';
  }

  const isValid = Object.keys(errors).length === 0;
  if (!isValid) {
    return { isValid: false, errors, result: null, incomplete: false };
  }

  const result = calculateSabbaticalResults({
    savingsPercentage: savingsPercentage as number,
    yearsToSave: yearsToSave as number,
    desiredDurationValue: desiredDuration as number,
    durationUnit: input.durationUnit,
    monthlyIncome: monthlyIncome as number,
    monthlySavings: monthlySavings as number,
    currentSavings: currentSavings as number,
    monthlyExpenses: monthlyExpenses as number,
    bufferPercentage: bufferPercentage as number,
    currency: input.currency,
  });

  if (!result) {
    return {
      isValid: false,
      errors: {
        form: 'Unable to calculate a sabbatical plan with the current inputs.',
      },
      result: null,
      incomplete: false,
    };
  }

  return { isValid: true, errors, result, incomplete: false };
}
