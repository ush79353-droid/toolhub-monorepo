import {
  calculateEdd,
  isValidIsoDate,
  parseCycleDays,
  parseNonNegInt,
  ultrasoundAgeDaysAtScan,
} from './calculation';
import type { EddFieldErrors, EddInput, EddResult } from './types';

export interface EddValidation {
  isValid: boolean;
  errors: EddFieldErrors;
  result: EddResult | null;
}

/**
 * Partial methods are allowed: show whichever EDD/age can be computed.
 * Invalid filled fields produce errors; blank optional method fields stay idle.
 */
export function validateEddInput(input: EddInput): EddValidation {
  const errors: EddFieldErrors = {};

  if (!isValidIsoDate(input.currentDate.trim())) {
    errors.currentDate = 'Enter a valid current date.';
  }

  const cycleDays = parseCycleDays(input.cycleDays);
  if (cycleDays == null) {
    errors.cycleDays = 'Choose a cycle length from 21–45 days.';
  }

  const lmpFilled = input.lmpDate.trim() !== '';
  if (lmpFilled && !isValidIsoDate(input.lmpDate.trim())) {
    errors.lmpDate = 'Enter a valid last menstrual period date.';
  }

  const usDateFilled = input.ultrasoundDate.trim() !== '';
  const usWeeksRaw = input.ultrasoundWeeks.trim();
  const usDaysRaw = input.ultrasoundDays.trim();
  const usAny =
    usDateFilled || usWeeksRaw !== '' || usDaysRaw !== '';

  let usWeeks: number | null = null;
  let usDays: number | null = null;

  if (usAny) {
    if (!usDateFilled || !isValidIsoDate(input.ultrasoundDate.trim())) {
      errors.ultrasoundDate = 'Enter a valid ultrasound date.';
    }
    usWeeks = parseNonNegInt(usWeeksRaw);
    if (usWeeks == null) {
      errors.ultrasoundWeeks = 'Enter ultrasound gestational weeks (0 or more).';
    }
    usDays = parseNonNegInt(usDaysRaw === '' ? '0' : usDaysRaw);
    if (usDaysRaw !== '' && parseNonNegInt(usDaysRaw) == null) {
      errors.ultrasoundDays = 'Enter ultrasound days as a whole number 0–6.';
      usDays = null;
    } else if (usDays != null && usDays > 6) {
      errors.ultrasoundDays = 'Ultrasound days must be 0–6.';
      usDays = null;
    }
    if (
      usWeeks != null &&
      usDays != null &&
      ultrasoundAgeDaysAtScan(usWeeks, usDays) == null
    ) {
      errors.ultrasoundWeeks = 'Ultrasound gestational age is out of range.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const hasLmp = lmpFilled && isValidIsoDate(input.lmpDate.trim());
  const hasUs =
    usDateFilled &&
    usWeeks != null &&
    usDays != null &&
    isValidIsoDate(input.ultrasoundDate.trim());

  if (!hasLmp && !hasUs) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateEdd({
    currentDate: input.currentDate.trim(),
    lmpDate: hasLmp ? input.lmpDate.trim() : '',
    cycleDays: cycleDays!,
    ultrasoundDate: hasUs ? input.ultrasoundDate.trim() : '',
    ultrasoundWeeks: hasUs ? usWeeks : null,
    ultrasoundDays: hasUs ? usDays : null,
  });

  return { isValid: true, errors, result };
}
