import {
  calculateCrownRumpLength,
  crlToMm,
  gestationalAgeDaysFromCrlMm,
  MAX_CRL_MM,
  MIN_CRL_MM,
} from './calculation';
import type {
  CrownRumpLengthFieldErrors,
  CrownRumpLengthInput,
  CrownRumpLengthResult,
} from './types';

export interface CrownRumpLengthValidation {
  isValid: boolean;
  errors: CrownRumpLengthFieldErrors;
  result: CrownRumpLengthResult | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export function validateCrownRumpLengthInput(
  input: CrownRumpLengthInput
): CrownRumpLengthValidation {
  const errors: CrownRumpLengthFieldErrors = {};
  const parsed = parseNumber(input.crlValue);

  if (parsed.blank) {
    return { isValid: false, errors, result: null };
  }

  if (parsed.invalid || parsed.value === null || parsed.value <= 0) {
    errors.crlValue = 'Enter a valid crown–rump length greater than zero.';
    return { isValid: false, errors, result: null };
  }

  const crlMm = crlToMm(parsed.value, input.crlUnit);
  if (crlMm == null) {
    errors.crlValue = 'Enter a valid crown–rump length.';
    return { isValid: false, errors, result: null };
  }

  if (crlMm < MIN_CRL_MM) {
    errors.crlValue = `CRL below ${MIN_CRL_MM} mm is outside this educational first-trimester range.`;
    return { isValid: false, errors, result: null };
  }

  if (crlMm > MAX_CRL_MM) {
    errors.crlValue = `CRL above ${MAX_CRL_MM} mm is outside CRL dating scope (~14 weeks). Use fetal biometry instead.`;
    return { isValid: false, errors, result: null };
  }

  const gaDays = gestationalAgeDaysFromCrlMm(crlMm);
  if (gaDays == null) {
    errors.crlValue = 'CRL cannot be converted with the Robinson–Fleming model.';
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors,
    result: calculateCrownRumpLength(input, crlMm, gaDays),
  };
}
