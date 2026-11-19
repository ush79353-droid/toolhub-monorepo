import { calculateUnpaidWork, parseOptionalNumber } from './calculation';
import type {
  UnpaidWorkFieldErrors,
  UnpaidWorkInput,
  UnpaidWorkResult,
} from './types';

export function validateUnpaidWorkInput(input: UnpaidWorkInput): {
  isValid: boolean;
  errors: UnpaidWorkFieldErrors;
  result: UnpaidWorkResult | null;
  incomplete: boolean;
} {
  const errors: UnpaidWorkFieldErrors = {};
  const income = parseOptionalNumber(input.income);
  const budget = parseOptionalNumber(input.outsourcingBudget);
  const family = parseOptionalNumber(input.familySharedHours);

  const parsed = input.activities.map((row) => ({
    id: row.id,
    hours: parseOptionalNumber(row.hoursPerWeek),
    rate: parseOptionalNumber(row.outsourcingRate),
  }));

  if (
    income === null ||
    budget === null ||
    family === null ||
    parsed.some((row) => row.hours === null || row.rate === null)
  ) {
    return { isValid: false, errors: {}, result: null, incomplete: true };
  }

  if (income < 0) {
    errors.income = 'Income cannot be negative.';
  }
  if (parsed.some((row) => (row.hours as number) < 0)) {
    errors.hours = 'Hours per week cannot be negative.';
  }
  const totalHours = parsed.reduce((sum, row) => sum + (row.hours as number), 0);
  if (totalHours > 168) {
    errors.hours = 'Total unpaid hours cannot exceed 168 hours per week.';
  }
  if (parsed.some((row) => (row.rate as number) < 0)) {
    errors.rates = 'Outsourcing rates cannot be negative.';
  }
  if (budget < 0) {
    errors.outsourcingBudget = 'Outsourcing budget cannot be negative.';
  }
  if (family < 0) {
    errors.familySharedHours = 'Family shared hours cannot be negative.';
  } else if (family > totalHours) {
    errors.familySharedHours =
      'Family shared hours cannot exceed total unpaid hours.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null, incomplete: false };
  }

  const result = calculateUnpaidWork({
    countryId: input.countryId,
    income,
    incomeFrequency: input.incomeFrequency,
    activities: parsed.map((row) => ({
      id: row.id,
      hoursPerWeek: row.hours as number,
      outsourcingRate: row.rate as number,
    })),
    outsourcingBudget: budget,
    familySharedHours: family,
  });

  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate unpaid work with these inputs.' },
      result: null,
      incomplete: false,
    };
  }

  return { isValid: true, errors, result, incomplete: false };
}
