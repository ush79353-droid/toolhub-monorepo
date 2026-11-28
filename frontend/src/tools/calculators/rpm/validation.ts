import { calculateRpmFromInput } from './calculation';
import type { RpmFieldErrors, RpmInput, RpmResult } from './types';

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

export interface RpmValidation {
  isValid: boolean;
  errors: RpmFieldErrors;
  result: RpmResult | null;
}

export function collectFieldErrors(input: RpmInput): RpmFieldErrors {
  const errors: RpmFieldErrors = {};

  const eng = parseNumber(input.engineRPM);
  if (!eng.blank) {
    if (eng.invalid || eng.value == null) {
      errors.engineRPM = 'Enter a nonnegative engine RPM.';
    } else if (eng.value < 0) {
      errors.engineRPM = 'Enter a nonnegative engine RPM.';
    }
  }

  let ratioSource = input.drivetrainRatio;
  if (input.showGearSplit) {
    const g = parseNumber(input.gearboxRatio);
    const f = parseNumber(input.finalDriveRatio);
    if (!g.blank) {
      if (g.invalid || g.value == null || g.value <= 0) {
        errors.gearboxRatio = 'Gearbox ratio must be greater than zero.';
      }
    }
    if (!f.blank) {
      if (f.invalid || f.value == null || f.value <= 0) {
        errors.finalDriveRatio = 'Final-drive ratio must be greater than zero.';
      }
    }
    if (
      g.value != null &&
      f.value != null &&
      g.value > 0 &&
      f.value > 0 &&
      !errors.gearboxRatio &&
      !errors.finalDriveRatio
    ) {
      ratioSource = String(g.value * f.value);
    }
  }

  const ratio = parseNumber(ratioSource);
  if (!ratio.blank) {
    if (ratio.invalid || ratio.value == null) {
      errors.drivetrainRatio = 'Transmission ratio must be greater than zero.';
    } else if (ratio.value <= 0) {
      errors.drivetrainRatio = 'Transmission ratio must be greater than zero.';
    }
  }

  const wheel = parseNumber(input.wheelRPM);
  if (!wheel.blank) {
    if (wheel.invalid || wheel.value == null || wheel.value < 0) {
      errors.wheelRPM = 'Enter a nonnegative wheel RPM.';
    }
  }

  const td = parseNumber(input.tireDiameter);
  if (!td.blank) {
    if (td.invalid || td.value == null || td.value <= 0) {
      errors.tireDiameter = 'Enter a valid tire diameter greater than zero.';
    }
  }

  const spd = parseNumber(input.vehicleSpeed);
  if (!spd.blank) {
    if (spd.invalid || spd.value == null || spd.value < 0) {
      errors.vehicleSpeed = 'Enter a nonnegative vehicle speed.';
    }
  }

  return errors;
}

export function validateRpmInputs(input: RpmInput): RpmValidation {
  const errors = collectFieldErrors(input);
  const hasFieldErrors = Object.keys(errors).length > 0;

  const eng = parseNumber(input.engineRPM);
  const wheel = parseNumber(input.wheelRPM);
  const td = parseNumber(input.tireDiameter);
  const spd = parseNumber(input.vehicleSpeed);

  let drivetrainRatio: number | null = null;
  if (input.showGearSplit) {
    const g = parseNumber(input.gearboxRatio);
    const f = parseNumber(input.finalDriveRatio);
    if (
      g.value != null &&
      f.value != null &&
      g.value > 0 &&
      f.value > 0 &&
      !errors.gearboxRatio &&
      !errors.finalDriveRatio
    ) {
      drivetrainRatio = g.value * f.value;
    }
  }
  if (drivetrainRatio == null) {
    const ratio = parseNumber(input.drivetrainRatio);
    if (!ratio.blank && !errors.drivetrainRatio && ratio.value != null) {
      drivetrainRatio = ratio.value;
    }
  }

  if (hasFieldErrors) {
    return { isValid: false, errors, result: null };
  }

  const parsed = {
    engineRPM:
      !eng.blank && eng.value != null && eng.value >= 0 ? eng.value : null,
    drivetrainRatio,
    wheelRPM:
      !wheel.blank && wheel.value != null && wheel.value >= 0
        ? wheel.value
        : null,
    tireDiameter:
      !td.blank && td.value != null && td.value > 0 ? td.value : null,
    vehicleSpeed:
      !spd.blank && spd.value != null && spd.value >= 0 ? spd.value : null,
  };

  const any =
    parsed.engineRPM != null ||
    parsed.drivetrainRatio != null ||
    parsed.wheelRPM != null ||
    parsed.tireDiameter != null ||
    parsed.vehicleSpeed != null;

  if (!any) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateRpmFromInput(input, parsed);
  if (result.inconsistent) {
    errors.form =
      'The entered values are inconsistent with the calculator formulas.';
  }

  return {
    isValid: !result.inconsistent && !result.insufficient,
    errors,
    result,
  };
}
