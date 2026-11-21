import {
  calculateBloodPregnancyHcg,
  isValidIsoDate,
  parseCycleLength,
} from './calculation';
import type {
  BloodPregnancyHcgFieldErrors,
  BloodPregnancyHcgInput,
  BloodPregnancyHcgResult,
} from './types';

export interface BloodPregnancyHcgValidation {
  isValid: boolean;
  errors: BloodPregnancyHcgFieldErrors;
  result: BloodPregnancyHcgResult | null;
}

export function validateBloodPregnancyHcgInput(
  input: BloodPregnancyHcgInput,
): BloodPregnancyHcgValidation {
  const errors: BloodPregnancyHcgFieldErrors = {};

  if (parseCycleLength(input.cycleLengthDaysText) === 'invalid') {
    errors.cycleLengthDaysText = 'Enter cycle length between 20 and 45 days.';
  }

  if (input.lastPeriodIso.trim() !== '' && !isValidIsoDate(input.lastPeriodIso)) {
    errors.lastPeriodIso = 'Enter a valid last-period date.';
  }

  if (input.ovulationIso.trim() !== '' && !isValidIsoDate(input.ovulationIso)) {
    errors.ovulationIso = 'Enter a valid ovulation date.';
  }

  if (
    input.ivfTransferIso.trim() !== '' &&
    !isValidIsoDate(input.ivfTransferIso)
  ) {
    errors.ivfTransferIso = 'Enter a valid IVF transfer date.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors: {},
    result: calculateBloodPregnancyHcg(input),
  };
}
