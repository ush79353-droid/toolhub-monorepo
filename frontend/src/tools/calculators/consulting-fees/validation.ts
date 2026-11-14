import { calculateConsultingFees, computeBillableDays, sumOperatingCosts } from './calculation';
import {
  OPERATING_COST_KEYS,
  type ConsultingFeesFieldErrors,
  type ConsultingFeesInput,
  type ConsultingFeesResult,
} from './types';

export function validateConsultingFees(input: ConsultingFeesInput): {
  isValid: boolean;
  incomplete: boolean;
  errors: ConsultingFeesFieldErrors;
  result: ConsultingFeesResult | null;
  billableDays: number | null;
  annualOperatingCosts: number;
} {
  const errors: ConsultingFeesFieldErrors = {};
  const annualOperatingCosts = sumOperatingCosts(input);

  if (!Number.isFinite(input.workingHoursPerDay)) {
    return {
      isValid: false,
      incomplete: true,
      errors,
      result: null,
      billableDays: null,
      annualOperatingCosts,
    };
  }
  if (input.workingHoursPerDay <= 0) {
    errors.workingHoursPerDay = 'Working hours per day must be greater than zero';
  }

  if (!Number.isFinite(input.weekdaysPerYear)) {
    return {
      isValid: false,
      incomplete: true,
      errors,
      result: null,
      billableDays: null,
      annualOperatingCosts,
    };
  }
  if (input.weekdaysPerYear < 0) {
    errors.weekdaysPerYear = 'Weekdays must be zero or greater';
  }

  for (const [key, label] of [
    ['holidayDays', 'Holiday days'],
    ['sickDays', 'Sick days'],
    ['nonClientDays', 'Non-client days'],
  ] as const) {
    const value = input[key];
    if (Number.isFinite(value) && value < 0) {
      errors[key] = `${label} cannot be negative`;
    }
  }

  const billableDays = computeBillableDays(input);
  if (
    billableDays !== null &&
    Number.isFinite(input.weekdaysPerYear) &&
    !errors.weekdaysPerYear &&
    billableDays <= 0
  ) {
    errors.billableDays = 'Billable days must be greater than zero';
  }

  for (const key of OPERATING_COST_KEYS) {
    const value = input[key];
    if (!Number.isFinite(value)) {
      // defaults are 0; treat non-finite as incomplete cost row
      continue;
    }
    if (value < 0) {
      errors[key] = 'Cost cannot be negative';
    }
  }

  if (Number.isFinite(input.averageProjectValue) && input.averageProjectValue < 0) {
    errors.averageProjectValue = 'Average project value cannot be negative';
  }

  if (!Number.isFinite(input.targetIncome)) {
    return {
      isValid: false,
      incomplete: Object.keys(errors).length === 0,
      errors,
      result: null,
      billableDays,
      annualOperatingCosts,
    };
  }
  if (input.targetIncome < 0) {
    errors.targetIncome = 'Target income cannot be negative';
  }

  if (Object.keys(errors).length > 0) {
    return {
      isValid: false,
      incomplete: false,
      errors,
      result: null,
      billableDays,
      annualOperatingCosts,
    };
  }

  const result = calculateConsultingFees(input);
  return {
    isValid: result !== null,
    incomplete: false,
    errors: result ? {} : { form: 'Unable to calculate rates with the current inputs' },
    result,
    billableDays,
    annualOperatingCosts,
  };
}
