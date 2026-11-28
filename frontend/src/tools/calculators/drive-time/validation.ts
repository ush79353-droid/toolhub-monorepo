import {
  calculateDriveTimeFromInput,
  parseLocalDateTime,
  toKmh,
  toKm,
} from './calculation';
import type {
  DriveTimeFieldErrors,
  DriveTimeInput,
  DriveTimeResult,
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

export interface DriveTimeValidation {
  isValid: boolean;
  errors: DriveTimeFieldErrors;
  result: DriveTimeResult | null;
}

function hasErrors(errors: DriveTimeFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function collectFieldErrors(
  input: DriveTimeInput,
): DriveTimeFieldErrors {
  const errors: DriveTimeFieldErrors = {};

  const dist = parseNumber(input.distance);
  if (!dist.blank) {
    if (dist.invalid || dist.value == null || dist.value < 0) {
      errors.distance = 'Distance cannot be negative.';
    }
  }

  const speed = parseNumber(input.averageSpeed);
  if (!speed.blank) {
    if (speed.invalid || speed.value == null || speed.value < 0) {
      errors.averageSpeed = 'Average speed must be greater than zero.';
    } else if (
      speed.value === 0 &&
      dist.value != null &&
      dist.value > 0
    ) {
      errors.averageSpeed = 'Average speed must be greater than zero.';
    } else if (
      speed.value === 0 &&
      !dist.blank &&
      dist.value != null &&
      toKm(dist.value, input.distanceUnit) > 0
    ) {
      errors.averageSpeed = 'Average speed must be greater than zero.';
    }
  }

  // Cross-check: nonzero distance requires positive speed
  if (
    !dist.blank &&
    !speed.blank &&
    dist.value != null &&
    speed.value != null &&
    dist.value >= 0 &&
    toKm(dist.value, input.distanceUnit) > 0 &&
    toKmh(speed.value, input.speedUnit) <= 0
  ) {
    errors.averageSpeed = 'Average speed must be greater than zero.';
  }

  const brk = parseNumber(input.breakDuration);
  if (!brk.blank) {
    if (brk.invalid || brk.value == null || brk.value < 0) {
      errors.breakDuration = 'Break duration cannot be negative.';
    }
  }

  if (input.scheduleMode === 'arrivalFromDeparture') {
    if (input.departureLocal.trim() !== '') {
      if (!parseLocalDateTime(input.departureLocal)) {
        errors.departureLocal = 'Please enter a valid date and time.';
      }
    }
  } else if (input.arrivalLocal.trim() !== '') {
    if (!parseLocalDateTime(input.arrivalLocal)) {
      errors.arrivalLocal = 'Please enter a valid date and time.';
    }
  }

  const eff = parseNumber(input.fuelEfficiency);
  if (!eff.blank) {
    if (eff.invalid || eff.value == null || !(eff.value > 0)) {
      errors.fuelEfficiency = 'Fuel efficiency must be a valid value.';
    }
  }

  const price = parseNumber(input.fuelPrice);
  if (!price.blank) {
    if (price.invalid || price.value == null || price.value < 0) {
      errors.fuelPrice = 'Fuel price cannot be negative.';
    }
  }

  for (const key of ['parkingCost', 'tollCost', 'otherExpenses'] as const) {
    const e = parseNumber(input[key]);
    if (!e.blank && (e.invalid || e.value == null || e.value < 0)) {
      errors[key] = 'Expense cannot be negative.';
    }
  }

  const pass = parseNumber(input.passengers);
  if (!pass.blank) {
    if (
      pass.invalid ||
      pass.value == null ||
      !Number.isInteger(pass.value) ||
      pass.value < 1
    ) {
      errors.passengers = 'Number of passengers must be at least 1.';
    }
  }

  return errors;
}

export function validateDriveTimeInputs(
  input: DriveTimeInput,
): DriveTimeValidation {
  const errors = collectFieldErrors(input);

  const requiredBlank =
    parseNumber(input.distance).blank ||
    parseNumber(input.averageSpeed).blank ||
    parseNumber(input.breakDuration).blank ||
    parseNumber(input.fuelEfficiency).blank ||
    parseNumber(input.fuelPrice).blank ||
    parseNumber(input.parkingCost).blank ||
    parseNumber(input.tollCost).blank ||
    parseNumber(input.otherExpenses).blank ||
    parseNumber(input.passengers).blank ||
    (input.scheduleMode === 'arrivalFromDeparture'
      ? input.departureLocal.trim() === ''
      : input.arrivalLocal.trim() === '');

  if (requiredBlank) {
    return { isValid: false, errors, result: null };
  }

  if (hasErrors(errors)) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateDriveTimeFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
