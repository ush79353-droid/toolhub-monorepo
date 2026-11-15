import { isSupportedCurrency } from '@/tools/shared/currency';
import { calculateBuildVsBuy } from './calculation';
import {
  BUILD_TIME_UNITS,
  PAYBACK_UNITS,
  type BuildVsBuyFieldErrors,
  type BuildVsBuyInput,
  type BuildVsBuyResult,
} from './types';

function finite(value: number): boolean {
  return Number.isFinite(value);
}

export function validateBuildVsBuy(input: BuildVsBuyInput): {
  isValid: boolean;
  incomplete: boolean;
  errors: BuildVsBuyFieldErrors;
  result: BuildVsBuyResult | null;
} {
  const errors: BuildVsBuyFieldErrors = {};

  if (!isSupportedCurrency(input.currency)) errors.currency = 'Choose a supported currency';
  if (!BUILD_TIME_UNITS.includes(input.buildTimeUnit)) {
    errors.buildTimeUnit = 'Choose a build duration unit';
  }
  if (!PAYBACK_UNITS.includes(input.paybackUnit)) {
    errors.paybackUnit = 'Choose a payback unit';
  }

  const required: { key: keyof BuildVsBuyInput; label: string; allowZero: boolean }[] = [
    { key: 'buyCostAnnual', label: 'External service cost', allowZero: true },
    { key: 'employees', label: 'Employees required', allowZero: false },
    { key: 'buildTime', label: 'Time to build', allowZero: true },
    { key: 'salaryMonthly', label: 'Employee salary', allowZero: true },
    { key: 'overheadPercent', label: 'Overhead', allowZero: true },
    { key: 'maintenanceDaysPerMonth', label: 'Days of maintenance', allowZero: true },
  ];

  let anyBlank = false;
  for (const field of required) {
    const value = input[field.key];
    if (typeof value !== 'number' || !finite(value)) {
      anyBlank = true;
      continue;
    }
    if (value < 0) {
      errors[field.key] = `${field.label} cannot be negative`;
    } else if (!field.allowZero && value === 0) {
      errors[field.key] = `${field.label} must be greater than zero`;
    }
  }

  if (finite(input.overheadPercent) && input.overheadPercent > 1000) {
    errors.overheadPercent = 'Overhead must be 1,000% or less';
  }
  if (finite(input.maintenanceDaysPerMonth) && input.maintenanceDaysPerMonth > WORKING_CAP) {
    errors.maintenanceDaysPerMonth = `Days of maintenance must be ${WORKING_CAP} or fewer per month`;
  }

  if (anyBlank || Object.keys(errors).length > 0) {
    return {
      isValid: false,
      incomplete: anyBlank && Object.keys(errors).length === 0,
      errors,
      result: null,
    };
  }

  const result = calculateBuildVsBuy(input);
  if (!result) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, incomplete: false, errors, result: null };
  }

  return { isValid: true, incomplete: false, errors: {}, result };
}

const WORKING_CAP = 31;
