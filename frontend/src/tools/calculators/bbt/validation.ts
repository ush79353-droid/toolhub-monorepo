import { calculateBbtFromInput, parseFiniteNumber } from './calculation';
import type { BbtFieldErrors, BbtInput, BbtResult } from './types';

export interface BbtValidation {
  isValid: boolean;
  errors: BbtFieldErrors;
  result: BbtResult | null;
}

function timePartError(
  hoursRaw: string,
  minutesRaw: string,
  label: string,
): string | undefined {
  const hoursBlank = hoursRaw.trim() === '';
  const minutesBlank = minutesRaw.trim() === '';
  if (hoursBlank && minutesBlank) {
    return `Enter ${label} (hours and minutes).`;
  }
  const hours = parseFiniteNumber(hoursRaw);
  const minutes = parseFiniteNumber(minutesRaw);
  if (hoursBlank || minutesBlank || hours == null || minutes == null) {
    return `Enter a complete ${label} with hours (0–23) and minutes (0–59).`;
  }
  if (!Number.isInteger(hours) || hours < 0 || hours > 23) {
    return `${label}: hours must be a whole number from 0 to 23.`;
  }
  if (!Number.isInteger(minutes) || minutes < 0 || minutes > 59) {
    return `${label}: minutes must be a whole number from 0 to 59.`;
  }
  return undefined;
}

function measuredError(
  raw: string,
  unit: BbtInput['temperatureUnit'],
): string | undefined {
  if (raw.trim() === '') return 'Enter the measured temperature.';
  const value = parseFiniteNumber(raw);
  if (value == null) return 'Enter a valid measured temperature.';
  // Wide educational gate — not a clinical fever threshold.
  if (unit === 'celsius') {
    if (value < 34 || value > 42) {
      return 'Measured °C looks outside a typical body-temperature range.';
    }
  } else if (value < 93 || value > 108) {
    return 'Measured °F looks outside a typical body-temperature range.';
  }
  return undefined;
}

export function collectFieldErrors(input: BbtInput): BbtFieldErrors {
  const errors: BbtFieldErrors = {};
  const usual = timePartError(
    input.usualHours,
    input.usualMinutes,
    'usual temperature check time',
  );
  const actual = timePartError(
    input.actualHours,
    input.actualMinutes,
    'actual temperature check time',
  );
  const measured = measuredError(
    input.measuredTemperature,
    input.temperatureUnit,
  );
  if (usual) errors.usualTime = usual;
  if (actual) errors.actualTime = actual;
  if (measured) errors.measuredTemperature = measured;
  return errors;
}

export function validateBbtInput(input: BbtInput): BbtValidation {
  const errors = collectFieldErrors(input);
  const hasErrors = Object.keys(errors).length > 0;
  if (hasErrors) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateBbtFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with the current inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
