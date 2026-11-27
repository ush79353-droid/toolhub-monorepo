import { calculateSerumOsmolality, parseNumber } from './calculation';
import type {
  SerumOsmolalityFieldErrors,
  SerumOsmolalityInput,
  SerumOsmolalityResult,
} from './types';

export interface SerumOsmolalityValidation {
  errors: SerumOsmolalityFieldErrors;
  result: SerumOsmolalityResult | null;
}

function checkNonNegative(raw: string, label: string): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label}.`;
  if (!(n >= 0)) return `${label} must be non-negative.`;
  return undefined;
}

export function validateSerumOsmolalityInput(
  input: SerumOsmolalityInput,
): SerumOsmolalityValidation {
  const errors: SerumOsmolalityFieldErrors = {};

  const naErr = checkNonNegative(input.sodiumText, 'sodium');
  if (naErr) errors.sodiumText = naErr;

  const bunErr = checkNonNegative(input.bunText, 'BUN/urea');
  if (bunErr) errors.bunText = bunErr;

  const gluErr = checkNonNegative(input.glucoseText, 'glucose');
  if (gluErr) errors.glucoseText = gluErr;

  const etohErr = checkNonNegative(input.ethanolText, 'ethanol');
  if (etohErr) errors.ethanolText = etohErr;

  const meas = input.measuredText.trim();
  if (meas !== '' && meas !== '0' && meas !== '0.0' && meas !== '0.00') {
    const m = parseNumber(input.measuredText);
    if (m === null) errors.measuredText = 'Enter a valid measured osmolality.';
    else if (!(m > 0))
      errors.measuredText = 'Measured osmolality must be positive when set.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateSerumOsmolality(input),
  };
}
