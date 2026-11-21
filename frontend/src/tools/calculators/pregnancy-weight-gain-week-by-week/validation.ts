import {
  calculatePregnancyWeightGainWeekByWeek,
  heightToMeters,
  parseNumber,
  weightToKg,
} from './calculation';
import type {
  PregnancyWeightGainWeekByWeekFieldErrors,
  PregnancyWeightGainWeekByWeekInput,
  PregnancyWeightGainWeekByWeekResult,
} from './types';

export interface PregnancyWeightGainWeekByWeekValidation {
  isValid: boolean;
  errors: PregnancyWeightGainWeekByWeekFieldErrors;
  result: PregnancyWeightGainWeekByWeekResult | null;
}

export function collectFieldErrors(
  input: PregnancyWeightGainWeekByWeekInput,
): PregnancyWeightGainWeekByWeekFieldErrors {
  const errors: PregnancyWeightGainWeekByWeekFieldErrors = {};
  const heightVal = parseNumber(input.height);
  const weightVal = parseNumber(input.weight);
  const weekVal = parseNumber(input.week);

  if (input.height.trim() !== '') {
    if (heightVal == null || heightVal <= 0) {
      errors.height = 'Enter a valid height.';
    } else {
      const m = heightToMeters(heightVal, input.heightUnit);
      if (!(m > 0) || m > 3) errors.height = 'Height is out of range.';
    }
  }
  if (input.weight.trim() !== '') {
    if (weightVal == null || weightVal <= 0) {
      errors.weight = 'Enter a valid weight.';
    } else {
      const kg = weightToKg(weightVal, input.weightUnit);
      if (!(kg > 0) || kg > 400) errors.weight = 'Weight is out of range.';
    }
  }

  if (input.week.trim() === '') {
    errors.week = 'Enter gestational week.';
  } else if (weekVal == null || weekVal < 1 || weekVal > 45) {
    errors.week = 'Week must be between 1 and 45.';
  }

  const hBlank = input.height.trim() === '';
  const wBlank = input.weight.trim() === '';
  if (!hBlank && wBlank) errors.weight = 'Enter weight.';
  if (hBlank && !wBlank) errors.height = 'Enter height.';

  return errors;
}

export function validatePregnancyWeightGainWeekByWeekInput(
  input: PregnancyWeightGainWeekByWeekInput,
): PregnancyWeightGainWeekByWeekValidation {
  const hBlank = input.height.trim() === '';
  const wBlank = input.weight.trim() === '';
  if (hBlank && wBlank) {
    const errors = collectFieldErrors(input);
    // Allow empty H/W with week default — empty chart state.
    if (errors.week && input.week.trim() !== '') {
      return { isValid: false, errors, result: null };
    }
    if (hBlank && wBlank && !errors.week) {
      return { isValid: true, errors: {}, result: null };
    }
  }

  const errors = collectFieldErrors(input);
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }
  if (hBlank || wBlank) {
    return { isValid: true, errors: {}, result: null };
  }

  const result = calculatePregnancyWeightGainWeekByWeek(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
