import { calculatePlasmaOsmolality, parseNumber } from './calculation';
import type {
  PlasmaOsmolalityFieldErrors,
  PlasmaOsmolalityInput,
  PlasmaOsmolalityResult,
} from './types';

export interface PlasmaOsmolalityValidation {
  errors: PlasmaOsmolalityFieldErrors;
  result: PlasmaOsmolalityResult | null;
}

function checkNonNegative(raw: string, label: string): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label}.`;
  if (!(n >= 0)) return `${label} must be non-negative.`;
  return undefined;
}

export function validatePlasmaOsmolalityInput(
  input: PlasmaOsmolalityInput,
): PlasmaOsmolalityValidation {
  const errors: PlasmaOsmolalityFieldErrors = {};

  const naErr = checkNonNegative(input.sodiumText, 'sodium');
  if (naErr) errors.sodiumText = naErr;

  const gluErr = checkNonNegative(input.glucoseText, 'glucose');
  if (gluErr) errors.glucoseText = gluErr;

  const bunErr = checkNonNegative(input.bunText, 'BUN/urea');
  if (bunErr) errors.bunText = bunErr;

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculatePlasmaOsmolality(input),
  };
}
