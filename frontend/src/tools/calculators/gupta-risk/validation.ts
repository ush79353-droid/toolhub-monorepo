import {
  calculateGuptaRisk,
  creatinineCategoryCoef,
  creatinineToMgDl,
} from './calculation';
import type {
  GuptaRiskFieldErrors,
  GuptaRiskInput,
  GuptaRiskResult,
} from './types';
import { MIN_AGE_YEARS } from './types';

export interface GuptaRiskValidation {
  isValid: boolean;
  errors: GuptaRiskFieldErrors;
  result: GuptaRiskResult | null;
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

/**
 * MICA stays blank until age and a valid creatinine category are present
 * (measured >0 mg/dL equivalent, or explicit “not measured”).
 */
export function validateGuptaRiskInput(input: GuptaRiskInput): GuptaRiskValidation {
  const errors: GuptaRiskFieldErrors = {};
  const ageParsed = parseNumber(input.ageYears);

  if (ageParsed.blank) {
    return { isValid: false, errors, result: null };
  }

  if (ageParsed.invalid || ageParsed.value == null) {
    errors.ageYears = 'Enter a valid age in years.';
    return { isValid: false, errors, result: null };
  }

  const age = ageParsed.value;
  if (age < MIN_AGE_YEARS) {
    errors.ageYears = `Age must be at least ${MIN_AGE_YEARS} years for the NSQIP MICA model.`;
    return { isValid: false, errors, result: null };
  }

  let creatinineMgDl: number | null = null;
  if (input.creatinineNotMeasured) {
    const k = creatinineCategoryCoef(true, null);
    if (k == null) {
      return { isValid: false, errors, result: null };
    }
    return {
      isValid: true,
      errors,
      result: calculateGuptaRisk(input, age, null, k),
    };
  }

  const creatParsed = parseNumber(input.creatinineValue);
  if (creatParsed.blank) {
    return { isValid: false, errors, result: null };
  }

  if (creatParsed.invalid || creatParsed.value == null) {
    errors.creatinineValue = 'Enter a valid creatinine or choose “not measured”.';
    return { isValid: false, errors, result: null };
  }

  creatinineMgDl = creatinineToMgDl(creatParsed.value, input.creatinineUnit);
  if (creatinineMgDl == null) {
    errors.creatinineValue = 'Enter a valid creatinine.';
    return { isValid: false, errors, result: null };
  }

  if (creatinineMgDl <= 0) {
    return { isValid: false, errors, result: null };
  }

  const k = creatinineCategoryCoef(false, creatinineMgDl);
  if (k == null) {
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors,
    result: calculateGuptaRisk(input, age, creatinineMgDl, k),
  };
}