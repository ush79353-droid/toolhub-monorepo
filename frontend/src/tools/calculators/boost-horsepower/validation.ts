import { calculateBoostHorsepowerFromInput, toMechanicalHp } from './calculation';
import type {
  BoostHorsepowerFieldErrors,
  BoostHorsepowerInput,
  BoostHorsepowerResult,
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

export interface BoostHorsepowerValidation {
  isValid: boolean;
  errors: BoostHorsepowerFieldErrors;
  result: BoostHorsepowerResult | null;
}

function hasErrors(errors: BoostHorsepowerFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function collectFieldErrors(
  input: BoostHorsepowerInput,
): BoostHorsepowerFieldErrors {
  const errors: BoostHorsepowerFieldErrors = {};
  const mode = input.mode;

  if (mode !== 'originalHorsepower') {
    const n = parseNumber(input.originalHorsepower);
    if (!n.blank) {
      if (n.invalid || n.value == null) {
        errors.originalHorsepower = 'Enter a valid current engine horsepower.';
      } else if (n.value < 0) {
        errors.originalHorsepower = 'Enter a valid current engine horsepower.';
      } else if (mode === 'requiredBoost' && n.value <= 0) {
        errors.originalHorsepower = 'Horsepower must be greater than zero.';
      }
    }
  }

  if (mode !== 'requiredBoost') {
    const p = parseNumber(input.boostPressure);
    if (!p.blank) {
      if (p.invalid || p.value == null) {
        errors.boostPressure = 'Please enter a valid numerical value.';
      } else if (p.value < 0) {
        errors.boostPressure =
          'Boost pressure cannot be negative in this calculation mode.';
      }
    }
  }

  if (mode !== 'boostedHorsepower') {
    const t = parseNumber(input.targetHorsepower);
    if (!t.blank) {
      if (t.invalid || t.value == null) {
        errors.targetHorsepower = 'Please enter a valid numerical value.';
      } else if (t.value < 0) {
        errors.targetHorsepower = 'Please enter a valid numerical value.';
      }
    }
  }

  if (mode === 'requiredBoost') {
    const n = parseNumber(input.originalHorsepower);
    const t = parseNumber(input.targetHorsepower);
    if (
      !n.blank &&
      !t.blank &&
      n.value != null &&
      t.value != null &&
      !n.invalid &&
      !t.invalid &&
      n.value > 0
    ) {
      const origHp = toMechanicalHp(n.value, input.horsepowerUnit);
      const tgtHp = toMechanicalHp(t.value, input.targetHorsepowerUnit);
      if (tgtHp < origHp) {
        errors.targetHorsepower =
          'Target horsepower must be at least the original horsepower for nonnegative boost.';
      }
    }
  }

  const atm = parseNumber(input.atmosphericPressure);
  if (!atm.blank) {
    if (atm.invalid || atm.value == null) {
      errors.atmosphericPressure = 'Please enter a valid numerical value.';
    } else if (atm.value <= 0) {
      errors.atmosphericPressure = 'Atmospheric pressure must be greater than zero.';
    }
  }

  if (input.enableAdvanced) {
    const e = parseNumber(input.efficiencyFactor);
    if (!e.blank) {
      if (e.invalid || e.value == null) {
        errors.efficiencyFactor = 'Please enter a valid numerical value.';
      } else if (e.value < 0 || e.value > 1) {
        errors.efficiencyFactor =
          'Efficiency factor must be between 0 and 1.';
      }
    }
  }

  return errors;
}

export function validateBoostInputs(
  input: BoostHorsepowerInput,
): BoostHorsepowerValidation {
  const errors = collectFieldErrors(input);
  const mode = input.mode;

  const needOrig = mode !== 'originalHorsepower';
  const needBoost = mode !== 'requiredBoost';
  const needTarget = mode !== 'boostedHorsepower';

  const n = parseNumber(input.originalHorsepower);
  const p = parseNumber(input.boostPressure);
  const t = parseNumber(input.targetHorsepower);
  const atm = parseNumber(input.atmosphericPressure);

  if (needOrig && n.blank) return { isValid: false, errors, result: null };
  if (needBoost && p.blank) return { isValid: false, errors, result: null };
  if (needTarget && t.blank) return { isValid: false, errors, result: null };
  if (atm.blank || atm.value == null || atm.value <= 0) {
    if (!atm.blank && (atm.invalid || (atm.value != null && atm.value <= 0))) {
      // already in errors
    } else if (atm.blank) {
      errors.atmosphericPressure =
        'Atmospheric pressure must be greater than zero.';
    }
    return { isValid: false, errors, result: null };
  }

  if (hasErrors(errors)) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateBoostHorsepowerFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with the current inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
