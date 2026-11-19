import { calculateTrumpAccounts, parseOptionalNumber } from './calculation';
import type {
  TrumpAccountsFieldErrors,
  TrumpAccountsInput,
  TrumpAccountsResult,
} from './types';

export function validateTrumpAccountsInput(input: TrumpAccountsInput): {
  isValid: boolean;
  errors: TrumpAccountsFieldErrors;
  result: TrumpAccountsResult | null;
  incomplete: boolean;
} {
  const errors: TrumpAccountsFieldErrors = {};

  const startingAge = parseOptionalNumber(input.startingAge);
  const targetAge = parseOptionalNumber(input.targetAge);
  const startingBalance = parseOptionalNumber(input.startingBalance);
  const annualContribution = parseOptionalNumber(input.annualContribution);
  const inflationRate = parseOptionalNumber(input.inflationRate);

  if (
    startingAge === null ||
    targetAge === null ||
    startingBalance === null ||
    annualContribution === null ||
    (input.includeInflation && inflationRate === null)
  ) {
    return { isValid: false, errors: {}, result: null, incomplete: true };
  }

  if (
    !Number.isInteger(startingAge) ||
    startingAge < 0 ||
    startingAge > 17
  ) {
    errors.startingAge = 'Starting age must be a whole number from 0 to 17.';
  }

  if (!Number.isInteger(targetAge) || targetAge <= startingAge) {
    errors.targetAge = 'Target age must be a whole number greater than starting age.';
  } else if (targetAge > 100) {
    errors.targetAge = 'Enter a target age of 100 or less.';
  }

  if (startingBalance < 0) {
    errors.startingBalance = 'Starting balance cannot be negative.';
  }

  if (annualContribution < 0) {
    errors.annualContribution = 'Annual contribution cannot be negative.';
  }

  if (input.includeInflation) {
    if (inflationRate === null || inflationRate <= -100) {
      errors.inflationRate =
        'Inflation rate must be greater than −100% when inflation is included.';
    }
  }

  const isValid = Object.keys(errors).length === 0;
  if (!isValid) {
    return { isValid: false, errors, result: null, incomplete: false };
  }

  const result = calculateTrumpAccounts({
    startingAge,
    targetAge,
    startingBalance,
    annualContribution,
    investmentScenario: input.investmentScenario,
    includeInflation: input.includeInflation,
    inflationRatePercent: input.includeInflation
      ? (inflationRate as number)
      : 0,
    currency: input.currency,
  });

  if (!result) {
    return {
      isValid: false,
      errors: {
        form: 'Unable to project the account with the current inputs.',
      },
      result: null,
      incomplete: false,
    };
  }

  return { isValid: true, errors, result, incomplete: false };
}
