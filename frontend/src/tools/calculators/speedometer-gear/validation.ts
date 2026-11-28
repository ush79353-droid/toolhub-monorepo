import { calculateSpeedometerGearFromInput } from './calculation';
import type {
  SpeedometerGearFieldErrors,
  SpeedometerGearInput,
  SpeedometerGearResult,
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

export interface SpeedometerGearValidation {
  isValid: boolean;
  errors: SpeedometerGearFieldErrors;
  result: SpeedometerGearResult | null;
}

export function collectFieldErrors(
  input: SpeedometerGearInput,
): SpeedometerGearFieldErrors {
  const errors: SpeedometerGearFieldErrors = {};

  if (!input.useManualRevolutions) {
    const td = parseNumber(input.tireDiameter);
    if (!td.blank) {
      if (td.invalid || td.value == null || td.value <= 0) {
        errors.tireDiameter =
          'Enter a valid tire diameter greater than zero.';
      }
    }
  } else {
    const rev = parseNumber(input.tireRevolutions);
    if (!rev.blank) {
      if (rev.invalid || rev.value == null || rev.value <= 0) {
        errors.tireRevolutions = 'Enter a valid tire revolutions value.';
      }
    }
  }

  const ar = parseNumber(input.axleRatio);
  if (!ar.blank) {
    if (ar.invalid || ar.value == null || ar.value <= 0) {
      errors.axleRatio = 'Axle ratio must be greater than zero.';
    }
  }

  const teeth = parseNumber(input.drivingGearTeeth);
  if (!teeth.blank) {
    if (teeth.invalid || teeth.value == null) {
      errors.drivingGearTeeth =
        'Driving gear teeth must be a positive whole number.';
    } else if (teeth.value <= 0) {
      errors.drivingGearTeeth =
        'Driving gear teeth must be a positive whole number.';
    } else if (!Number.isInteger(teeth.value)) {
      errors.drivingGearTeeth =
        'Driving gear teeth must be a positive whole number.';
    }
  }

  const cal = parseNumber(input.calibrationRevolutionsPerMile);
  if (!cal.blank) {
    if (cal.invalid || cal.value == null || cal.value <= 0) {
      errors.calibrationRevolutionsPerMile =
        'Speedometer calibration must be greater than zero.';
    }
  }

  return errors;
}

export function validateSpeedometerGearInputs(
  input: SpeedometerGearInput,
): SpeedometerGearValidation {
  const errors = collectFieldErrors(input);
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const td = parseNumber(input.tireDiameter);
  const ar = parseNumber(input.axleRatio);
  const rev = parseNumber(input.tireRevolutions);
  const teeth = parseNumber(input.drivingGearTeeth);
  const cal = parseNumber(input.calibrationRevolutionsPerMile);

  const calibration =
    !cal.blank && cal.value != null && cal.value > 0 ? cal.value : 1000;

  const axleOk = !ar.blank && ar.value != null && ar.value > 0;
  const teethOk =
    !teeth.blank &&
    teeth.value != null &&
    teeth.value > 0 &&
    Number.isInteger(teeth.value);

  let revSourceOk = false;
  if (input.useManualRevolutions) {
    revSourceOk = !rev.blank && rev.value != null && rev.value > 0;
  } else {
    revSourceOk = !td.blank && td.value != null && td.value > 0;
  }

  if (!axleOk || !teethOk || !revSourceOk) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateSpeedometerGearFromInput(input, {
    tireDiameter: td.value,
    axleRatio: ar.value!,
    tireRevolutions: rev.value,
    drivingGearTeeth: teeth.value!,
    calibration,
  });

  return { isValid: true, errors, result };
}
