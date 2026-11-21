import {
  areReciprocals,
  calculateCrossExchangeRate,
} from './calculation';
import type {
  CrossExchangeRateFieldErrors,
  CrossExchangeRateInput,
  CrossExchangeRateResult,
} from './types';

const MAX_RATE = 1e12;

function parsePositive(
  raw: string,
): { value: number | null; blank: boolean; invalid: boolean } {
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

export interface CrossExchangeRateValidation {
  isValid: boolean;
  errors: CrossExchangeRateFieldErrors;
  result: CrossExchangeRateResult | null;
}

function validatePair(
  forwardRaw: string,
  reverseRaw: string,
  forwardKey: 'rateAC' | 'rateBC',
  reverseKey: 'rateCA' | 'rateCB',
  forwardLabel: string,
  reverseLabel: string,
  errors: CrossExchangeRateFieldErrors,
): void {
  const forward = parsePositive(forwardRaw);
  const reverse = parsePositive(reverseRaw);

  if (forward.blank && reverse.blank) {
    errors.form =
      errors.form ??
      `Enter one rate for each currency pair (${forwardLabel} or ${reverseLabel}).`;
    return;
  }

  if (!forward.blank) {
    if (forward.invalid || forward.value == null) {
      errors[forwardKey] = `Enter a valid ${forwardLabel}.`;
    } else if (forward.value <= 0 || forward.value > MAX_RATE) {
      errors[forwardKey] = `${forwardLabel} must be a positive number.`;
    }
  }

  if (!reverse.blank) {
    if (reverse.invalid || reverse.value == null) {
      errors[reverseKey] = `Enter a valid ${reverseLabel}.`;
    } else if (reverse.value <= 0 || reverse.value > MAX_RATE) {
      errors[reverseKey] = `${reverseLabel} must be a positive number.`;
    }
  }

  if (
    !forward.blank &&
    !reverse.blank &&
    forward.value != null &&
    reverse.value != null &&
    forward.value > 0 &&
    reverse.value > 0 &&
    !errors[forwardKey] &&
    !errors[reverseKey] &&
    !areReciprocals(forward.value, reverse.value)
  ) {
    const msg = `${forwardLabel} and ${reverseLabel} conflict. Enter only one direction, or matching reciprocals.`;
    errors[forwardKey] = msg;
    errors[reverseKey] = msg;
  }
}

export function collectFieldErrors(
  input: CrossExchangeRateInput,
): CrossExchangeRateFieldErrors {
  const errors: CrossExchangeRateFieldErrors = {};
  validatePair(
    input.rateAC,
    input.rateCA,
    'rateAC',
    'rateCA',
    'A/C',
    'C/A',
    errors,
  );
  validatePair(
    input.rateBC,
    input.rateCB,
    'rateBC',
    'rateCB',
    'B/C',
    'C/B',
    errors,
  );
  return errors;
}

export function hasFieldErrors(errors: CrossExchangeRateFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateCrossExchangeRateInput(
  input: CrossExchangeRateInput,
): CrossExchangeRateValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateCrossExchangeRate(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
