import {
  calculateGraceScore,
  creatinineToMgDl,
  parseNumericField,
} from './calculation';
import type {
  GraceFieldErrors,
  GraceInput,
  GraceResult,
} from './types';

export interface GraceValidation {
  isValid: boolean;
  errors: GraceFieldErrors;
  result: GraceResult | null;
}

const MIN_AGE = 0;
const MAX_AGE = 120;
const MAX_HR = 300;
const MAX_SBP = 300;

function yesNoToBool(v: GraceInput['cardiacArrestAtAdmission']): boolean | null {
  if (v === 'yes') return true;
  if (v === 'no') return false;
  return null;
}

/**
 * Score stays blank until every field is set, including explicit yes/no for
 * clinical binaries (unset is not negative).
 */
export function validateGraceInput(input: GraceInput): GraceValidation {
  const errors: GraceFieldErrors = {};

  const age = parseNumericField(input.ageYears);
  if (age == null) {
    if (input.ageYears.trim() !== '') {
      errors.ageYears = 'Enter age as a non-negative number of years.';
    }
    return { isValid: false, errors, result: null };
  }
  if (age < MIN_AGE || age > MAX_AGE) {
    errors.ageYears = `Age should be between ${MIN_AGE} and ${MAX_AGE} years.`;
    return { isValid: false, errors, result: null };
  }

  const hr = parseNumericField(input.heartRateBpm);
  if (hr == null) {
    if (input.heartRateBpm.trim() !== '') {
      errors.heartRateBpm = 'Enter heart rate as a non-negative number.';
    }
    return { isValid: false, errors, result: null };
  }
  if (hr < 0 || hr > MAX_HR) {
    errors.heartRateBpm = `Heart rate should be between 0 and ${MAX_HR} bpm.`;
    return { isValid: false, errors, result: null };
  }

  const sbp = parseNumericField(input.systolicBpMmHg);
  if (sbp == null) {
    if (input.systolicBpMmHg.trim() !== '') {
      errors.systolicBpMmHg = 'Enter systolic BP as a non-negative number.';
    }
    return { isValid: false, errors, result: null };
  }
  if (sbp < 0 || sbp > MAX_SBP) {
    errors.systolicBpMmHg = `Systolic BP should be between 0 and ${MAX_SBP} mmHg.`;
    return { isValid: false, errors, result: null };
  }

  const crRaw = parseNumericField(input.creatinineValue);
  if (crRaw == null) {
    if (input.creatinineValue.trim() !== '') {
      errors.creatinineValue = 'Enter creatinine as a non-negative number.';
    }
    return { isValid: false, errors, result: null };
  }
  const crMgDl = creatinineToMgDl(crRaw, input.creatinineUnit);
  if (crMgDl == null) {
    errors.creatinineValue = 'Enter a valid creatinine.';
    return { isValid: false, errors, result: null };
  }

  if (input.killipClass == null) {
    return { isValid: false, errors, result: null };
  }

  const arrest = yesNoToBool(input.cardiacArrestAtAdmission);
  if (arrest == null) {
    return { isValid: false, errors, result: null };
  }

  const stDev = yesNoToBool(input.stSegmentDeviation);
  if (stDev == null) {
    return { isValid: false, errors, result: null };
  }

  const enzymes = yesNoToBool(input.elevatedCardiacEnzymes);
  if (enzymes == null) {
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors,
    result: calculateGraceScore(
      age,
      hr,
      sbp,
      crMgDl,
      input.killipClass,
      arrest,
      stDev,
      enzymes,
    ),
  };
}