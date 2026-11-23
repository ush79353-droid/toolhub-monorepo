import {
  calculateFraminghamRisk,
  cholesterolToMgDl,
  MAX_AGE,
  MIN_AGE,
} from './calculation';
import type {
  FraminghamRiskFieldErrors,
  FraminghamRiskInput,
  FraminghamRiskResult,
} from './types';

export interface FraminghamRiskValidation {
  isValid: boolean;
  errors: FraminghamRiskFieldErrors;
  result: FraminghamRiskResult | null;
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

function parseAge(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const parsed = parseNumber(raw);
  if (parsed.blank || parsed.invalid || parsed.value == null) return parsed;
  if (!Number.isInteger(parsed.value)) {
    return { value: null, blank: false, invalid: true };
  }
  return parsed;
}

/**
 * Score inactive until age, SBP, total cholesterol, and HDL are all valid
 * entries within supported ranges.
 */
export function validateFraminghamRiskInput(
  input: FraminghamRiskInput
): FraminghamRiskValidation {
  const errors: FraminghamRiskFieldErrors = {};

  const ageParsed = parseAge(input.ageYears);
  const sbpParsed = parseNumber(input.sbpMmHg);
  const tcParsed = parseNumber(input.totalCholesterolValue);
  const hdlParsed = parseNumber(input.hdlCholesterolValue);

  if (
    ageParsed.blank ||
    sbpParsed.blank ||
    tcParsed.blank ||
    hdlParsed.blank
  ) {
    return { isValid: false, errors, result: null };
  }

  if (ageParsed.invalid || ageParsed.value == null) {
    errors.ageYears = 'Enter a valid whole-number age in years.';
    return { isValid: false, errors, result: null };
  }
  if (ageParsed.value < MIN_AGE || ageParsed.value > MAX_AGE) {
    errors.ageYears = `Age must be between ${MIN_AGE} and ${MAX_AGE} years for ATP III points.`;
    return { isValid: false, errors, result: null };
  }

  if (sbpParsed.invalid || sbpParsed.value == null || sbpParsed.value <= 0) {
    errors.sbpMmHg = 'Enter a valid systolic blood pressure (mmHg).';
    return { isValid: false, errors, result: null };
  }

  if (tcParsed.invalid || tcParsed.value == null || tcParsed.value < 0) {
    errors.totalCholesterolValue = 'Enter a valid total cholesterol.';
    return { isValid: false, errors, result: null };
  }

  if (hdlParsed.invalid || hdlParsed.value == null || hdlParsed.value < 0) {
    errors.hdlCholesterolValue = 'Enter a valid HDL cholesterol.';
    return { isValid: false, errors, result: null };
  }

  const tcMgDl = cholesterolToMgDl(
    tcParsed.value,
    input.totalCholesterolUnit
  );
  const hdlMgDl = cholesterolToMgDl(
    hdlParsed.value,
    input.hdlCholesterolUnit
  );

  if (tcMgDl == null) {
    errors.totalCholesterolValue = 'Total cholesterol cannot be scored.';
    return { isValid: false, errors, result: null };
  }

  if (hdlMgDl == null) {
    errors.hdlCholesterolValue = 'HDL cholesterol cannot be scored.';
    return { isValid: false, errors, result: null };
  }

  const result = calculateFraminghamRisk(
    input,
    ageParsed.value,
    sbpParsed.value,
    tcMgDl,
    hdlMgDl
  );

  if (!result) {
    errors.form = 'Unable to score these values.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}