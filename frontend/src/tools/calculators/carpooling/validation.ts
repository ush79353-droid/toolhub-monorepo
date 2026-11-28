import { calculateCarpoolingFromInput } from './calculation';
import type {
  CarpoolingFieldErrors,
  CarpoolingInput,
  CarpoolingResult,
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

export interface CarpoolingValidation {
  isValid: boolean;
  errors: CarpoolingFieldErrors;
  result: CarpoolingResult | null;
}

function hasErrors(errors: CarpoolingFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function collectFieldErrors(
  input: CarpoolingInput,
): CarpoolingFieldErrors {
  const errors: CarpoolingFieldErrors = {};

  if (!input.useFuelUsedOverride) {
    const e = parseNumber(input.fuelEconomy);
    if (!e.blank) {
      if (e.invalid || e.value == null) {
        errors.fuelEconomy = 'Please enter a valid numerical value.';
      } else if (!(e.value > 0)) {
        errors.fuelEconomy = 'Fuel economy must be greater than zero.';
      }
    }
  }

  const d = parseNumber(input.distance);
  if (!d.blank) {
    if (d.invalid || d.value == null) {
      errors.distance = 'Enter a valid trip distance.';
    } else if (d.value < 0) {
      errors.distance = 'Enter a valid trip distance.';
    }
  }

  if (input.useFuelUsedOverride) {
    const f = parseNumber(input.fuelUsedOverride);
    if (!f.blank) {
      if (f.invalid || f.value == null) {
        errors.fuelUsedOverride = 'Please enter a valid numerical value.';
      } else if (f.value < 0) {
        errors.fuelUsedOverride = 'Please enter a valid numerical value.';
      }
    }
  }

  const p = parseNumber(input.fuelPrice);
  if (!p.blank) {
    if (p.invalid || p.value == null) {
      errors.fuelPrice = 'Please enter a valid numerical value.';
    } else if (p.value < 0) {
      errors.fuelPrice = 'Fuel price cannot be negative.';
    }
  }

  const n = parseNumber(input.numberOfPeople);
  if (!n.blank) {
    if (n.invalid || n.value == null) {
      errors.numberOfPeople =
        'The number of people must be a positive whole number.';
    } else if (!Number.isInteger(n.value) || n.value < 1) {
      errors.numberOfPeople =
        'The number of people must be a positive whole number.';
    } else if (
      (input.paymentMethod === 'driverFree' ||
        input.paymentMethod === 'customDriverContribution') &&
      n.value < 2
    ) {
      errors.numberOfPeople =
        'Enter at least two people to split the cost among passengers.';
    }
  }

  for (const key of ['tolls', 'parking', 'otherExpenses'] as const) {
    const x = parseNumber(input[key]);
    if (!x.blank) {
      if (x.invalid || x.value == null) {
        errors[key] = 'Please enter a valid numerical value.';
      } else if (x.value < 0) {
        errors[key] = 'Additional expenses cannot be negative.';
      }
    }
  }

  if (input.paymentMethod === 'customDriverContribution') {
    const c = parseNumber(input.driverContribution);
    if (!c.blank) {
      if (c.invalid || c.value == null) {
        errors.driverContribution = 'Please enter a valid numerical value.';
      } else if (c.value < 0) {
        errors.driverContribution = 'Please enter a valid numerical value.';
      }
    }
  }

  if (input.enableSavings) {
    const s = parseNumber(input.soloFuelEconomy);
    if (!s.blank) {
      if (s.invalid || s.value == null || !(s.value > 0)) {
        errors.soloFuelEconomy = 'Fuel economy must be greater than zero.';
      }
    }
  }

  return errors;
}

export function validateCarpoolingInputs(
  input: CarpoolingInput,
): CarpoolingValidation {
  const errors = collectFieldErrors(input);

  const d = parseNumber(input.distance);
  if (d.blank) return { isValid: false, errors, result: null };

  if (!input.useFuelUsedOverride) {
    const e = parseNumber(input.fuelEconomy);
    if (e.blank) return { isValid: false, errors, result: null };
  } else {
    const f = parseNumber(input.fuelUsedOverride);
    if (f.blank) return { isValid: false, errors, result: null };
  }

  const p = parseNumber(input.fuelPrice);
  if (p.blank) return { isValid: false, errors, result: null };

  const n = parseNumber(input.numberOfPeople);
  if (n.blank) {
    errors.numberOfPeople =
      'The number of people must be a positive whole number.';
    return { isValid: false, errors, result: null };
  }

  if (input.paymentMethod === 'customDriverContribution') {
    const c = parseNumber(input.driverContribution);
    if (c.blank) {
      errors.driverContribution = 'Please enter a valid numerical value.';
      return { isValid: false, errors, result: null };
    }
  }

  if (hasErrors(errors)) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateCarpoolingFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with the current inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
