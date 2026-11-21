import { calculateUrineHomePregnancyTest, isValidIsoDate, parseCycleLength } from './calculation';
import type {
  UrineHomePregnancyTestFieldErrors,
  UrineHomePregnancyTestInput,
  UrineHomePregnancyTestResult,
} from './types';

export interface UrineHomePregnancyTestValidation {
  errors: UrineHomePregnancyTestFieldErrors;
  result: UrineHomePregnancyTestResult | null;
}

export function validateUrineHomePregnancyTestInput(
  input: UrineHomePregnancyTestInput,
): UrineHomePregnancyTestValidation {
  const errors: UrineHomePregnancyTestFieldErrors = {};

  const cycle = parseCycleLength(input.cycleLengthDaysText);
  if (cycle === 'invalid') {
    errors.cycleLengthDaysText = 'Enter a cycle length between 20 and 45 days.';
  }

  if (input.lastPeriodIso.trim() && !isValidIsoDate(input.lastPeriodIso)) {
    errors.lastPeriodIso = 'Enter a valid last-period date.';
  }

  if (input.ovulationIso.trim() && !isValidIsoDate(input.ovulationIso)) {
    errors.ovulationIso = 'Enter a valid ovulation date.';
  }

  if (input.ivfTransferIso.trim() && !isValidIsoDate(input.ivfTransferIso)) {
    errors.ivfTransferIso = 'Enter a valid IVF transfer date.';
  }

  const hasBlocking = Object.keys(errors).length > 0;
  return {
    errors,
    result: hasBlocking ? null : calculateUrineHomePregnancyTest(input),
  };
}
