import {
  calculateFuelCostFromInput,
  resolveEconomyL100,
} from './calculation';
import type {
  FuelCostFieldErrors,
  FuelCostInput,
  FuelCostResult,
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

export interface FuelCostValidation {
  isValid: boolean;
  errors: FuelCostFieldErrors;
  result: FuelCostResult | null;
}

export function collectFieldErrors(input: FuelCostInput): FuelCostFieldErrors {
  const errors: FuelCostFieldErrors = {};

  const d = parseNumber(input.oneWayDistance);
  if (!d.blank) {
    if (d.invalid || d.value == null) {
      errors.oneWayDistance = 'Please enter a valid travel distance.';
    } else if (d.value < 0) {
      errors.oneWayDistance = 'Distance cannot be negative.';
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

  if (!input.useEstimatedEfficiency || input.vehicleEstimate === 'custom') {
    const e = parseNumber(input.fuelEfficiency);
    if (!e.blank) {
      if (e.invalid || e.value == null) {
        errors.fuelEfficiency = 'Please enter a valid fuel efficiency value.';
      } else if (e.value <= 0) {
        errors.fuelEfficiency = 'Fuel efficiency must be greater than zero.';
      }
    }
  } else if (resolveEconomyL100(input) == null) {
    errors.fuelEfficiency = 'Please select a valid fuel economy unit.';
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

  return errors;
}

export function validateFuelCostInputs(
  input: FuelCostInput,
): FuelCostValidation {
  const errors = collectFieldErrors(input);

  const needEff =
    !input.useEstimatedEfficiency || input.vehicleEstimate === 'custom';

  if (
    parseNumber(input.oneWayDistance).blank ||
    parseNumber(input.fuelPrice).blank ||
    (needEff && parseNumber(input.fuelEfficiency).blank) ||
    parseNumber(input.passengers).blank
  ) {
    return { isValid: false, errors, result: null };
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateFuelCostFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
