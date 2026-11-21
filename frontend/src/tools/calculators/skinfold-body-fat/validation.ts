import { calculateSkinfoldBodyFat, parseNumber, toMm } from './calculation';
import type {
  SkinfoldBodyFatFieldErrors,
  SkinfoldBodyFatInput,
  SkinfoldBodyFatResult,
} from './types';

export interface SkinfoldBodyFatValidation {
  isValid: boolean;
  errors: SkinfoldBodyFatFieldErrors;
  result: SkinfoldBodyFatResult | null;
  /** Non-error informational gate (e.g. age <17). */
  gateMessage: string | null;
}

function fieldError(
  raw: string,
  unitLabel: string
): string | undefined {
  const n = parseNumber(raw);
  if (raw.trim() === '') return undefined;
  if (n == null) return `Enter a valid ${unitLabel} measurement.`;
  if (!(n > 0)) return 'Measurement must be greater than zero.';
  return undefined;
}

export function collectFieldErrors(
  input: SkinfoldBodyFatInput
): SkinfoldBodyFatFieldErrors {
  const unitLabel = input.unit === 'mm' ? 'mm' : 'inch';
  const errors: SkinfoldBodyFatFieldErrors = {};
  const b = fieldError(input.bicep, unitLabel);
  const s = fieldError(input.subscapular, unitLabel);
  const i = fieldError(input.suprailiac, unitLabel);
  const t = fieldError(input.tricep, unitLabel);
  if (b) errors.bicep = b;
  if (s) errors.subscapular = s;
  if (i) errors.suprailiac = i;
  if (t) errors.tricep = t;

  // Range checks once parsed positive.
  for (const [key, raw] of [
    ['bicep', input.bicep],
    ['subscapular', input.subscapular],
    ['suprailiac', input.suprailiac],
    ['tricep', input.tricep],
  ] as const) {
    if (errors[key]) continue;
    const n = parseNumber(raw);
    if (n == null) continue;
    const mm = toMm(n, input.unit);
    if (mm < 1 || mm > 80) {
      errors[key] =
        input.unit === 'mm'
          ? 'Use a skinfold between 1 and 80 mm.'
          : 'Use a skinfold between about 0.04 and 3.15 in.';
    }
  }
  return errors;
}

export function hasFieldErrors(errors: SkinfoldBodyFatFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateSkinfoldBodyFatInput(
  input: SkinfoldBodyFatInput
): SkinfoldBodyFatValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null, gateMessage: null };
  }

  if (input.ageBand === 'under_17') {
    const anyFilled =
      input.bicep.trim() !== '' ||
      input.subscapular.trim() !== '' ||
      input.suprailiac.trim() !== '' ||
      input.tricep.trim() !== '';
    return {
      isValid: false,
      errors: anyFilled
        ? {
            ageBand:
              'Durnin–Womersley adult coefficients are not applied under age 17. Choose 17–19 or older.',
          }
        : {},
      result: null,
      gateMessage:
        'Age under 17 is outside the adult Durnin–Womersley bands used here. Select 17–19 or an older band to estimate body fat %.',
    };
  }

  const blanks =
    input.bicep.trim() === '' ||
    input.subscapular.trim() === '' ||
    input.suprailiac.trim() === '' ||
    input.tricep.trim() === '';
  if (blanks) {
    return { isValid: false, errors: {}, result: null, gateMessage: null };
  }

  const result = calculateSkinfoldBodyFat(input);
  if (!result) {
    return {
      isValid: false,
      errors: {
        form: 'Unable to estimate body fat with these measurements. Check values and age band.',
      },
      result: null,
      gateMessage: null,
    };
  }
  return { isValid: true, errors: {}, result, gateMessage: null };
}
