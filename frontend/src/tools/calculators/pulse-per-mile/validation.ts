import { calculatePulsePerMileFromInput } from './calculation';
import type {
  PulsePerMileFieldErrors,
  PulsePerMileInput,
  PulsePerMileResult,
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

export interface PulsePerMileValidation {
  isValid: boolean;
  errors: PulsePerMileFieldErrors;
  result: PulsePerMileResult | null;
}

export function collectFieldErrors(
  input: PulsePerMileInput,
): PulsePerMileFieldErrors {
  const errors: PulsePerMileFieldErrors = {};

  const ar = parseNumber(input.axleRatio);
  if (ar.blank) {
    // empty is ok until submit-style; no result
  } else if (ar.invalid || ar.value == null) {
    errors.axleRatio = 'Please enter a valid axle ratio.';
  } else if (ar.value <= 0) {
    errors.axleRatio = 'Axle ratio must be greater than zero.';
  }

  const teeth = parseNumber(input.reluctorTeeth);
  if (teeth.blank) {
    // empty ok
  } else if (teeth.invalid || teeth.value == null) {
    errors.reluctorTeeth = 'Please enter a valid tooth count.';
  } else if (teeth.value <= 0) {
    errors.reluctorTeeth = 'Reluctor teeth must be greater than zero.';
  } else if (!Number.isInteger(teeth.value)) {
    errors.reluctorTeeth = 'Reluctor teeth must be a whole number.';
  }

  const td = parseNumber(input.tireDiameter);
  if (td.blank) {
    // empty ok
  } else if (td.invalid || td.value == null) {
    errors.tireDiameter = 'Please enter a valid tire diameter.';
  } else if (td.value <= 0) {
    errors.tireDiameter = 'Tire diameter must be greater than zero.';
  }

  if (input.showSensorFrequency) {
    const spd = parseNumber(input.vehicleSpeed);
    if (spd.blank) {
      // optional until filled
    } else if (spd.invalid || spd.value == null) {
      errors.vehicleSpeed = 'Please enter a valid vehicle speed.';
    } else if (spd.value < 0) {
      errors.vehicleSpeed = 'Vehicle speed cannot be negative.';
    } else if (spd.value === 0) {
      errors.vehicleSpeed = 'Vehicle speed must be greater than zero.';
    }
  }

  return errors;
}

export function validatePulsePerMileInputs(
  input: PulsePerMileInput,
): PulsePerMileValidation {
  const errors = collectFieldErrors(input);
  const hasFieldErrors = Object.keys(errors).length > 0;

  const ar = parseNumber(input.axleRatio);
  const teeth = parseNumber(input.reluctorTeeth);
  const td = parseNumber(input.tireDiameter);
  const spd = parseNumber(input.vehicleSpeed);

  const coreReady =
    !ar.blank &&
    !teeth.blank &&
    !td.blank &&
    ar.value != null &&
    teeth.value != null &&
    td.value != null &&
    !hasFieldErrors;

  if (!coreReady) {
    return { isValid: false, errors, result: null };
  }

  const vehicleSpeed =
    input.showSensorFrequency &&
    !spd.blank &&
    spd.value != null &&
    !errors.vehicleSpeed
      ? spd.value
      : null;

  const result = calculatePulsePerMileFromInput(input, {
    axleRatio: ar.value!,
    reluctorTeeth: teeth.value!,
    tireDiameter: td.value!,
    vehicleSpeed,
  });

  return { isValid: true, errors, result };
}
