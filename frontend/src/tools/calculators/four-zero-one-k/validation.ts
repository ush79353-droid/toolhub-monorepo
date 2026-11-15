import { isSupportedCurrency } from '@/tools/shared/currency';
import {
  MAX_AGE,
  MAX_FEE,
  MAX_INFLATION,
  MAX_MATCH_RATE,
  MAX_MONEY,
  MAX_RETURN,
  MAX_SALARY_GROWTH,
  MAX_WITHDRAWAL,
  MAX_YEARS,
  MIN_AGE,
  MIN_RETURN,
  type FourZeroOneKField,
  type FourZeroOneKFieldErrors,
  type FourZeroOneKInput,
} from './types';

/** Blank and a half-typed sign or decimal become null. Any other non-number becomes NaN. */
export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim();
  if (cleaned === '' || cleaned === '.' || cleaned === '-' || cleaned === '-.') return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function checkMoney(
  errors: FourZeroOneKFieldErrors,
  field: FourZeroOneKField,
  value: number,
  label: string,
  allowZero: boolean,
): void {
  if (!Number.isFinite(value) || value < 0 || value > MAX_MONEY) {
    errors[field] = `Enter a ${label} from 0 to 100,000,000.`;
    return;
  }
  if (!allowZero && value === 0) {
    errors[field] = `Enter a ${label} above 0.`;
  }
}

function checkPercent(
  errors: FourZeroOneKFieldErrors,
  field: FourZeroOneKField,
  decimal: number,
  label: string,
  min: number,
  max: number,
): void {
  if (!Number.isFinite(decimal) || decimal < min || decimal > max) {
    const minPct = min * 100;
    const maxPct = max * 100;
    errors[field] = `Enter a ${label} from ${minPct} to ${maxPct}.`;
  }
}

export function validateFourZeroOneK(input: FourZeroOneKInput): {
  isValid: boolean;
  errors: FourZeroOneKFieldErrors;
} {
  const errors: FourZeroOneKFieldErrors = {};

  if (!Number.isInteger(input.currentAge) || input.currentAge < MIN_AGE || input.currentAge > 90) {
    errors.currentAge = `Enter a current age from ${MIN_AGE} to 90.`;
  }
  if (
    !Number.isInteger(input.retirementAge) ||
    input.retirementAge <= input.currentAge ||
    input.retirementAge > MAX_AGE
  ) {
    errors.retirementAge = 'Retirement age must be a whole number after the current age, and 100 or less.';
  } else if (input.retirementAge - input.currentAge > MAX_YEARS) {
    errors.retirementAge = `This projection stops at ${MAX_YEARS} years.`;
  }

  checkMoney(errors, 'balance', input.balance, 'current balance', true);
  checkMoney(errors, 'annualSalary', input.annualSalary, 'annual salary', true);
  checkPercent(
    errors,
    'salaryGrowthPercent',
    input.salaryGrowthRate,
    'salary growth rate',
    -MAX_SALARY_GROWTH,
    MAX_SALARY_GROWTH,
  );
  if (input.salaryCap !== null) {
    checkMoney(errors, 'salaryCap', input.salaryCap, 'salary cap', false);
  }

  if (input.contributionKind === 'percent') {
    checkPercent(errors, 'employeePercent', input.employeePercent, 'employee contribution', 0, 1);
  } else {
    checkMoney(errors, 'employeeFixedAnnual', input.employeeFixedAnnual, 'fixed contribution', true);
  }
  if (input.contributionKind === 'percent') {
    checkPercent(errors, 'contributionIncrease', input.contributionIncrease, 'contribution increase', 0, 0.2);
  } else {
    checkPercent(errors, 'contributionIncrease', input.contributionIncrease, 'contribution growth', -0.5, 0.5);
  }

  if (input.matchKind === 'partial') {
    checkPercent(errors, 'matchRatePercent', input.matchRate, 'employer match', 0, MAX_MATCH_RATE);
    checkPercent(errors, 'matchUpToPercent', input.matchUpToPercent, 'matched salary share', 0, 1);
  } else if (input.matchKind === 'dollar-for-dollar') {
    checkPercent(errors, 'matchUpToPercent', input.matchUpToPercent, 'matched salary share', 0, 1);
  } else if (input.matchKind === 'fixed') {
    checkPercent(errors, 'fixedEmployerPercent', input.fixedEmployerPercent, 'employer contribution', 0, 1);
  }
  checkMoney(errors, 'extraEmployerAnnual', input.extraEmployerAnnual, 'extra employer contribution', true);

  checkPercent(errors, 'annualReturnPercent', input.annualReturn, 'investment return', MIN_RETURN, MAX_RETURN);
  checkPercent(errors, 'annualFeePercent', input.annualFeeRate, 'investment fee', 0, MAX_FEE);
  checkPercent(errors, 'inflationPercent', input.inflationRate, 'inflation rate', 0, MAX_INFLATION);
  checkPercent(errors, 'vestingPercent', input.vestingPercent, 'vesting share', 0, 1);
  if (input.withdrawalRate !== null) {
    checkPercent(errors, 'withdrawalPercent', input.withdrawalRate, 'withdrawal rate', 0, MAX_WITHDRAWAL);
  }

  if (input.mode === 'required') {
    if (input.targetBalance === null || !Number.isFinite(input.targetBalance)) {
      errors.targetBalance = 'Enter the retirement balance you want to reach.';
    } else {
      checkMoney(errors, 'targetBalance', input.targetBalance, 'target balance', false);
    }
  } else if (input.targetBalance !== null) {
    checkMoney(errors, 'targetBalance', input.targetBalance, 'target balance', false);
  }

  if (!isSupportedCurrency(input.currency)) {
    errors.currency = 'Choose a supported currency.';
  }

  if (input.applyLimits) {
    if (input.currency !== 'USD') {
      errors.electiveDeferralLimit =
        'US contribution limits are published in USD. This calculator does not convert them. Switch the currency to USD or turn limits off.';
    } else if (input.electiveDeferralLimit === null || !Number.isFinite(input.electiveDeferralLimit)) {
      errors.electiveDeferralLimit = 'Enter the elective deferral limit for the tax year you have in mind.';
    } else {
      checkMoney(errors, 'electiveDeferralLimit', input.electiveDeferralLimit, 'elective deferral limit', false);
    }
    const catchUpStarted =
      input.catchUpAge !== null || (input.catchUpAmount !== null && input.catchUpAmount !== 0);
    if (catchUpStarted) {
      if (input.catchUpAge === null || !Number.isInteger(input.catchUpAge) || input.catchUpAge < MIN_AGE || input.catchUpAge > MAX_AGE) {
        errors.catchUpAge = `Enter a catch-up age from ${MIN_AGE} to ${MAX_AGE}.`;
      }
      if (input.catchUpAmount === null || !Number.isFinite(input.catchUpAmount)) {
        errors.catchUpAmount = 'Enter the extra deferral allowed from that age, or leave both catch-up fields blank.';
      } else {
        checkMoney(errors, 'catchUpAmount', input.catchUpAmount, 'catch-up amount', true);
      }
    }
    if (input.annualAdditionsLimit !== null) {
      checkMoney(errors, 'annualAdditionsLimit', input.annualAdditionsLimit, 'annual additions limit', false);
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
