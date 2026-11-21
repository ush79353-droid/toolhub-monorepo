import { calculateCashBackFromInput } from './calculation';
import type {
  CashBackFieldErrors,
  CashBackInput,
  CashBackResult,
} from './types';

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export interface CashBackValidation {
  isValid: boolean;
  errors: CashBackFieldErrors;
  result: CashBackResult | null;
}

export function collectFieldErrors(
  input: CashBackInput,
): CashBackFieldErrors {
  const errors: CashBackFieldErrors = {};

  if (input.solveTarget === 'breakEvenSpend') {
    const lim = parseNumber(input.cashbackLimit);
    if (lim.blank) errors.cashbackLimit = 'Enter the cashback limit.';
    else if (lim.invalid || lim.value == null)
      errors.cashbackLimit = 'Enter a valid cashback limit.';
    else if (lim.value < 0)
      errors.cashbackLimit = 'Cashback limit cannot be negative.';

    const rate = parseNumber(input.breakEvenRate);
    if (rate.blank) errors.breakEvenRate = 'Enter the cashback percentage.';
    else if (rate.invalid || rate.value == null)
      errors.breakEvenRate = 'Enter a valid cashback percentage.';
    else if (rate.value <= 0 || rate.value > 100)
      errors.breakEvenRate =
        'Cashback rate must be greater than 0% and at most 100% for break-even spend.';
    return errors;
  }

  const purchase = parseNumber(input.purchaseAmount);
  if (purchase.blank) errors.purchaseAmount = 'Enter the purchase amount.';
  else if (purchase.invalid || purchase.value == null)
    errors.purchaseAmount = 'Enter a valid purchase amount.';
  else if (purchase.value < 0)
    errors.purchaseAmount = 'Purchase amount cannot be negative.';

  if (input.rewardKind === 'percentage') {
    const rate = parseNumber(input.cashbackPercentage);
    if (rate.blank) errors.cashbackPercentage = 'Enter the cashback percentage.';
    else if (rate.invalid || rate.value == null)
      errors.cashbackPercentage = 'Enter a valid cashback percentage.';
    else if (rate.value < 0 || rate.value > 100)
      errors.cashbackPercentage =
        'Cashback percentage must be between 0% and 100%.';
  } else {
    const fixed = parseNumber(input.fixedCashback);
    if (fixed.blank) errors.fixedCashback = 'Enter the fixed cashback amount.';
    else if (fixed.invalid || fixed.value == null)
      errors.fixedCashback = 'Enter a valid fixed cashback amount.';
    else if (fixed.value < 0)
      errors.fixedCashback = 'Fixed cashback cannot be negative.';
  }

  if (input.hasCashbackLimit) {
    const lim = parseNumber(input.cashbackLimit);
    if (lim.blank) errors.cashbackLimit = 'Enter the cashback limit.';
    else if (lim.invalid || lim.value == null)
      errors.cashbackLimit = 'Enter a valid cashback limit.';
    else if (lim.value < 0)
      errors.cashbackLimit = 'Cashback limit cannot be negative.';
  }

  return errors;
}

export function hasFieldErrors(errors: CashBackFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateCashBackInput(
  input: CashBackInput,
): CashBackValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateCashBackFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
