import { calculateCompressionRatioToPsiFromInput } from './calculation';
import type {
  CompressionRatioToPsiFieldErrors,
  CompressionRatioToPsiInput,
  CompressionRatioToPsiResult,
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

export interface CompressionRatioToPsiValidation {
  isValid: boolean;
  errors: CompressionRatioToPsiFieldErrors;
  result: CompressionRatioToPsiResult | null;
}

function hasErrors(errors: CompressionRatioToPsiFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function collectFieldErrors(
  input: CompressionRatioToPsiInput,
): CompressionRatioToPsiFieldErrors {
  const errors: CompressionRatioToPsiFieldErrors = {};

  const atm = parseNumber(input.atmosphericPressure);
  if (!atm.blank) {
    if (atm.invalid || atm.value == null || !(atm.value > 0)) {
      errors.atmosphericPressure =
        'Atmospheric absolute pressure must be greater than zero.';
    }
  }

  if (input.model === 'polytropic') {
    const n = parseNumber(input.polytropicExponent);
    if (!n.blank) {
      if (n.invalid || n.value == null || !(n.value > 0)) {
        errors.polytropicExponent = 'Please enter a valid polytropic exponent.';
      }
    }
  }

  if (input.direction === 'ratioToPressure') {
    const x = parseNumber(input.numerator);
    if (!x.blank) {
      if (x.invalid || x.value == null || !(x.value > 0)) {
        errors.numerator =
          'Compression ratio numerator must be greater than zero.';
      }
    }
    const y = parseNumber(input.denominator);
    if (!y.blank) {
      if (y.invalid || y.value == null || !(y.value > 0)) {
        errors.denominator =
          'Compression ratio denominator must be greater than zero.';
      }
    }
    if (
      !x.blank &&
      !y.blank &&
      x.value != null &&
      y.value != null &&
      x.value > 0 &&
      y.value > 0 &&
      x.value / y.value < 1
    ) {
      errors.numerator = 'Compression ratio must be at least 1.';
    }
  } else {
    const p = parseNumber(input.compressionPressure);
    if (!p.blank) {
      if (p.invalid || p.value == null) {
        errors.compressionPressure =
          'Compression pressure must be a valid number.';
      }
    }
  }

  return errors;
}

export function validateCompressionRatioToPsiInputs(
  input: CompressionRatioToPsiInput,
): CompressionRatioToPsiValidation {
  const errors = collectFieldErrors(input);

  if (parseNumber(input.atmosphericPressure).blank) {
    return { isValid: false, errors, result: null };
  }

  if (input.model === 'polytropic' && parseNumber(input.polytropicExponent).blank) {
    errors.polytropicExponent = 'Please enter a valid polytropic exponent.';
    return { isValid: false, errors, result: null };
  }

  if (input.direction === 'ratioToPressure') {
    if (
      parseNumber(input.numerator).blank ||
      parseNumber(input.denominator).blank
    ) {
      return { isValid: false, errors, result: null };
    }
  } else if (parseNumber(input.compressionPressure).blank) {
    return { isValid: false, errors, result: null };
  }

  if (hasErrors(errors)) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateCompressionRatioToPsiFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: {
        form: 'The selected pressure and atmospheric pressure values do not represent a valid compression process.',
      },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
