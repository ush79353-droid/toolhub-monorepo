import { calculateCollegeCost } from './calculation';
import type {
  CollegeCostFieldErrors,
  CollegeCostInput,
  CollegeCostResult,
} from './types';

function parseRequiredNonNeg(val: string): number | null | typeof Number.NaN {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

function parseNonNegInt(val: string): number | null | typeof Number.NaN {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  if (!Number.isFinite(num) || !Number.isInteger(num)) return Number.NaN;
  return num;
}

function parsePositiveInt(val: string): number | null | typeof Number.NaN {
  const parsed = parseNonNegInt(val);
  if (parsed === null || Number.isNaN(parsed)) return parsed;
  if ((parsed as number) <= 0) return Number.NaN;
  return parsed;
}

export function validateCollegeCostInput(input: CollegeCostInput): {
  isValid: boolean;
  errors: CollegeCostFieldErrors;
  result: CollegeCostResult | null;
} {
  const errors: CollegeCostFieldErrors = {};

  const annual = parseRequiredNonNeg(input.annualCollegeCost);
  if (annual === null) {
    errors.annualCollegeCost = "Enter today's annual college costs";
  } else if (Number.isNaN(annual) || (annual as number) < 0) {
    errors.annualCollegeCost = 'Enter a valid nonnegative annual cost';
  }

  const inflation = parseRequiredNonNeg(input.collegeCostIncreaseRate);
  if (inflation === null) {
    errors.collegeCostIncreaseRate = 'Enter the college cost increase rate (0 allowed)';
  } else if (Number.isNaN(inflation) || (inflation as number) < 0) {
    errors.collegeCostIncreaseRate = 'Enter a valid nonnegative increase rate';
  } else if ((inflation as number) > 100) {
    errors.collegeCostIncreaseRate = 'Increase rate must be 100% or less';
  }

  const duration = parsePositiveInt(input.attendanceDuration);
  if (duration === null) {
    errors.attendanceDuration = 'Enter expected attendance duration in years';
  } else if (Number.isNaN(duration)) {
    errors.attendanceDuration = 'Attendance duration must be a whole number of years greater than zero';
  } else if ((duration as number) > 12) {
    errors.attendanceDuration = 'Attendance duration must be 12 years or less';
  }

  const percent = parseRequiredNonNeg(input.percentFromSavings);
  if (percent === null) {
    errors.percentFromSavings = 'Enter the percent of costs from savings';
  } else if (Number.isNaN(percent) || (percent as number) < 0 || (percent as number) > 100) {
    errors.percentFromSavings = 'Percent from savings must be between 0 and 100';
  }

  const savings = parseRequiredNonNeg(input.currentSavingsBalance);
  if (savings === null) {
    errors.currentSavingsBalance = 'Enter college savings balance (use 0 if none)';
  } else if (Number.isNaN(savings) || (savings as number) < 0) {
    errors.currentSavingsBalance = 'Enter a valid nonnegative savings balance';
  }

  const ret = parseRequiredNonNeg(input.investmentReturnRate);
  if (ret === null) {
    errors.investmentReturnRate = 'Enter the investment return rate (0 allowed)';
  } else if (Number.isNaN(ret) || (ret as number) < 0) {
    errors.investmentReturnRate = 'Enter a valid nonnegative return rate';
  } else if ((ret as number) > 100) {
    errors.investmentReturnRate = 'Return rate must be 100% or less';
  }

  const tax = parseRequiredNonNeg(input.taxRate);
  if (tax === null) {
    errors.taxRate = 'Enter the tax rate on investment return (0 allowed)';
  } else if (Number.isNaN(tax) || (tax as number) < 0 || (tax as number) > 100) {
    errors.taxRate = 'Tax rate must be between 0 and 100';
  }

  const years = parseNonNegInt(input.yearsUntilCollege);
  if (years === null) {
    errors.yearsUntilCollege = 'Enter years until college begins (0 allowed)';
  } else if (Number.isNaN(years) || (years as number) < 0) {
    errors.yearsUntilCollege = 'Years until college must be a whole number of 0 or more';
  } else if ((years as number) > 40) {
    errors.yearsUntilCollege = 'Years until college must be 40 or less';
  }

  const isValid = Object.keys(errors).length === 0;
  if (!isValid) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateCollegeCost({
    annualCollegeCost: annual as number,
    collegeCostIncreaseRate: inflation as number,
    attendanceDuration: duration as number,
    percentFromSavings: percent as number,
    currentSavingsBalance: savings as number,
    investmentReturnRate: ret as number,
    taxRate: tax as number,
    yearsUntilCollege: years as number,
    currency: input.currency,
  });

  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate college costs with the current inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors, result };
}
