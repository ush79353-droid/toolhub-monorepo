import { calculateFlightRadiationFromInput } from './calculation';
import type {
  FlightRadiationFieldErrors,
  FlightRadiationInput,
  FlightRadiationResult,
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

export interface FlightRadiationValidation {
  isValid: boolean;
  errors: FlightRadiationFieldErrors;
  result: FlightRadiationResult | null;
}

export function collectFieldErrors(
  input: FlightRadiationInput,
): FlightRadiationFieldErrors {
  const errors: FlightRadiationFieldErrors = {};

  const d = parseNumber(input.flightDuration);
  if (!d.blank) {
    if (d.invalid || d.value == null) {
      errors.flightDuration = 'Please enter a valid flight duration.';
    } else if (d.value < 0) {
      errors.flightDuration = 'Flight duration cannot be negative.';
    }
  }

  const r = parseNumber(input.doseRate);
  if (!r.blank) {
    if (r.invalid || r.value == null) {
      errors.doseRate = 'Please enter a valid radiation dose rate.';
    } else if (r.value < 0) {
      errors.doseRate = 'Radiation dose rate cannot be negative.';
    }
  }

  const f = parseNumber(input.numberOfFlights);
  if (!f.blank) {
    if (f.invalid || f.value == null) {
      errors.numberOfFlights = 'Please enter a valid number of flights.';
    } else if (f.value < 0) {
      errors.numberOfFlights = 'Please enter a valid number of flights.';
    } else if (!Number.isInteger(f.value)) {
      errors.numberOfFlights = 'Number of flights must be a whole number.';
    }
  }

  return errors;
}

export function validateFlightRadiationInputs(
  input: FlightRadiationInput,
): FlightRadiationValidation {
  const errors = collectFieldErrors(input);

  if (
    parseNumber(input.flightDuration).blank ||
    parseNumber(input.doseRate).blank ||
    parseNumber(input.numberOfFlights).blank
  ) {
    return { isValid: false, errors, result: null };
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateFlightRadiationFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
