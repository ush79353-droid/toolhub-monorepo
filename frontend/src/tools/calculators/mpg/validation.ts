import { calculateMpgFromInput } from './calculation';
import type { MpgFieldErrors, MpgInput, MpgResult } from './types';

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

export interface MpgValidation {
  isValid: boolean;
  errors: MpgFieldErrors;
  result: MpgResult | null;
}

export function collectFieldErrors(input: MpgInput): MpgFieldErrors {
  const errors: MpgFieldErrors = {};
  const mode = input.calculationMode;

  if (mode === 'fuel-economy' || mode === 'fuel-used') {
    const d = parseNumber(input.distance);
    if (!d.blank) {
      if (d.invalid || d.value == null) {
        errors.distance = 'Please enter a valid distance.';
      } else if (d.value < 0) {
        errors.distance = 'Distance cannot be negative.';
      }
    }
  }

  if (mode === 'fuel-economy' || mode === 'distance') {
    const f = parseNumber(input.fuelUsed);
    if (!f.blank) {
      if (f.invalid || f.value == null) {
        errors.fuelUsed = 'Please enter a valid fuel amount.';
      } else if (f.value < 0) {
        errors.fuelUsed = 'Fuel used cannot be negative.';
      } else if (
        mode === 'fuel-economy' &&
        f.value === 0 &&
        !parseNumber(input.distance).blank &&
        (parseNumber(input.distance).value ?? 0) > 0
      ) {
        errors.fuelUsed =
          'Fuel used must be greater than zero for a positive distance.';
      }
    }
  }

  if (mode === 'fuel-used' || mode === 'distance') {
    const e = parseNumber(input.fuelEconomy);
    if (!e.blank) {
      if (e.invalid || e.value == null) {
        errors.fuelEconomy = 'Please enter a valid fuel economy.';
      } else if (!(e.value > 0)) {
        errors.fuelEconomy = 'Fuel economy must be greater than zero.';
      }
    }
  }

  if (input.showTripCost) {
    const td = parseNumber(input.tripDistance);
    if (!td.blank) {
      if (td.invalid || td.value == null || td.value < 0) {
        errors.tripDistance = 'Trip distance cannot be negative.';
      }
    }
    const p = parseNumber(input.fuelPrice);
    if (!p.blank) {
      if (p.invalid || p.value == null || p.value < 0) {
        errors.fuelPrice = 'Fuel price cannot be negative.';
      }
    }
  }

  if (input.showRange) {
    const a = parseNumber(input.availableFuel);
    if (!a.blank) {
      if (a.invalid || a.value == null || a.value < 0) {
        errors.availableFuel = 'Available fuel cannot be negative.';
      }
    }
  }

  if (input.showCompare) {
    const b = parseNumber(input.compareEconomyB);
    if (!b.blank) {
      if (b.invalid || b.value == null || !(b.value > 0)) {
        errors.compareEconomyB = 'Vehicle B economy must be greater than zero.';
      }
    }
    const cd = parseNumber(input.compareDistance);
    if (!cd.blank) {
      if (cd.invalid || cd.value == null || cd.value < 0) {
        errors.compareDistance = 'Compare distance cannot be negative.';
      }
    }
  }

  if (input.showImprove) {
    const prev = parseNumber(input.previousEconomy);
    if (!prev.blank) {
      if (prev.invalid || prev.value == null || !(prev.value > 0)) {
        errors.previousEconomy = 'Previous economy must be greater than zero.';
      }
    }
    const neu = parseNumber(input.newEconomy);
    if (!neu.blank) {
      if (neu.invalid || neu.value == null || !(neu.value > 0)) {
        errors.newEconomy = 'New economy must be greater than zero.';
      }
    }
  }

  return errors;
}

export function validateMpgInputs(input: MpgInput): MpgValidation {
  const errors = collectFieldErrors(input);
  const mode = input.calculationMode;

  if (mode === 'fuel-economy') {
    if (parseNumber(input.distance).blank || parseNumber(input.fuelUsed).blank) {
      return { isValid: false, errors, result: null };
    }
  } else if (mode === 'fuel-used') {
    if (
      parseNumber(input.distance).blank ||
      parseNumber(input.fuelEconomy).blank
    ) {
      return { isValid: false, errors, result: null };
    }
  } else if (
    parseNumber(input.fuelUsed).blank ||
    parseNumber(input.fuelEconomy).blank
  ) {
    return { isValid: false, errors, result: null };
  }

  if (input.showTripCost) {
    if (
      parseNumber(input.tripDistance).blank ||
      parseNumber(input.fuelPrice).blank
    ) {
      return { isValid: false, errors, result: null };
    }
  }

  if (input.showRange && parseNumber(input.availableFuel).blank) {
    return { isValid: false, errors, result: null };
  }

  if (input.showCompare) {
    if (
      parseNumber(input.compareEconomyB).blank ||
      parseNumber(input.compareDistance).blank ||
      parseNumber(input.fuelPrice).blank
    ) {
      return { isValid: false, errors, result: null };
    }
  }

  if (input.showImprove) {
    if (
      parseNumber(input.previousEconomy).blank ||
      parseNumber(input.newEconomy).blank
    ) {
      return { isValid: false, errors, result: null };
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateMpgFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
