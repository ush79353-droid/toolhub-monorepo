import { calculateHorsepowerFromInput } from './calculation';
import type {
  HorsepowerFieldErrors,
  HorsepowerInput,
  HorsepowerResult,
} from './types';

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

export interface HorsepowerValidation {
  isValid: boolean;
  errors: HorsepowerFieldErrors;
  result: HorsepowerResult | null;
}

function hasErrors(errors: HorsepowerFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function collectFieldErrors(
  input: HorsepowerInput,
): HorsepowerFieldErrors {
  const errors: HorsepowerFieldErrors = {};

  const w = parseNumber(input.vehicleWeight);
  if (!w.blank) {
    if (w.invalid || w.value == null) {
      errors.vehicleWeight = 'Please enter a valid vehicle weight.';
    } else if (!(w.value > 0)) {
      errors.vehicleWeight = 'Vehicle weight must be greater than zero.';
    }
  }

  if (input.method === 'elapsedTime') {
    const et = parseNumber(input.quarterMileTime);
    if (!et.blank) {
      if (et.invalid || et.value == null || !(et.value > 0)) {
        errors.quarterMileTime =
          'Quarter-mile time must be greater than zero.';
      }
    }
  } else {
    const v = parseNumber(input.trapSpeed);
    if (!v.blank) {
      if (v.invalid || v.value == null || !(v.value > 0)) {
        errors.trapSpeed = 'Trap speed must be greater than zero.';
      }
    }
  }

  return errors;
}

export function validateHorsepowerInputs(
  input: HorsepowerInput,
): HorsepowerValidation {
  const errors = collectFieldErrors(input);

  if (parseNumber(input.vehicleWeight).blank) {
    return { isValid: false, errors, result: null };
  }

  if (input.method === 'elapsedTime') {
    if (parseNumber(input.quarterMileTime).blank) {
      return { isValid: false, errors, result: null };
    }
  } else if (parseNumber(input.trapSpeed).blank) {
    return { isValid: false, errors, result: null };
  }

  if (hasErrors(errors)) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateHorsepowerFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to estimate horsepower for these inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
