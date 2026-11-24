import { calculateTimiStemiScore } from './calculation';
import type {
  TimiStemiFieldErrors,
  TimiStemiInput,
  TimiStemiResult,
} from './types';

export interface TimiStemiValidation {
  isValid: boolean;
  errors: TimiStemiFieldErrors;
  result: TimiStemiResult | null;
}

/**
 * Score stays blank until an age band is chosen. Killip/anterior are always
 * Yes/No; checkboxes are boolean.
 */
export function validateTimiStemiInput(
  input: TimiStemiInput,
): TimiStemiValidation {
  if (input.ageBand === null) {
    return {
      isValid: false,
      errors: {},
      result: null,
    };
  }

  if (
    input.ageBand !== 'under65' &&
    input.ageBand !== 'age65to74' &&
    input.ageBand !== 'age75plus'
  ) {
    return {
      isValid: false,
      errors: { ageBand: 'Select an age band.' },
      result: null,
    };
  }

  if (
    input.killipClassIiToIv !== 'yes' &&
    input.killipClassIiToIv !== 'no'
  ) {
    return {
      isValid: false,
      errors: { form: 'Select Killip class II–IV Yes or No.' },
      result: null,
    };
  }

  if (
    input.anteriorStElevationOrLbbb !== 'yes' &&
    input.anteriorStElevationOrLbbb !== 'no'
  ) {
    return {
      isValid: false,
      errors: { form: 'Select anterior ST elevation or LBBB Yes or No.' },
      result: null,
    };
  }

  return {
    isValid: true,
    errors: {},
    result: calculateTimiStemiScore(input),
  };
}
