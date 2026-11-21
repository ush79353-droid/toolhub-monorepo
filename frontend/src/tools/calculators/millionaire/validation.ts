import {
  calculateMillionaireGoal,
  isMillionaireInputBlank,
  parseOptionalNumber,
} from './calculation';
import type {
  MillionaireFieldErrors,
  MillionaireInput,
  MillionaireResult,
} from './types';
import { COMPOUNDING_OPTIONS } from './types';

export interface MillionaireValidation {
  isValid: boolean;
  incomplete: boolean;
  errors: MillionaireFieldErrors;
  result: MillionaireResult | null;
}

const MAX_AMOUNT = 1e15;
const MAX_RATE = 1000;

export function validateMillionaireInput(
  input: MillionaireInput,
): MillionaireValidation {
  const errors: MillionaireFieldErrors = {};

  if (isMillionaireInputBlank(input)) {
    return { isValid: false, incomplete: true, errors: {}, result: null };
  }

  const target = parseOptionalNumber(input.targetAmount);
  const initial = parseOptionalNumber(input.initialSavings);
  const rate = parseOptionalNumber(input.annualInterestRate);
  const deposit = parseOptionalNumber(input.additionalDeposit);
  const inflation = parseOptionalNumber(input.inflationRate);

  if (target === null || !(target > 0) || target > MAX_AMOUNT) {
    errors.targetAmount = 'Enter a savings goal greater than zero.';
  }
  if (initial === null || initial < 0 || initial > MAX_AMOUNT) {
    errors.initialSavings = 'Enter initial savings of zero or more.';
  }
  if (rate === null || rate < 0 || rate > MAX_RATE) {
    errors.annualInterestRate = 'Enter an annual interest rate of 0% or more.';
  }
  if (deposit === null || deposit < 0 || deposit > MAX_AMOUNT) {
    errors.additionalDeposit = 'Enter additional deposits of zero or more.';
  }
  if (inflation === null || inflation < -99 || inflation > MAX_RATE) {
    errors.inflationRate = 'Enter a valid inflation rate (above −100%).';
  }
  if (!COMPOUNDING_OPTIONS.some((o) => o.value === input.compoundFrequency)) {
    errors.form = 'Select a valid compounding frequency.';
  }
  if (input.depositTiming !== 'beginning' && input.depositTiming !== 'end') {
    errors.form = 'Select deposit timing.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, incomplete: false, errors, result: null };
  }

  const result = calculateMillionaireGoal({
    targetAmount: target!,
    initialSavings: initial!,
    annualInterestRatePercent: rate!,
    compoundFrequency: input.compoundFrequency,
    additionalDeposit: deposit!,
    depositTiming: input.depositTiming,
    inflationRatePercent: inflation!,
    currency: input.currency,
  });

  if (!result) {
    return {
      isValid: false,
      incomplete: false,
      errors: { form: 'Unable to calculate with the provided values.' },
      result: null,
    };
  }

  return { isValid: true, incomplete: false, errors: {}, result };
}
