import { calculateIdlingFromInput } from './calculation';
import type { IdlingFieldErrors, IdlingInput, IdlingResult } from './types';

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

export interface IdlingValidation {
  isValid: boolean;
  errors: IdlingFieldErrors;
  result: IdlingResult | null;
}

export function collectFieldErrors(input: IdlingInput): IdlingFieldErrors {
  const errors: IdlingFieldErrors = {};

  if (!input.useCustomConsumption) {
    const e = parseNumber(input.engineCapacity);
    if (!e.blank) {
      if (e.invalid || e.value == null) {
        errors.engineCapacity = 'Please enter a valid engine capacity.';
      } else if (!(e.value > 0)) {
        errors.engineCapacity = 'Engine capacity must be greater than zero.';
      }
    }
  } else {
    const c = parseNumber(input.customConsumptionRate);
    if (!c.blank) {
      if (c.invalid || c.value == null) {
        errors.customConsumptionRate =
          'Please enter a valid consumption rate.';
      } else if (c.value < 0) {
        errors.customConsumptionRate =
          'Consumption rate cannot be negative.';
      }
    }
  }

  const t = parseNumber(input.idlingTime);
  if (!t.blank) {
    if (t.invalid || t.value == null) {
      errors.idlingTime = 'Please enter a valid idling time.';
    } else if (t.value < 0) {
      errors.idlingTime = 'Idling time cannot be negative.';
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

  if (input.showLongTerm) {
    const d = parseNumber(input.daysPerWeek);
    if (!d.blank) {
      if (d.invalid || d.value == null || !(d.value > 0) || d.value > 7) {
        errors.daysPerWeek = 'Days per week must be between 1 and 7.';
      }
    }
  }

  return errors;
}

export function validateIdlingInputs(input: IdlingInput): IdlingValidation {
  const errors = collectFieldErrors(input);

  const needEngine = !input.useCustomConsumption;
  const needCustom = input.useCustomConsumption;

  if (
    (needEngine && parseNumber(input.engineCapacity).blank) ||
    (needCustom && parseNumber(input.customConsumptionRate).blank) ||
    parseNumber(input.idlingTime).blank ||
    parseNumber(input.fuelPrice).blank ||
    (input.showLongTerm && parseNumber(input.daysPerWeek).blank)
  ) {
    return { isValid: false, errors, result: null };
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateIdlingFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
