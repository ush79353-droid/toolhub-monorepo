import { calculateBSFCFromInput } from './calculation';
import type {
  BSFCFieldErrors,
  BSFCInput,
  BSFCResult,
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

export interface BSFCValidation {
  isValid: boolean;
  errors: BSFCFieldErrors;
  result: BSFCResult | null;
}

function hasErrors(errors: BSFCFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function collectFieldErrors(input: BSFCInput): BSFCFieldErrors {
  const errors: BSFCFieldErrors = {};
  const mode = input.mode;

  if (mode === 'efficiency' || mode === 'fuelConsumption' || mode === 'bsfc') {
    const p = parseNumber(input.power);
    if (!p.blank) {
      if (p.invalid || p.value == null) {
        errors.power = 'Enter a valid engine power.';
      } else if (p.value < 0) {
        errors.power = 'Engine power cannot be negative.';
      }
    } else if (mode === 'fuelConsumption') {
      errors.power = 'Enter a valid engine power.';
    }
  }

  if (mode === 'efficiency' || mode === 'fuelConsumption' || mode === 'enginePower') {
    const b = parseNumber(input.bsfc);
    if (!b.blank) {
      if (b.invalid || b.value == null) {
        errors.bsfc = 'Please enter a valid numerical value.';
      } else if (b.value < 0) {
        errors.bsfc = 'BSFC must be greater than zero.';
      } else if (b.value === 0) {
        errors.bsfc = 'BSFC must be greater than zero.';
      }
    } else if (mode !== 'bsfc') {
      // blank handled as incomplete in validateBSFCInputs
    }
  }

  if (mode === 'bsfc') {
    const e = parseNumber(input.efficiency);
    if (!e.blank) {
      if (e.invalid || e.value == null) {
        errors.efficiency = 'Please enter a valid numerical value.';
      } else if (e.value <= 0 || e.value > 100) {
        errors.efficiency =
          'Efficiency must be greater than zero and no more than 100%.';
      }
    }
  }

  if (mode === 'enginePower') {
    const m = parseNumber(input.fuelMassFlow);
    if (!m.blank) {
      if (m.invalid || m.value == null) {
        errors.fuelMassFlow = 'Please enter a valid numerical value.';
      } else if (m.value < 0) {
        errors.fuelMassFlow = 'Fuel consumption cannot be negative.';
      }
    }
  }

  if (input.fuelType === 'custom') {
    const l = parseNumber(input.customLHV);
    if (!l.blank) {
      if (l.invalid || l.value == null) {
        errors.customLHV = 'Please enter a valid numerical value.';
      } else if (!(l.value > 0)) {
        errors.customLHV = 'Fuel heating value must be greater than zero.';
      }
    }
  }

  if (input.enableVolume) {
    const needCustom =
      input.fuelType === 'custom' || input.customDensity.trim() !== '';
    if (input.fuelType === 'custom' || needCustom) {
      const d = parseNumber(input.customDensity);
      if (input.fuelType === 'custom') {
        if (d.blank || d.invalid || d.value == null || !(d.value > 0)) {
          errors.customDensity =
            d.blank
              ? 'Fuel density must be greater than zero.'
              : 'Fuel density must be greater than zero.';
        }
      } else if (!d.blank) {
        if (d.invalid || d.value == null || !(d.value > 0)) {
          errors.customDensity = 'Fuel density must be greater than zero.';
        }
      }
    }
  }

  return errors;
}

export function validateBSFCInputs(input: BSFCInput): BSFCValidation {
  const errors = collectFieldErrors(input);
  const mode = input.mode;

  if (input.fuelType === 'custom') {
    const l = parseNumber(input.customLHV);
    if (l.blank) {
      errors.customLHV = 'Fuel heating value must be greater than zero.';
      return { isValid: false, errors, result: null };
    }
  }

  if (mode === 'efficiency') {
    const b = parseNumber(input.bsfc);
    if (b.blank) return { isValid: false, errors, result: null };
  } else if (mode === 'bsfc') {
    const e = parseNumber(input.efficiency);
    if (e.blank) return { isValid: false, errors, result: null };
  } else if (mode === 'fuelConsumption') {
    const p = parseNumber(input.power);
    const b = parseNumber(input.bsfc);
    if (p.blank || b.blank) return { isValid: false, errors, result: null };
  } else {
    const m = parseNumber(input.fuelMassFlow);
    const b = parseNumber(input.bsfc);
    if (m.blank || b.blank) return { isValid: false, errors, result: null };
  }

  if (hasErrors(errors)) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateBSFCFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with the current inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
