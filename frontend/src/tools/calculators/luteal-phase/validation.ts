import { isValidIsoDate } from '../due-date/calculation';
import { daysBetweenUtc } from '../edd/calculation';
import {
  calculateLutealPhase,
  MAX_LUTEAL_DAYS,
  MIN_LUTEAL_DAYS,
} from './calculation';
import type {
  LutealPhaseFieldErrors,
  LutealPhaseInput,
  LutealPhaseResult,
} from './types';

export interface LutealPhaseValidation {
  isValid: boolean;
  errors: LutealPhaseFieldErrors;
  result: LutealPhaseResult | null;
}

export function validateLutealPhaseInput(
  input: LutealPhaseInput,
): LutealPhaseValidation {
  const errors: LutealPhaseFieldErrors = {};
  const ovulation = input.ovulationDate.trim();
  const periodStart = input.periodStartDate.trim();

  if (ovulation && !isValidIsoDate(ovulation)) {
    errors.ovulationDate = 'Enter a valid ovulation date.';
  }
  if (periodStart && !isValidIsoDate(periodStart)) {
    errors.periodStartDate = 'Enter a valid first day of period.';
  }

  if (!ovulation || !periodStart) {
    return { isValid: false, errors, result: null };
  }

  if (errors.ovulationDate || errors.periodStartDate) {
    return { isValid: false, errors, result: null };
  }

  const span = daysBetweenUtc(ovulation, periodStart);
  if (span == null) {
    errors.form = 'Unable to calculate from the dates entered.';
    return { isValid: false, errors, result: null };
  }

  if (span <= 0) {
    errors.periodStartDate =
      'First day of period must be after the ovulation date.';
    return { isValid: false, errors, result: null };
  }

  if (span < MIN_LUTEAL_DAYS || span > MAX_LUTEAL_DAYS) {
    errors.form = `Luteal phase length is outside the supported range (${MIN_LUTEAL_DAYS}–${MAX_LUTEAL_DAYS} days).`;
    return { isValid: false, errors, result: null };
  }

  const result = calculateLutealPhase(input);
  if (!result) {
    errors.form = 'Unable to calculate luteal phase from the dates entered.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}