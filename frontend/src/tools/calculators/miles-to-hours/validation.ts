import { calculateMilesToHoursFromInput } from './calculation';
import type {
  MilesToHoursFieldErrors,
  MilesToHoursInput,
  MilesToHoursResult,
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

export interface MilesToHoursValidation {
  isValid: boolean;
  errors: MilesToHoursFieldErrors;
  result: MilesToHoursResult | null;
}

export function collectFieldErrors(
  input: MilesToHoursInput,
): MilesToHoursFieldErrors {
  const errors: MilesToHoursFieldErrors = {};
  const mode = input.calculationMode;

  if (mode === 'time' || mode === 'speed') {
    const d = parseNumber(input.distance);
    if (!d.blank) {
      if (d.invalid || d.value == null) {
        errors.distance = 'Please enter a valid distance.';
      } else if (d.value < 0) {
        errors.distance = 'Distance cannot be negative.';
      }
    }
  }

  if (mode === 'time' || mode === 'distance') {
    const s = parseNumber(input.speed);
    if (!s.blank) {
      if (s.invalid || s.value == null) {
        errors.speed = 'Please enter a valid speed.';
      } else if (s.value < 0) {
        errors.speed = 'Speed cannot be negative.';
      } else if (
        mode === 'time' &&
        s.value === 0 &&
        !parseNumber(input.distance).blank &&
        (parseNumber(input.distance).value ?? 0) > 0
      ) {
        errors.speed = 'Speed must be greater than zero for a positive distance.';
      }
    }
  }

  if (mode === 'distance' || mode === 'speed') {
    const t = parseNumber(input.time);
    if (!t.blank) {
      if (t.invalid || t.value == null) {
        errors.time = 'Please enter a valid time.';
      } else if (t.value < 0) {
        errors.time = 'Time cannot be negative.';
      } else if (
        mode === 'speed' &&
        t.value === 0 &&
        !parseNumber(input.distance).blank &&
        (parseNumber(input.distance).value ?? 0) > 0
      ) {
        errors.time = 'Time must be greater than zero for a positive distance.';
      }
    }
  }

  if (input.showCompare) {
    const b = parseNumber(input.compareSpeedB);
    if (!b.blank) {
      if (b.invalid || b.value == null || b.value < 0) {
        errors.compareSpeedB = 'Comparison speed cannot be negative.';
      } else if (b.value === 0) {
        errors.compareSpeedB = 'Comparison speed must be greater than zero.';
      }
    }
  }

  if (input.showBreaks) {
    const n = parseNumber(input.numberOfBreaks);
    if (!n.blank) {
      if (n.invalid || n.value == null || n.value < 0) {
        errors.numberOfBreaks = 'Number of breaks cannot be negative.';
      }
    }
    const bd = parseNumber(input.breakDuration);
    if (!bd.blank) {
      if (bd.invalid || bd.value == null || bd.value < 0) {
        errors.breakDuration = 'Break duration cannot be negative.';
      }
    }
  }

  return errors;
}

export function validateMilesToHoursInputs(
  input: MilesToHoursInput,
): MilesToHoursValidation {
  const errors = collectFieldErrors(input);
  const mode = input.calculationMode;

  if (mode === 'time') {
    if (parseNumber(input.distance).blank || parseNumber(input.speed).blank) {
      return { isValid: false, errors, result: null };
    }
  } else if (mode === 'distance') {
    if (parseNumber(input.speed).blank || parseNumber(input.time).blank) {
      return { isValid: false, errors, result: null };
    }
  } else if (
    parseNumber(input.distance).blank ||
    parseNumber(input.time).blank
  ) {
    return { isValid: false, errors, result: null };
  }

  if (input.showCompare && parseNumber(input.compareSpeedB).blank) {
    return { isValid: false, errors, result: null };
  }

  if (input.showBreaks) {
    if (
      parseNumber(input.numberOfBreaks).blank ||
      parseNumber(input.breakDuration).blank
    ) {
      return { isValid: false, errors, result: null };
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateMilesToHoursFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
