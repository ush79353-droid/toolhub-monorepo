import { calculateBoatSpeedFromInput } from './calculation';
import type {
  BoatSpeedFieldErrors,
  BoatSpeedInput,
  BoatSpeedResult,
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

export interface BoatSpeedValidation {
  isValid: boolean;
  errors: BoatSpeedFieldErrors;
  result: BoatSpeedResult | null;
}

function hasErrors(errors: BoatSpeedFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function collectFieldErrors(input: BoatSpeedInput): BoatSpeedFieldErrors {
  const errors: BoatSpeedFieldErrors = {};
  const mode = input.mode;

  if (mode !== 'horsepower') {
    const hp = parseNumber(input.horsepower);
    if (!hp.blank) {
      if (hp.invalid || hp.value == null) {
        errors.horsepower = 'Please enter a valid shaft horsepower value.';
      } else if (hp.value < 0) {
        errors.horsepower = 'Please enter a valid shaft horsepower value.';
      } else if (
        (mode === 'displacement' || mode === 'crouchConstant') &&
        hp.value <= 0
      ) {
        errors.horsepower = 'Please enter a valid shaft horsepower value.';
      }
    }
  }

  if (mode !== 'displacement') {
    const d = parseNumber(input.displacement);
    if (!d.blank) {
      if (d.invalid || d.value == null) {
        errors.displacement = 'Boat displacement must be greater than zero.';
      } else if (d.value <= 0) {
        errors.displacement = 'Boat displacement must be greater than zero.';
      }
    }
  }

  if (mode !== 'crouchConstant') {
    const c = parseNumber(input.crouchConstant);
    if (!c.blank) {
      if (c.invalid || c.value == null) {
        errors.crouchConstant = "Crouch's constant must be greater than zero.";
      } else if (c.value <= 0) {
        errors.crouchConstant = "Crouch's constant must be greater than zero.";
      }
    }
  }

  if (mode !== 'speed') {
    const s = parseNumber(input.speed);
    if (!s.blank) {
      if (s.invalid || s.value == null) {
        errors.speed = 'Please enter a valid target speed.';
      } else if (s.value < 0) {
        errors.speed = 'Please enter a valid target speed.';
      } else if (
        (mode === 'horsepower' || mode === 'displacement') &&
        s.value <= 0
      ) {
        errors.speed = 'Please enter a valid target speed.';
      }
    }
  }

  if (!input.boatType) {
    errors.boatType = 'Please select a boat type.';
  }

  return errors;
}

export function validateBoatSpeedInputs(
  input: BoatSpeedInput,
): BoatSpeedValidation {
  const errors = collectFieldErrors(input);
  const mode = input.mode;

  const needHp = mode !== 'horsepower';
  const needD = mode !== 'displacement';
  const needC = mode !== 'crouchConstant';
  const needS = mode !== 'speed';

  const hp = parseNumber(input.horsepower);
  const d = parseNumber(input.displacement);
  const c = parseNumber(input.crouchConstant);
  const s = parseNumber(input.speed);

  if (needHp && hp.blank) {
    return { isValid: false, errors, result: null };
  }
  if (needD && d.blank) {
    return { isValid: false, errors, result: null };
  }
  if (needC && c.blank) {
    return { isValid: false, errors, result: null };
  }
  if (needS && s.blank) {
    return { isValid: false, errors, result: null };
  }

  if (hasErrors(errors)) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateBoatSpeedFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with the current inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
