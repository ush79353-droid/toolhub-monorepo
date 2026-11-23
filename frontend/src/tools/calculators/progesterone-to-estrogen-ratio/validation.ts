import {
  calculatePgE2Ratio,
  parseConcentration,
} from './calculation';
import type { PgE2FieldErrors, PgE2Input, PgE2Result } from './types';

export interface PgE2Validation {
  isValid: boolean;
  errors: PgE2FieldErrors;
  result: PgE2Result | null;
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

export function validatePgE2Input(input: PgE2Input): PgE2Validation {
  const errors: PgE2FieldErrors = {};
  const pErr = concentrationError(input.progesterone, 'progesterone', {
    allowZero: true,
  });
  if (pErr) errors.progesterone = pErr;
  const eErr = concentrationError(input.estradiol, 'estradiol', {
    allowZero: false,
  });
  if (eErr) errors.estradiol = eErr;

  const hasHardError = Boolean(errors.progesterone || errors.estradiol);
  const result = hasHardError ? null : calculatePgE2Ratio(input);

  const bothFilled =
    input.progesterone.trim() !== '' && input.estradiol.trim() !== '';

  return {
    isValid: !hasHardError && (!bothFilled || result != null),
    errors,
    result,
  };
}
