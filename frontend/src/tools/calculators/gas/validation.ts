import { calculateGasFromInput } from './calculation';
import type { GasFieldErrors, GasInput, GasResult } from './types';

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

export interface GasValidation {
  isValid: boolean;
  errors: GasFieldErrors;
  result: GasResult | null;
}

export function collectFieldErrors(input: GasInput): GasFieldErrors {
  const errors: GasFieldErrors = {};

  const d = parseNumber(input.oneWayDistance);
  if (!d.blank) {
    if (d.invalid || d.value == null) {
      errors.oneWayDistance = 'Please enter a valid travel distance.';
    } else if (d.value < 0) {
      errors.oneWayDistance = 'Distance cannot be negative.';
    }
  }

  const e = parseNumber(input.fuelEfficiency);
  if (!e.blank) {
    if (e.invalid || e.value == null) {
      errors.fuelEfficiency = 'Please enter a valid fuel efficiency value.';
    } else if (e.value <= 0) {
      errors.fuelEfficiency = 'Fuel efficiency must be greater than zero.';
    }
  }

  const p = parseNumber(input.fuelPrice);
  if (!p.blank) {
    if (p.invalid || p.value == null) {
      errors.fuelPrice = 'Please enter a valid fuel price.';
    } else if (p.value < 0) {
      errors.fuelPrice = 'Fuel price cannot be negative.';
    }
  }

  const pass = parseNumber(input.passengers);
  if (!pass.blank) {
    if (
      pass.invalid ||
      pass.value == null ||
      pass.value <= 0 ||
      !Number.isInteger(pass.value)
    ) {
      errors.passengers = 'Passengers must be a positive whole number.';
    }
  }

  const avail = parseNumber(input.availableFuel);
  if (!avail.blank) {
    if (avail.invalid || avail.value == null) {
      errors.availableFuel = 'Please enter a valid available fuel amount.';
    } else if (avail.value < 0) {
      errors.availableFuel = 'Available fuel cannot be negative.';
    }
  }

  const trips = parseNumber(input.tripsPerWeek);
  if (!trips.blank) {
    if (trips.invalid || trips.value == null || !(trips.value > 0)) {
      errors.tripsPerWeek = 'Trips per week must be greater than zero.';
    }
  }

  const cmp = parseNumber(input.comparisonEfficiency);
  if (!cmp.blank) {
    if (cmp.invalid || cmp.value == null) {
      errors.comparisonEfficiency =
        'Please enter a valid comparison fuel efficiency.';
    } else if (cmp.value <= 0) {
      errors.comparisonEfficiency =
        'Comparison fuel efficiency must be greater than zero.';
    }
  }

  const red = parseNumber(input.consumptionReductionPercent);
  if (!red.blank) {
    if (red.invalid || red.value == null) {
      errors.consumptionReductionPercent =
        'Please enter a valid consumption reduction percent.';
    } else if (red.value < 0 || red.value >= 100) {
      errors.consumptionReductionPercent =
        'Consumption reduction must be from 0 up to (but not including) 100%.';
    }
  }

  return errors;
}

export function validateGasInputs(input: GasInput): GasValidation {
  const errors = collectFieldErrors(input);

  if (
    parseNumber(input.oneWayDistance).blank ||
    parseNumber(input.fuelEfficiency).blank ||
    parseNumber(input.fuelPrice).blank ||
    parseNumber(input.passengers).blank
  ) {
    return { isValid: false, errors, result: null };
  }

  const coreKeys: (keyof GasFieldErrors)[] = [
    'oneWayDistance',
    'fuelEfficiency',
    'fuelPrice',
    'passengers',
    'form',
  ];
  if (coreKeys.some((k) => errors[k])) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateGasFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    result,
  };
}
