import { calculateFuelInjectorFromInput } from './calculation';
import type {
  FuelInjectorFieldErrors,
  FuelInjectorInput,
  FuelInjectorResult,
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

export interface FuelInjectorValidation {
  isValid: boolean;
  errors: FuelInjectorFieldErrors;
  result: FuelInjectorResult | null;
}

export function collectFieldErrors(
  input: FuelInjectorInput,
): FuelInjectorFieldErrors {
  const errors: FuelInjectorFieldErrors = {};

  const eng = parseNumber(input.engineHorsepower);
  const tgt = parseNumber(input.targetHorsepower);

  if (!eng.blank) {
    if (eng.invalid || eng.value == null) {
      errors.engineHorsepower = 'Please enter a valid engine horsepower.';
    } else if (eng.value <= 0) {
      errors.engineHorsepower = 'Horsepower must be greater than zero.';
    }
  }

  if (!tgt.blank) {
    if (tgt.invalid || tgt.value == null) {
      errors.targetHorsepower = 'Please enter a valid engine horsepower.';
    } else if (tgt.value <= 0) {
      errors.targetHorsepower = 'Horsepower must be greater than zero.';
    }
  }

  if (eng.blank && tgt.blank) {
    errors.engineHorsepower = 'Please enter a valid engine horsepower.';
  }

  const cyl = parseNumber(input.numberOfCylinders);
  if (!cyl.blank) {
    if (
      cyl.invalid ||
      cyl.value == null ||
      cyl.value <= 0 ||
      !Number.isInteger(cyl.value)
    ) {
      errors.numberOfCylinders = 'Please enter a valid number of cylinders.';
    }
  }

  const inj = parseNumber(input.numberOfInjectors);
  if (!inj.blank) {
    if (
      inj.invalid ||
      inj.value == null ||
      inj.value <= 0 ||
      !Number.isInteger(inj.value)
    ) {
      errors.numberOfInjectors =
        'Number of injectors must be a positive integer.';
    }
  }

  const bsfc = parseNumber(input.bsfc);
  if (!bsfc.blank) {
    if (bsfc.invalid || bsfc.value == null || !(bsfc.value > 0)) {
      errors.bsfc = 'Please enter a valid BSFC.';
    }
  }

  const duty = parseNumber(input.maxDutyCycle);
  if (!duty.blank) {
    if (duty.invalid || duty.value == null) {
      errors.maxDutyCycle =
        'Maximum duty cycle must be between 0% and 100%, excluding 0%.';
    } else if (!(duty.value > 0) || duty.value > 100) {
      errors.maxDutyCycle =
        'Maximum duty cycle must be between 0% and 100%, excluding 0%.';
    }
  }

  const dens = parseNumber(input.fuelDensity);
  if (!dens.blank) {
    if (dens.invalid || dens.value == null || !(dens.value > 0)) {
      errors.fuelDensity = 'Please enter a valid fuel density.';
    }
  }

  for (const [key, label] of [
    ['fuelPressure', 'Please enter a valid fuel pressure.'],
    [
      'referenceDifferentialPressure',
      'Actual differential pressure must be greater than zero.',
    ],
    [
      'actualDifferentialPressure',
      'Actual differential pressure must be greater than zero.',
    ],
  ] as const) {
    const p = parseNumber(input[key]);
    if (!p.blank) {
      if (p.invalid || p.value == null || !(p.value > 0)) {
        errors[key] = label;
      }
    }
  }

  const exist = parseNumber(input.existingInjectorFlow);
  if (!exist.blank) {
    if (exist.invalid || exist.value == null || !(exist.value > 0)) {
      errors.existingInjectorFlow =
        'Please enter a valid existing injector flow rate.';
    }
  }

  return errors;
}

export function validateFuelInjectorInputs(
  input: FuelInjectorInput,
): FuelInjectorValidation {
  const errors = collectFieldErrors(input);

  const engBlank = parseNumber(input.engineHorsepower).blank;
  const tgtBlank = parseNumber(input.targetHorsepower).blank;
  if (
    (engBlank && tgtBlank) ||
    parseNumber(input.numberOfInjectors).blank ||
    parseNumber(input.bsfc).blank ||
    parseNumber(input.maxDutyCycle).blank ||
    parseNumber(input.fuelDensity).blank
  ) {
    return { isValid: false, errors, result: null };
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateFuelInjectorFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
