import { calculateGvwrFromInput } from './calculation';
import type { GvwrFieldErrors, GvwrInput, GvwrResult } from './types';

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

export interface GvwrValidation {
  isValid: boolean;
  errors: GvwrFieldErrors;
  result: GvwrResult | null;
}

export function collectFieldErrors(input: GvwrInput): GvwrFieldErrors {
  const errors: GvwrFieldErrors = {};

  if (input.mode === 'grossWeight' || input.mode === 'capacityCheck') {
    const t = parseNumber(input.tareWeight);
    if (!t.blank) {
      if (t.invalid || t.value == null) {
        errors.tareWeight = 'Please enter a valid tare weight.';
      } else if (t.value < 0) {
        errors.tareWeight = 'Tare weight cannot be negative.';
      }
    }

    const p = parseNumber(input.payloadWeight);
    if (!p.blank) {
      if (p.invalid || p.value == null) {
        errors.payloadWeight = 'Please enter a valid payload.';
      } else if (p.value < 0) {
        errors.payloadWeight = 'Payload cannot be negative.';
      }
    }
  }

  if (input.mode === 'capacityCheck' || input.mode === 'maximumPayload') {
    const g = parseNumber(input.manufacturerGvwr);
    if (!g.blank) {
      if (g.invalid || g.value == null) {
        errors.manufacturerGvwr = 'Please enter a valid manufacturer GVWR.';
      } else if (!(g.value > 0)) {
        errors.manufacturerGvwr = 'Manufacturer GVWR must be greater than zero.';
      }
    }
  }

  if (input.mode === 'capacityCheck') {
    const a = parseNumber(input.actualGrossWeight);
    if (!a.blank) {
      if (a.invalid || a.value == null) {
        errors.actualGrossWeight = 'Please enter a valid gross weight.';
      } else if (a.value < 0) {
        errors.actualGrossWeight = 'Gross weight cannot be negative.';
      }
    }
  }

  if (input.mode === 'maximumPayload') {
    const u = parseNumber(input.unloadedWeight);
    if (!u.blank) {
      if (u.invalid || u.value == null) {
        errors.unloadedWeight = 'Please enter a valid unloaded weight.';
      } else if (u.value < 0) {
        errors.unloadedWeight = 'Unloaded weight cannot be negative.';
      }
    }
  }

  return errors;
}

export function validateGvwrInputs(input: GvwrInput): GvwrValidation {
  const errors = collectFieldErrors(input);

  if (input.mode === 'grossWeight' || input.mode === 'capacityCheck') {
    if (
      parseNumber(input.tareWeight).blank ||
      parseNumber(input.payloadWeight).blank
    ) {
      return { isValid: false, errors, result: null };
    }
  }

  if (input.mode === 'capacityCheck') {
    if (parseNumber(input.manufacturerGvwr).blank) {
      return { isValid: false, errors, result: null };
    }
  }

  if (input.mode === 'maximumPayload') {
    if (
      parseNumber(input.manufacturerGvwr).blank ||
      parseNumber(input.unloadedWeight).blank
    ) {
      return { isValid: false, errors, result: null };
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateGvwrFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
