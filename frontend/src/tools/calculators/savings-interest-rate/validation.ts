import { calculateSavingsInterestRate } from './calculation';
import type {
  SavingsInterestRateFieldErrors,
  SavingsInterestRateInput,
  SavingsInterestRateResult,
} from './types';

function parseField(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return null;
  if (/infinity|nan/i.test(trimmed)) return Number.NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function validateSavingsInterestRateInput(input: SavingsInterestRateInput): {
  isValid: boolean;
  errors: SavingsInterestRateFieldErrors;
  result: SavingsInterestRateResult | null;
} {
  const errors: SavingsInterestRateFieldErrors = {};

  const goal = parseField(input.savingsGoal);
  const initial = parseField(input.initialBalance);
  const years = parseField(input.termYears);
  const deposit = parseField(input.depositAmount);

  if (goal === null) {
    // wait
  } else if (Number.isNaN(goal) || !(goal > 0)) {
    errors.savingsGoal = 'Enter a savings goal greater than zero.';
  }

  if (initial === null) {
    // wait — treat blank as incomplete unless we allow empty=0; defaults use "0"
  } else if (Number.isNaN(initial) || initial < 0) {
    errors.initialBalance = 'Enter a valid non-negative initial balance.';
  }

  if (years === null) {
    // wait
  } else if (Number.isNaN(years) || !(years > 0)) {
    errors.termYears = 'Enter a savings length greater than zero.';
  }

  if (deposit === null) {
    // wait
  } else if (Number.isNaN(deposit) || deposit < 0) {
    errors.depositAmount = 'Enter a valid non-negative deposit amount.';
  }

  if (
    goal === null ||
    initial === null ||
    years === null ||
    deposit === null ||
    Object.keys(errors).length > 0
  ) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateSavingsInterestRate({
    savingsGoal: goal,
    initialBalance: initial,
    termYears: years,
    compounding: input.compounding,
    depositAmount: deposit,
    depositFrequency: input.depositFrequency,
    depositTiming: input.depositTiming,
    currency: input.currency,
  });

  if (!result) {
    errors.form =
      'No valid interest rate could be determined for these inputs. Check the goal, deposits, and term.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
