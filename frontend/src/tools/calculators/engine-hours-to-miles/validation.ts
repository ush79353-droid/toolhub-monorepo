import { calculateEngineHoursFromInput, toMph, toMiles } from './calculation';
import type {
  EngineHoursFieldErrors,
  EngineHoursInput,
  EngineHoursResult,
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

export interface EngineHoursValidation {
  isValid: boolean;
  errors: EngineHoursFieldErrors;
  result: EngineHoursResult | null;
}

function hasErrors(errors: EngineHoursFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function collectFieldErrors(
  input: EngineHoursInput,
): EngineHoursFieldErrors {
  const errors: EngineHoursFieldErrors = {};

  if (input.mode === 'driving' || input.mode === 'stationary') {
    const h = parseNumber(input.engineHours);
    if (!h.blank) {
      if (h.invalid || h.value == null) {
        errors.engineHours = 'Please enter valid engine hours.';
      } else if (h.value < 0) {
        errors.engineHours = 'Engine hours cannot be negative.';
      }
    }
  }

  if (input.mode === 'driving' || input.mode === 'distanceToHours') {
    const s = parseNumber(input.averageSpeed);
    if (!s.blank) {
      if (s.invalid || s.value == null) {
        errors.averageSpeed = 'Please enter a valid average speed.';
      } else if (s.value < 0) {
        errors.averageSpeed = 'Average speed cannot be negative.';
      }
    }
  }

  if (input.mode === 'distanceToHours') {
    const d = parseNumber(input.distance);
    if (!d.blank) {
      if (d.invalid || d.value == null) {
        errors.distance = 'Please enter a valid distance.';
      } else if (d.value < 0) {
        errors.distance = 'Distance cannot be negative.';
      }
    }
    const s = parseNumber(input.averageSpeed);
    if (
      !d.blank &&
      !s.blank &&
      d.value != null &&
      s.value != null &&
      toMiles(d.value, input.distanceUnit) > 0 &&
      toMph(s.value, input.averageSpeedUnit) <= 0
    ) {
      errors.averageSpeed =
        'Average speed must be greater than zero to calculate engine hours from a positive distance.';
    }
  }

  if (input.mode === 'stationary') {
    const f = parseNumber(input.maintenanceFactor);
    if (!f.blank) {
      if (f.invalid || f.value == null || f.value < 0) {
        errors.maintenanceFactor =
          'Please enter a valid maintenance conversion factor.';
      }
    }
  }

  return errors;
}

export function validateEngineHoursInputs(
  input: EngineHoursInput,
): EngineHoursValidation {
  const errors = collectFieldErrors(input);

  if (input.mode === 'driving') {
    if (
      parseNumber(input.engineHours).blank ||
      parseNumber(input.averageSpeed).blank
    ) {
      return { isValid: false, errors, result: null };
    }
  } else if (input.mode === 'stationary') {
    if (
      parseNumber(input.engineHours).blank ||
      parseNumber(input.maintenanceFactor).blank
    ) {
      return { isValid: false, errors, result: null };
    }
  } else if (
    parseNumber(input.distance).blank ||
    parseNumber(input.averageSpeed).blank
  ) {
    return { isValid: false, errors, result: null };
  }

  if (hasErrors(errors)) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateEngineHoursFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
