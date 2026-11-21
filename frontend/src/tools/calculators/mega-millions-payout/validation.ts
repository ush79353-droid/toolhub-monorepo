import {
  calculateMegaMillionsPayout,
  isMegaMillionsInputBlank,
  parseOptionalNumber,
} from './calculation';
import type {
  FilingStatus,
  MegaMillionsPayoutFieldErrors,
  MegaMillionsPayoutInput,
  MegaMillionsPayoutResult,
} from './types';
import { isUsStateCode } from './us-states';

export interface MegaMillionsPayoutValidation {
  isValid: boolean;
  incomplete: boolean;
  errors: MegaMillionsPayoutFieldErrors;
  result: MegaMillionsPayoutResult | null;
}

const MAX_JACKPOT = 1e12;
const FILING_STATUSES: readonly FilingStatus[] = [
  'single',
  'married_jointly',
  'married_separately',
  'head_of_household',
  'qualifying_surviving_spouse',
];

export function validateMegaMillionsPayoutInput(
  input: MegaMillionsPayoutInput,
): MegaMillionsPayoutValidation {
  const errors: MegaMillionsPayoutFieldErrors = {};

  if (isMegaMillionsInputBlank(input)) {
    return { isValid: false, incomplete: true, errors: {}, result: null };
  }

  const jackpot = parseOptionalNumber(input.jackpot);
  const annuityRate = parseOptionalNumber(input.annuityRatePercent);
  const lumpSumPercent = parseOptionalNumber(input.lumpSumPercent);

  if (jackpot === null || !(jackpot > 0) || jackpot > MAX_JACKPOT) {
    errors.jackpot = 'Enter an advertised jackpot greater than zero.';
  }
  if (annuityRate === null || annuityRate < 0 || annuityRate > 100) {
    errors.annuityRatePercent =
      'Enter an annuity growth rate from 0% to 100%.';
  }
  if (
    lumpSumPercent === null ||
    lumpSumPercent < 0 ||
    lumpSumPercent > 100
  ) {
    errors.lumpSumPercent =
      'Enter a lump-sum payout percentage from 0% to 100%.';
  }
  if (!FILING_STATUSES.includes(input.filingStatus)) {
    errors.filingStatus = 'Select a valid filing status.';
  }
  if (!input.state || !isUsStateCode(input.state)) {
    errors.state = 'Select a US state or the District of Columbia.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, incomplete: false, errors, result: null };
  }

  const result = calculateMegaMillionsPayout({
    jackpot: jackpot!,
    annuityRatePercent: annuityRate!,
    filingStatus: input.filingStatus,
    state: input.state as Exclude<MegaMillionsPayoutInput['state'], ''>,
    lumpSumPercent: lumpSumPercent!,
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
