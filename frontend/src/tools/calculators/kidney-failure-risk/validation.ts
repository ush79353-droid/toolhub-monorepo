import {
  albuminToGDl,
  bicarbonateToMeqL,
  calculateKidneyFailureRisk,
  calciumToMgDl,
  MAX_AGE,
  MAX_EGFR_INCLUSIVE,
  MIN_AGE,
  MIN_EGFR,
  phosphorusToMgDl,
} from './calculation';
import type {
  KidneyFailureRiskFieldErrors,
  KidneyFailureRiskInput,
  KidneyFailureRiskResult,
} from './types';

export interface KidneyFailureRiskValidation {
  isValid: boolean;
  errors: KidneyFailureRiskFieldErrors;
  result: KidneyFailureRiskResult | null;
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
 * Score stays blank until age, eGFR, albumin, bicarbonate, calcium, and
 * phosphorus are all valid. Sex and ACR band use screenshot defaults.
 * eGFR ≥60 is outside Tangri CKD G3–G5 derivation — withhold points.
 */
export function validateKidneyFailureRiskInput(
  input: KidneyFailureRiskInput
): KidneyFailureRiskValidation {
  const errors: KidneyFailureRiskFieldErrors = {};

  const ageParsed = parseAge(input.ageYears);
  const egfrParsed = parseNumber(input.egfr);
  const albParsed = parseNumber(input.albuminValue);
  const bicParsed = parseNumber(input.bicarbonateValue);
  const caParsed = parseNumber(input.calciumValue);
  const phosParsed = parseNumber(input.phosphorusValue);

  if (
    ageParsed.blank ||
    egfrParsed.blank ||
    albParsed.blank ||
    bicParsed.blank ||
    caParsed.blank ||
    phosParsed.blank
  ) {
    return { isValid: false, errors, result: null };
  }

  if (ageParsed.invalid || ageParsed.value == null) {
    errors.ageYears = 'Enter a valid whole-number age in years.';
    return { isValid: false, errors, result: null };
  }
  if (ageParsed.value < MIN_AGE || ageParsed.value > MAX_AGE) {
    errors.ageYears = `Age must be between ${MIN_AGE} and ${MAX_AGE} years.`;
    return { isValid: false, errors, result: null };
  }

  if (egfrParsed.invalid || egfrParsed.value == null) {
    errors.egfr = 'Enter a valid indexed eGFR.';
    return { isValid: false, errors, result: null };
  }
  if (egfrParsed.value < MIN_EGFR || egfrParsed.value > MAX_EGFR_INCLUSIVE) {
    errors.egfr = `eGFR must be ${MIN_EGFR}–${MAX_EGFR_INCLUSIVE} mL/min/1.73 m² (CKD G3–G5 derivation; ≥60 not scored).`;
    return { isValid: false, errors, result: null };
  }

  if (albParsed.invalid || albParsed.value == null || albParsed.value < 0) {
    errors.albuminValue = 'Enter a valid serum albumin.';
    return { isValid: false, errors, result: null };
  }
  if (bicParsed.invalid || bicParsed.value == null) {
    errors.bicarbonateValue = 'Enter a valid serum bicarbonate.';
    return { isValid: false, errors, result: null };
  }
  if (caParsed.invalid || caParsed.value == null || caParsed.value < 0) {
    errors.calciumValue = 'Enter a valid serum calcium.';
    return { isValid: false, errors, result: null };
  }
  if (phosParsed.invalid || phosParsed.value == null || phosParsed.value < 0) {
    errors.phosphorusValue = 'Enter a valid serum phosphorus.';
    return { isValid: false, errors, result: null };
  }

  const albuminGDl = albuminToGDl(albParsed.value, input.albuminUnit);
  const bicarbMeqL = bicarbonateToMeqL(
    bicParsed.value,
    input.bicarbonateUnit
  );
  const calciumMgDl = calciumToMgDl(caParsed.value, input.calciumUnit);
  const phosphorusMgDl = phosphorusToMgDl(
    phosParsed.value,
    input.phosphorusUnit
  );

  if (albuminGDl == null) {
    errors.albuminValue = 'Serum albumin cannot be scored.';
    return { isValid: false, errors, result: null };
  }
  if (bicarbMeqL == null) {
    errors.bicarbonateValue = 'Serum bicarbonate cannot be scored.';
    return { isValid: false, errors, result: null };
  }
  if (calciumMgDl == null) {
    errors.calciumValue = 'Serum calcium cannot be scored.';
    return { isValid: false, errors, result: null };
  }
  if (phosphorusMgDl == null) {
    errors.phosphorusValue = 'Serum phosphorus cannot be scored.';
    return { isValid: false, errors, result: null };
  }

  const result = calculateKidneyFailureRisk(
    input,
    ageParsed.value,
    egfrParsed.value,
    albuminGDl,
    bicarbMeqL,
    calciumMgDl,
    phosphorusMgDl
  );

  if (!result) {
    errors.form = 'Unable to score these values with the Tangri points table.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
