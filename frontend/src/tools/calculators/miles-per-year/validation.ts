import { calculateMilesPerYearFromInput } from './calculation';
import type {
  MilesPerYearFieldErrors,
  MilesPerYearInput,
  MilesPerYearResult,
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

export interface MilesPerYearValidation {
  isValid: boolean;
  errors: MilesPerYearFieldErrors;
  result: MilesPerYearResult | null;
}

export function collectFieldErrors(
  input: MilesPerYearInput,
): MilesPerYearFieldErrors {
  const errors: MilesPerYearFieldErrors = {};

  if (input.mode === 'period') {
    const d = parseNumber(input.distance);
    if (!d.blank) {
      if (d.invalid || d.value == null) {
        errors.distance = 'Please enter a valid distance.';
      } else if (d.value < 0) {
        errors.distance = 'Distance cannot be negative.';
      }
    }
  } else {
    const o = parseNumber(input.oneWayCommute);
    if (!o.blank) {
      if (o.invalid || o.value == null) {
        errors.oneWayCommute = 'Please enter a valid commute distance.';
      } else if (o.value < 0) {
        errors.oneWayCommute = 'Commute distance cannot be negative.';
      }
    }
    const days = parseNumber(input.daysPerWeek);
    if (!days.blank) {
      if (
        days.invalid ||
        days.value == null ||
        days.value < 0 ||
        days.value > 7
      ) {
        errors.daysPerWeek = 'Days per week must be from 0 to 7.';
      }
    }
    const weeks = parseNumber(input.weeksPerYear);
    if (!weeks.blank) {
      if (
        weeks.invalid ||
        weeks.value == null ||
        weeks.value < 0 ||
        weeks.value > 53
      ) {
        errors.weeksPerYear = 'Weeks per year must be from 0 to 53.';
      }
    }
    const add = parseNumber(input.additionalWeekly);
    if (!add.blank) {
      if (add.invalid || add.value == null || add.value < 0) {
        errors.additionalWeekly =
          'Additional weekly distance cannot be negative.';
      }
    }
  }

  if (input.showFuelCost) {
    const e = parseNumber(input.fuelEfficiency);
    if (!e.blank) {
      if (e.invalid || e.value == null || !(e.value > 0)) {
        errors.fuelEfficiency = 'Fuel efficiency must be greater than zero.';
      }
    }
    const p = parseNumber(input.fuelPrice);
    if (!p.blank) {
      if (p.invalid || p.value == null || p.value < 0) {
        errors.fuelPrice = 'Fuel price cannot be negative.';
      }
    }
  }

  if (input.showProjection) {
    const o = parseNumber(input.currentOdometer);
    if (!o.blank) {
      if (o.invalid || o.value == null || o.value < 0) {
        errors.currentOdometer = 'Odometer cannot be negative.';
      }
    }
    const y = parseNumber(input.projectionYears);
    if (!y.blank) {
      if (y.invalid || y.value == null || y.value < 0) {
        errors.projectionYears = 'Years cannot be negative.';
      }
    }
  }

  return errors;
}

export function validateMilesPerYearInputs(
  input: MilesPerYearInput,
): MilesPerYearValidation {
  const errors = collectFieldErrors(input);

  if (input.mode === 'period') {
    if (parseNumber(input.distance).blank) {
      return { isValid: false, errors, result: null };
    }
  } else if (
    parseNumber(input.oneWayCommute).blank ||
    parseNumber(input.daysPerWeek).blank ||
    parseNumber(input.weeksPerYear).blank ||
    parseNumber(input.additionalWeekly).blank
  ) {
    return { isValid: false, errors, result: null };
  }

  if (input.showFuelCost) {
    if (
      parseNumber(input.fuelEfficiency).blank ||
      parseNumber(input.fuelPrice).blank
    ) {
      return { isValid: false, errors, result: null };
    }
  }

  if (input.showProjection) {
    if (
      parseNumber(input.currentOdometer).blank ||
      parseNumber(input.projectionYears).blank
    ) {
      return { isValid: false, errors, result: null };
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateMilesPerYearFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
