import { calculateCommuteFromInput } from './calculation';
import type {
  CommuteFieldErrors,
  CommuteInput,
  CommuteResult,
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

export interface CommuteValidation {
  isValid: boolean;
  errors: CommuteFieldErrors;
  result: CommuteResult | null;
}

function hasErrors(errors: CommuteFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function collectFieldErrors(input: CommuteInput): CommuteFieldErrors {
  const errors: CommuteFieldErrors = {};

  const d = parseNumber(input.oneWayDistance);
  if (!d.blank) {
    if (d.invalid || d.value == null || !(d.value > 0)) {
      errors.oneWayDistance = 'Please enter a valid commute distance.';
    }
  }

  const c = parseNumber(input.commuteCount);
  if (!c.blank) {
    if (c.invalid || c.value == null || !(c.value > 0)) {
      errors.commuteCount = 'Commute frequency must be a positive number.';
    }
  }

  const p = parseNumber(input.peopleSharingRide);
  if (!p.blank) {
    if (
      p.invalid ||
      p.value == null ||
      !Number.isInteger(p.value) ||
      p.value < 1
    ) {
      errors.peopleSharingRide =
        'The number of people must be a positive whole number.';
    }
  }

  if (input.showCar) {
    const e = parseNumber(input.fuelEconomy);
    if (!e.blank) {
      if (e.invalid || e.value == null || !(e.value > 0)) {
        errors.fuelEconomy = 'Fuel economy must be greater than zero.';
      }
    }
    const fp = parseNumber(input.fuelPrice);
    if (!fp.blank) {
      if (fp.invalid || fp.value == null || fp.value < 0) {
        errors.fuelPrice = 'Fuel price cannot be negative.';
      }
    }
    const park = parseNumber(input.parkingAndTolls);
    if (!park.blank) {
      if (park.invalid || park.value == null || park.value < 0) {
        errors.parkingAndTolls =
          'Parking and toll costs cannot be negative.';
      }
    }
    const wear = parseNumber(input.wearAndTear);
    if (!wear.blank) {
      if (wear.invalid || wear.value == null || wear.value < 0) {
        errors.wearAndTear = 'Please enter a valid numerical value.';
      }
    }
  }

  if (input.showTransit) {
    const t = parseNumber(input.ticketPrice);
    if (!t.blank) {
      if (t.invalid || t.value == null || t.value < 0) {
        errors.ticketPrice = 'Please enter a valid numerical value.';
      }
    }
    if (input.ticketMode === 'timeBasedPass') {
      const v = parseNumber(input.ticketValidity);
      if (!v.blank) {
        if (v.invalid || v.value == null || !(v.value > 0)) {
          errors.ticketValidity = 'Ticket validity must be greater than zero.';
        }
      }
    }
    if (input.ticketMode === 'perRide') {
      const r = parseNumber(input.paidRidesPerDay);
      if (!r.blank) {
        if (r.invalid || r.value == null || !(r.value > 0)) {
          errors.paidRidesPerDay = 'Please enter a valid numerical value.';
        }
      }
    }
  }

  return errors;
}

export function validateCommuteInputs(
  input: CommuteInput,
): CommuteValidation {
  const errors = collectFieldErrors(input);

  const d = parseNumber(input.oneWayDistance);
  if (d.blank) return { isValid: false, errors, result: null };

  const c = parseNumber(input.commuteCount);
  if (c.blank) return { isValid: false, errors, result: null };

  const needCar =
    input.showCar &&
    parseNumber(input.fuelEconomy).blank === false &&
    parseNumber(input.fuelPrice).blank === false;
  const needTransit =
    input.showTransit && parseNumber(input.ticketPrice).blank === false;

  // Incomplete car: economy or price missing — OK if transit present
  if (input.showCar) {
    const e = parseNumber(input.fuelEconomy);
    const fp = parseNumber(input.fuelPrice);
    if (!e.blank && e.value != null && !(e.value > 0)) {
      // already in errors
    }
    if (!fp.blank && fp.value != null && fp.value < 0) {
      // already
    }
  }

  if (input.showTransit && input.ticketMode === 'timeBasedPass') {
    const v = parseNumber(input.ticketValidity);
    if (parseNumber(input.ticketPrice).blank === false && v.blank) {
      errors.ticketValidity = 'Ticket validity must be greater than zero.';
      return { isValid: false, errors, result: null };
    }
  }

  if (hasErrors(errors)) {
    return { isValid: false, errors, result: null };
  }

  if (!needCar && !needTransit) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateCommuteFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: {},
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
