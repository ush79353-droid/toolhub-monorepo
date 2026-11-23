import {
  buildMapResult,
  MAX_PRESSURE_MMHG,
  MIN_PRESSURE_MMHG,
} from './calculation';
import type { MapFieldErrors, MapInput, MapResult } from './types';

export interface MapValidation {
  isValid: boolean;
  errors: MapFieldErrors;
  result: MapResult | null;
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

function pressureError(label: string, value: number): string | undefined {
  if (value < MIN_PRESSURE_MMHG || value > MAX_PRESSURE_MMHG) {
    return `${label} must be between ${MIN_PRESSURE_MMHG} and ${MAX_PRESSURE_MMHG} mmHg.`;
  }
  return undefined;
}

export function validateMapInput(input: MapInput): MapValidation {
  const errors: MapFieldErrors = {};

  const sbp = parseNumber(input.sbpMmHg);
  const dbp = parseNumber(input.dbpMmHg);

  if (sbp.blank && dbp.blank) {
    return { isValid: false, errors, result: null };
  }

  let sbpMmHg: number | null = null;
  let dbpMmHg: number | null = null;

  if (sbp.blank || sbp.invalid || sbp.value === null) {
    errors.sbpMmHg = 'Enter a valid systolic pressure.';
  } else {
    const bound = pressureError('Systolic pressure', sbp.value);
    if (bound) errors.sbpMmHg = bound;
    else sbpMmHg = sbp.value;
  }

  if (dbp.blank || dbp.invalid || dbp.value === null) {
    errors.dbpMmHg = 'Enter a valid diastolic pressure.';
  } else {
    const bound = pressureError('Diastolic pressure', dbp.value);
    if (bound) errors.dbpMmHg = bound;
    else dbpMmHg = dbp.value;
  }

  if (sbpMmHg != null && dbpMmHg != null && sbpMmHg < dbpMmHg) {
    errors.form =
      'Systolic pressure must be greater than or equal to diastolic pressure.';
  }

  if (Object.keys(errors).length > 0 || sbpMmHg == null || dbpMmHg == null) {
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors,
    result: buildMapResult(input, sbpMmHg, dbpMmHg),
  };
}