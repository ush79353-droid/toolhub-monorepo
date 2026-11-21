import { calculateLossRatio, toLossRatioResult } from './calculation';
import type {
  LossRatioFieldErrors,
  LossRatioInput,
  LossRatioResult,
} from './types';

function parseMoney(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return null;
  return value;
}

export function validateLossRatioInput(input: LossRatioInput): {
  isValid: boolean;
  errors: LossRatioFieldErrors;
  result: LossRatioResult | null;
} {
  const errors: LossRatioFieldErrors = {};
  const premiums = parseMoney(input.premiumsEarned);
  const claims = parseMoney(input.claimsPaid);
  const expenses = parseMoney(input.lossAdjustmentExpenses);

  const allEmpty =
    input.premiumsEarned.trim() === '' &&
    input.claimsPaid.trim() === '' &&
    input.lossAdjustmentExpenses.trim() === '';

  if (allEmpty) {
    return { isValid: false, errors: {}, result: null };
  }

  if (premiums === null) {
    errors.premiumsEarned = 'Enter total premiums earned.';
  } else if (premiums < 0) {
    errors.premiumsEarned = 'Earned premiums cannot be negative.';
  } else if (!(premiums > 0)) {
    errors.premiumsEarned =
      'Total premiums earned must be greater than zero to calculate the loss ratio.';
  }

  if (claims === null) {
    errors.claimsPaid = 'Enter insurance claims paid (use 0 if none).';
  } else if (claims < 0) {
    errors.claimsPaid = 'Insurance claims paid cannot be negative.';
  }

  if (expenses === null) {
    errors.lossAdjustmentExpenses =
      'Enter loss adjustment expenses (use 0 if none).';
  } else if (expenses < 0) {
    errors.lossAdjustmentExpenses =
      'Loss adjustment expenses cannot be negative.';
  }

  if (
    Object.keys(errors).length > 0 ||
    premiums === null ||
    claims === null ||
    expenses === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const breakdown = calculateLossRatio(premiums, claims, expenses);
  if (!breakdown) {
    return {
      isValid: false,
      errors: {
        form: 'The entered values are outside the supported calculation range.',
      },
      result: null,
    };
  }

  return {
    isValid: true,
    errors: {},
    result: toLossRatioResult(breakdown, input.currency),
  };
}
