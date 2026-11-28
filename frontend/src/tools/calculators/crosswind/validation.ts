import { calculateWindComponentsFromInput } from './calculation';
import type {
  CrosswindFieldErrors,
  CrosswindInput,
  CrosswindResult,
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

export interface CrosswindValidation {
  isValid: boolean;
  errors: CrosswindFieldErrors;
  result: CrosswindResult | null;
}

function hasErrors(errors: CrosswindFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function collectFieldErrors(
  input: CrosswindInput,
): CrosswindFieldErrors {
  const errors: CrosswindFieldErrors = {};

  const runway = Number.parseInt(input.runwayNumber, 10);
  if (
    input.runwayNumber.trim() === '' ||
    !Number.isInteger(runway) ||
    runway < 1 ||
    runway > 36
  ) {
    errors.runwayNumber =
      'Please select a runway number between 01 and 36.';
  }

  if (input.useCustomHeading) {
    const h = parseNumber(input.customRunwayHeading);
    if (!h.blank) {
      if (h.invalid || h.value == null || h.value < 0 || h.value > 360) {
        errors.customRunwayHeading = 'Please enter a valid runway heading.';
      }
    }
  }

  const wind = parseNumber(input.windDirection);
  if (!wind.blank) {
    if (
      wind.invalid ||
      wind.value == null ||
      wind.value < 0 ||
      wind.value > 360
    ) {
      errors.windDirection =
        'Wind direction must be between 0° and 360°.';
    }
  }

  if (input.windReference === 'true') {
    const v = parseNumber(input.magneticVariation);
    if (!v.blank) {
      if (
        v.invalid ||
        v.value == null ||
        !Number.isFinite(v.value) ||
        Math.abs(v.value) > 180
      ) {
        errors.magneticVariation =
          'Please enter a valid magnetic variation (−180° to 180°, east positive).';
      }
    }
  }

  const speed = parseNumber(input.windSpeed);
  if (!speed.blank) {
    if (speed.invalid || speed.value == null) {
      errors.windSpeed = 'Please enter a valid wind speed.';
    } else if (speed.value < 0) {
      errors.windSpeed = 'Wind speed cannot be negative.';
    }
  }

  return errors;
}

export function validateCrosswindInputs(
  input: CrosswindInput,
): CrosswindValidation {
  const errors = collectFieldErrors(input);

  if (input.useCustomHeading && parseNumber(input.customRunwayHeading).blank) {
    errors.customRunwayHeading = 'Please enter a valid runway heading.';
    return { isValid: false, errors, result: null };
  }

  if (parseNumber(input.windDirection).blank) {
    return { isValid: false, errors, result: null };
  }

  if (input.windReference === 'true' && parseNumber(input.magneticVariation).blank) {
    errors.magneticVariation =
      'Please enter a valid magnetic variation (−180° to 180°, east positive).';
    return { isValid: false, errors, result: null };
  }

  if (parseNumber(input.windSpeed).blank) {
    return { isValid: false, errors, result: null };
  }

  if (hasErrors(errors)) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateWindComponentsFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate wind components for these inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
