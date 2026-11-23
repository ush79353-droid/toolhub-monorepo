import { calculateTe2Ratio, parseConcentration } from './calculation';
import type { Te2FieldErrors, Te2Input, Te2Result } from './types';

export interface Te2Validation {
  isValid: boolean;
  errors: Te2FieldErrors;
  result: Te2Result | null;
}

function concentrationError(
  raw: string,
  label: string,
  opts: { allowZero: boolean }
): string | undefined {
  const cleaned = raw.trim();
  if (cleaned === '') return undefined;
  const n = parseConcentration(cleaned);
  if (n == null) return `Enter a valid ${label}.`;
  if (n < 0) return `${label} cannot be negative.`;
  if (!opts.allowZero && !(n > 0)) return `${label} must be greater than zero.`;
  if (n > 1_000_000) return `${label} is outside the supported range.`;
  return undefined;
}

export function validateTe2Input(input: Te2Input): Te2Validation {
  const errors: Te2FieldErrors = {};
  const tErr = concentrationError(input.testosterone, 'testosterone', {
    allowZero: true,
  });
  if (tErr) errors.testosterone = tErr;
  const eErr = concentrationError(input.estradiol, 'estradiol', {
    allowZero: false,
  });
  if (eErr) errors.estradiol = eErr;

  const hasHardError = Boolean(errors.testosterone || errors.estradiol);
  const result = hasHardError ? null : calculateTe2Ratio(input);

  const bothFilled =
    input.testosterone.trim() !== '' && input.estradiol.trim() !== '';

  return {
    isValid: !hasHardError && (!bothFilled || result != null),
    errors,
    result,
  };
}