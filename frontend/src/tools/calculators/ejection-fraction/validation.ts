import { calculateEjectionFraction } from './calculation';
import type {
  EjectionFractionFieldErrors,
  EjectionFractionInput,
  EjectionFractionResult,
} from './types';

export interface EjectionFractionValidation {
  isValid: boolean;
  errors: EjectionFractionFieldErrors;
  result: EjectionFractionResult | null;
}

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

export function validateEjectionFractionInput(
  input: EjectionFractionInput
): EjectionFractionValidation {
  const errors: EjectionFractionFieldErrors = {};
  const edv = parseNumber(input.edvMl);

  if (edv.blank) {
    return { isValid: false, errors, result: null };
  }
  if (edv.invalid || edv.value == null || edv.value <= 0) {
    errors.edvMl = 'Enter a positive end-diastolic volume.';
    return { isValid: false, errors, result: null };
  }

  const parsed: {
    edvMl: number;
    strokeVolumeMl?: number;
    esvMl?: number;
    cardiacOutputLMin?: number;
    heartRateBpm?: number;
  } = { edvMl: edv.value };

  if (input.mode === 'sv') {
    const sv = parseNumber(input.strokeVolumeMl);
    if (sv.blank) return { isValid: false, errors, result: null };
    if (sv.invalid || sv.value == null || sv.value < 0) {
      errors.strokeVolumeMl = 'Enter a valid non-negative stroke volume.';
      return { isValid: false, errors, result: null };
    }
    if (sv.value > edv.value) {
      errors.strokeVolumeMl = 'Stroke volume cannot exceed EDV.';
      return { isValid: false, errors, result: null };
    }
    parsed.strokeVolumeMl = sv.value;
  } else if (input.mode === 'esv') {
    const esv = parseNumber(input.esvMl);
    if (esv.blank) return { isValid: false, errors, result: null };
    if (esv.invalid || esv.value == null || esv.value < 0) {
      errors.esvMl = 'Enter a valid non-negative end-systolic volume.';
      return { isValid: false, errors, result: null };
    }
    if (esv.value > edv.value) {
      errors.esvMl = 'ESV cannot exceed EDV.';
      return { isValid: false, errors, result: null };
    }
    parsed.esvMl = esv.value;
  } else {
    const co = parseNumber(input.cardiacOutputLMin);
    const hr = parseNumber(input.heartRateBpm);
    if (co.blank || hr.blank) return { isValid: false, errors, result: null };
    if (co.invalid || co.value == null || co.value <= 0) {
      errors.cardiacOutputLMin = 'Enter a positive cardiac output.';
      return { isValid: false, errors, result: null };
    }
    if (hr.invalid || hr.value == null || hr.value <= 0) {
      errors.heartRateBpm = 'Enter a positive heart rate.';
      return { isValid: false, errors, result: null };
    }
    parsed.cardiacOutputLMin = co.value;
    parsed.heartRateBpm = hr.value;
    const sv = (1000 * co.value) / hr.value;
    if (sv > edv.value) {
      errors.form =
        'Derived stroke volume exceeds EDV — check cardiac output and heart rate.';
      return { isValid: false, errors, result: null };
    }
  }

  const result = calculateEjectionFraction(input, parsed);
  if (!result) {
    errors.form = 'Unable to compute ejection fraction from the entered values.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
