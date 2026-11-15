import { isSupportedCurrency } from '@/tools/shared/currency';
import type {
  FiveTwentyNineFieldErrors,
  FiveTwentyNineInput,
  FiveTwentyNineValidationResult,
} from './types';

const MAX_MONEY = 1_000_000_000_000;

function finite(
  value: number,
  min: number,
  max: number,
  label: string,
  errors: FiveTwentyNineFieldErrors,
  key: keyof FiveTwentyNineInput
): void {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    errors[key] = `Enter a valid ${label}.`;
    return;
  }
  if (value < min || value > max) {
    errors[key] = `${label} must be between ${min} and ${max}.`;
  }
}

function integerAge(
  value: number,
  min: number,
  max: number,
  label: string,
  errors: FiveTwentyNineFieldErrors,
  key: keyof FiveTwentyNineInput
): void {
  finite(value, min, max, label, errors, key);
  if (errors[key]) return;
  if (!Number.isInteger(value)) {
    errors[key] = `${label} must be a whole number of years.`;
  }
}

export function validateFiveTwentyNineInput(input: FiveTwentyNineInput): FiveTwentyNineValidationResult {
  const errors: FiveTwentyNineFieldErrors = {};

  integerAge(input.currentAge, 0, 30, 'Current age', errors, 'currentAge');
  integerAge(input.collegeStartAge, 0, 40, 'College start age', errors, 'collegeStartAge');
  integerAge(input.collegeYears, 1, 8, 'College years', errors, 'collegeYears');

  if (!errors.currentAge && !errors.collegeStartAge && input.collegeStartAge < input.currentAge) {
    errors.collegeStartAge = 'College start age must be at least the current age.';
  }

  finite(input.currentAnnualCost, 0, MAX_MONEY, 'Annual education cost', errors, 'currentAnnualCost');
  finite(input.educationInflationPercent, -10, 30, 'Education inflation', errors, 'educationInflationPercent');
  finite(input.annualScholarship, 0, MAX_MONEY, 'Scholarship', errors, 'annualScholarship');
  finite(input.currentBalance, 0, MAX_MONEY, 'Current balance', errors, 'currentBalance');
  finite(input.initialLumpSum, 0, MAX_MONEY, 'Lump sum', errors, 'initialLumpSum');
  finite(input.monthlyContribution, 0, MAX_MONEY, 'Monthly contribution', errors, 'monthlyContribution');
  finite(input.annualReturnPercent, -50, 50, 'Annual return', errors, 'annualReturnPercent');
  finite(input.annualFeePercent, 0, 10, 'Annual fee', errors, 'annualFeePercent');
  finite(
    input.annualContributionGrowthPercent,
    -50,
    100,
    'Contribution growth',
    errors,
    'annualContributionGrowthPercent'
  );
  finite(
    input.additionalAnnualContribution,
    0,
    MAX_MONEY,
    'Additional annual contribution',
    errors,
    'additionalAnnualContribution'
  );
  finite(input.targetFundingPercent, 0, 100, 'Target funding', errors, 'targetFundingPercent');

  if (input.contributionTiming !== 'beginning' && input.contributionTiming !== 'end') {
    errors.contributionTiming = 'Choose beginning or end of month.';
  }
  if (input.collegePaymentTiming !== 'start' && input.collegePaymentTiming !== 'end') {
    errors.collegePaymentTiming = 'Choose when college costs are paid.';
  }

  if (input.annualContributionAlert !== null) {
    finite(
      input.annualContributionAlert,
      0,
      MAX_MONEY,
      'Contribution alert',
      errors,
      'annualContributionAlert'
    );
  }

  if (typeof input.currency !== 'string' || !isSupportedCurrency(input.currency)) {
    errors.currency = 'Choose a supported currency.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
