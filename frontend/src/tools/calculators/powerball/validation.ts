import { isUsStateCode } from '../mega-millions-payout/us-states';
import {
  calculatePowerballPayout,
  isPowerballInputBlank,
  parseOptionalNumber,
} from './calculation';
import type {
  FilingStatus,
  PowerballFieldErrors,
  PowerballInput,
  PowerballResult,
} from './types';

export interface PowerballValidation {
  isValid: boolean;
  incomplete: boolean;
  errors: PowerballFieldErrors;
  result: PowerballResult | null;
}

const MAX_JACKPOT = 1e12;
const FILING: readonly FilingStatus[] = [
  'single',
  'married_jointly',
  'married_separately',
  'head_of_household',
];

export function validatePowerballInput(
  input: PowerballInput,
): PowerballValidation {
  const errors: PowerballFieldErrors = {};

  if (isPowerballInputBlank(input)) {
    return { isValid: false, incomplete: true, errors: {}, result: null };
  }

  const jackpot = parseOptionalNumber(input.jackpot);
  const lumpSumPercent = parseOptionalNumber(input.lumpSumPercent);

  if (jackpot === null || !(jackpot > 0) || jackpot > MAX_JACKPOT) {
    errors.jackpot = 'Enter an advertised jackpot greater than zero.';
  }
  if (
    lumpSumPercent === null ||
    lumpSumPercent < 0 ||
    lumpSumPercent > 100
  ) {
    errors.lumpSumPercent =
      'Enter a lump-sum payout percentage from 0% to 100%.';
  }
  if (!FILING.includes(input.filingStatus)) {
    errors.filingStatus = 'Select a valid filing status.';
  }
  if (!input.state || !isUsStateCode(input.state)) {
    errors.state = 'Select a US state or the District of Columbia.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, incomplete: false, errors, result: null };
  }

  const result = calculatePowerballPayout({
    jackpot: jackpot!,
    lumpSumPercent: lumpSumPercent!,
    filingStatus: input.filingStatus,
    state: input.state as Exclude<PowerballInput['state'], ''>,
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
