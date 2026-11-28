import {
  calculateFuelPumpFromInput,
  parsePumpCurve,
} from './calculation';
import type {
  FuelPumpFieldErrors,
  FuelPumpInput,
  FuelPumpResult,
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

export interface FuelPumpValidation {
  isValid: boolean;
  errors: FuelPumpFieldErrors;
  result: FuelPumpResult | null;
}

export function collectFieldErrors(input: FuelPumpInput): FuelPumpFieldErrors {
  const errors: FuelPumpFieldErrors = {};

  const p = parseNumber(input.power);
  if (!p.blank) {
    if (p.invalid || p.value == null) {
      errors.power = 'Please enter a valid engine power.';
    } else if (p.value <= 0) {
      errors.power = 'Engine power must be greater than zero.';
    }
  }

  const bsfc = parseNumber(input.bsfc);
  if (!bsfc.blank) {
    if (bsfc.invalid || bsfc.value == null || !(bsfc.value > 0)) {
      errors.bsfc = 'Please enter a valid BSFC.';
    }
  }

  const dens = parseNumber(input.fuelDensity);
  if (!dens.blank) {
    if (dens.invalid || dens.value == null || !(dens.value > 0)) {
      errors.fuelDensity = 'Please enter a valid fuel density.';
    }
  }

  const base = parseNumber(input.baseFuelPressure);
  if (!base.blank) {
    if (base.invalid || base.value == null || !(base.value > 0)) {
      errors.baseFuelPressure = 'Please enter a valid base fuel pressure.';
    }
  }

  const boost = parseNumber(input.boostPressure);
  if (!boost.blank) {
    if (boost.invalid || boost.value == null || boost.value < 0) {
      errors.boostPressure = 'Boost pressure cannot be negative.';
    }
  }

  const loss = parseNumber(input.pressureLoss);
  if (!loss.blank) {
    if (loss.invalid || loss.value == null || loss.value < 0) {
      errors.pressureLoss = 'Pressure loss cannot be negative.';
    }
  }

  const margin = parseNumber(input.safetyMarginPercent);
  if (!margin.blank) {
    if (margin.invalid || margin.value == null || margin.value < 0) {
      errors.safetyMarginPercent = 'Safety margin cannot be negative.';
    }
  }

  if (input.pumpCurveRaw.trim() !== '') {
    const { error } = parsePumpCurve(input.pumpCurveRaw);
    if (error) errors.pumpCurveRaw = error;
  }

  return errors;
}

export function validateFuelPumpInputs(
  input: FuelPumpInput,
): FuelPumpValidation {
  const errors = collectFieldErrors(input);

  if (
    parseNumber(input.power).blank ||
    parseNumber(input.bsfc).blank ||
    parseNumber(input.fuelDensity).blank ||
    parseNumber(input.baseFuelPressure).blank ||
    parseNumber(input.boostPressure).blank
  ) {
    return { isValid: false, errors, result: null };
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateFuelPumpFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
