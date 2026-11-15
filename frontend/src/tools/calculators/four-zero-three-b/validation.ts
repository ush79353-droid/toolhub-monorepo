import { isSupportedCurrency } from '@/tools/shared/currency';
import {
  MAX_AGE,
  MAX_FEE,
  MAX_INFLATION,
  MAX_MATCH_RATE,
  MAX_MONEY,
  MAX_RETURN,
  MAX_SALARY_GROWTH,
  MAX_YEARS,
  MIN_AGE,
  MIN_RETURN,
  type FourZeroThreeBField,
  type FourZeroThreeBFieldErrors,
  type FourZeroThreeBInput,
} from './types';

/** Blank and a half-typed sign or decimal become null. Any other non-number becomes NaN. */
export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim();
  if (cleaned === '' || cleaned === '.' || cleaned === '-' || cleaned === '-.') return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function salaryChangesBalance(input: FourZeroThreeBInput): boolean {
  const employeeLinked = input.contributionKind === 'percent' && input.employeePercent > 0;
  if (employeeLinked) return true;
  if (input.matchKind === 'fixed-percent' && input.fixedEmployerPercent > 0) return true;
  if (input.matchKind === 'percent-of-contribution' && input.matchRate > 0 && input.matchUpToPercent > 0) {
    if (input.contributionKind === 'percent') return input.employeePercent > 0;
    return input.employeeFixedAnnual > 0;
  }
  return false;
}

function checkMoney(
  errors: FourZeroThreeBFieldErrors,
  field: FourZeroThreeBField,
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
  errors: FourZeroThreeBFieldErrors,
  field: FourZeroThreeBField,
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

export function validateFourZeroThreeB(input: FourZeroThreeBInput): {
  isValid: boolean;
  errors: FourZeroThreeBFieldErrors;
} {
  const errors: FourZeroThreeBFieldErrors = {};

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

  if (input.contributionKind === 'percent') {
    checkPercent(errors, 'employeePercent', input.employeePercent, 'employee contribution', 0, 1);
  } else {
    checkMoney(errors, 'employeeFixedAnnual', input.employeeFixedAnnual, 'employee contribution', true);
  }
  checkPercent(
    errors,
    'contributionIncrease',
    input.contributionIncrease,
    input.contributionKind === 'percent' ? 'yearly contribution increase' : 'contribution growth rate',
    0,
    input.contributionKind === 'percent' ? 0.2 : MAX_SALARY_GROWTH,
  );

  if (input.matchKind === 'percent-of-contribution') {
    checkPercent(errors, 'matchRatePercent', input.matchRate, 'employer match rate', 0, MAX_MATCH_RATE);
    checkPercent(errors, 'matchUpToPercent', input.matchUpToPercent, 'match limit', 0, 1);
  } else if (input.matchKind === 'fixed-percent') {
    checkPercent(
      errors,
      'fixedEmployerPercent',
      input.fixedEmployerPercent,
      'employer contribution',
      0,
      1,
    );
  }

  checkPercent(errors, 'annualReturnPercent', input.annualReturn, 'investment return', MIN_RETURN, MAX_RETURN);
  checkPercent(errors, 'annualFeePercent', input.annualFeeRate, 'fee rate', 0, MAX_FEE);
  checkPercent(errors, 'inflationPercent', input.inflationRate, 'inflation rate', 0, MAX_INFLATION);
  checkPercent(errors, 'vestingPercent', input.vestingPercent, 'vesting percent', 0, 1);

  const periods = input.frequency === 'monthly' ? 12 : input.frequency === 'biweekly' ? 26 : 1;
  const earned =
    input.rateConvention === 'effective'
      ? (1 + input.annualReturn) ** (1 / periods) - 1
      : input.annualReturn / periods;
  const fee =
    input.rateConvention === 'effective'
      ? (1 + input.annualFeeRate) ** (1 / periods) - 1
      : input.annualFeeRate / periods;
  if (!Number.isFinite(earned) || !Number.isFinite(fee) || 1 + earned - fee < 0) {
    errors.annualReturnPercent =
      'The return and fee together would wipe out the balance in a single period. Lower the fee or raise the return.';
  }

  if (input.mode === 'employee-contribution' || input.mode === 'scenario') {
    if (input.targetBalance === null || !Number.isFinite(input.targetBalance)) {
      errors.targetBalance = 'Enter the retirement balance you want to reach.';
    } else {
      checkMoney(errors, 'targetBalance', input.targetBalance, 'target balance', false);
    }
  }

  if (input.mode === 'scenario' && input.scenarioSolve === 'salary' && !salaryChangesBalance(input)) {
    errors.scenario =
      'Salary does not change this projection. Use a percent of salary, or an employer contribution that depends on salary.';
  }

  if (input.applyLimits) {
    if (input.electiveDeferralLimit === null || !Number.isFinite(input.electiveDeferralLimit)) {
      errors.electiveDeferralLimit = 'Enter the employee deferral limit for the tax year you are modeling.';
    } else {
      checkMoney(errors, 'electiveDeferralLimit', input.electiveDeferralLimit, 'deferral limit', true);
    }
    if (input.catchUpAmount !== null) {
      if (!Number.isFinite(input.catchUpAmount)) {
        errors.catchUpAmount = 'Enter a catch-up amount of 0 or more, or leave it blank.';
      } else if (input.catchUpAmount > 0) {
        if (
          input.catchUpAge === null ||
          !Number.isInteger(input.catchUpAge) ||
          input.catchUpAge < MIN_AGE ||
          input.catchUpAge > MAX_AGE
        ) {
          errors.catchUpAge = 'Enter the age at which the extra catch-up amount starts.';
        }
        checkMoney(errors, 'catchUpAmount', input.catchUpAmount, 'catch-up amount', true);
      }
    }
    if (input.annualAdditionsLimit !== null) {
      checkMoney(errors, 'annualAdditionsLimit', input.annualAdditionsLimit, 'annual additions limit', true);
    }
  }

  if (!isSupportedCurrency(input.currency)) {
    errors.balance = 'Choose a currency.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
