import {
  calculateHeartFailureLifeExpectancy,
  computeBmiKgM2,
  creatinineToUmolL,
  heightToMeters,
  MAX_AGE,
  MAX_BMI,
  MAX_EF,
  MAX_SBP,
  MIN_AGE,
  MIN_BMI,
  MIN_EF,
  MIN_SBP,
  toClinicalInput,
  weightToKg,
} from './calculation';
import type {
  HeartFailureLifeExpectancyFieldErrors,
  HeartFailureLifeExpectancyInput,
  HeartFailureLifeExpectancyResult,
} from './types';

export interface HeartFailureLifeExpectancyValidation {
  isValid: boolean;
  errors: HeartFailureLifeExpectancyFieldErrors;
  result: HeartFailureLifeExpectancyResult | null;
  derivedBmi: number | null;
}

function parsePositive(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function validateHeartFailureLifeExpectancyInput(
  input: HeartFailureLifeExpectancyInput,
): HeartFailureLifeExpectancyValidation {
  const errors: HeartFailureLifeExpectancyFieldErrors = {};

  const age = parsePositive(input.ageYears);
  const ef = parsePositive(input.efPercent);
  const sbp = parsePositive(input.systolicBp);
  const height = parsePositive(input.heightValue);
  const weight = parsePositive(input.weightValue);
  const cr = parsePositive(input.creatinineValue);

  const requiredBlank =
    !input.ageYears.trim() ||
    !input.heightValue.trim() ||
    !input.weightValue.trim() ||
    !input.creatinineValue.trim() ||
    !input.efPercent.trim() ||
    !input.systolicBp.trim();

  if (requiredBlank) {
    return { isValid: false, errors, result: null, derivedBmi: null };
  }

  if (age == null) errors.ageYears = 'Enter a valid age in years.';
  else if (age < MIN_AGE || age > MAX_AGE) {
    errors.ageYears = `Age must be between ${MIN_AGE} and ${MAX_AGE} years.`;
  }

  const heightM =
    height != null ? heightToMeters(height, input.heightUnit) : null;
  if (height == null) errors.heightValue = 'Enter a valid height.';
  else if (heightM == null) errors.heightValue = 'Enter a valid height.';

  const weightKg =
    weight != null ? weightToKg(weight, input.weightUnit) : null;
  if (weight == null) errors.weightValue = 'Enter a valid weight.';
  else if (weightKg == null) errors.weightValue = 'Enter a valid weight.';

  let derivedBmi: number | null = null;
  if (heightM != null && weightKg != null) {
    derivedBmi = computeBmiKgM2(heightM, weightKg);
    if (derivedBmi == null) {
      errors.weightValue = 'Unable to derive BMI from height and weight.';
    } else if (derivedBmi < MIN_BMI || derivedBmi > MAX_BMI) {
      errors.form = `BMI ${derivedBmi.toFixed(1)} kg/m² is outside the supported MAGGIC range (${MIN_BMI}–${MAX_BMI}).`;
    }
  }

  if (cr == null) errors.creatinineValue = 'Enter a valid creatinine.';
  else {
    const umol = creatinineToUmolL(cr, input.creatinineUnit);
    if (umol == null) errors.creatinineValue = 'Enter a valid creatinine.';
  }

  if (ef == null) errors.efPercent = 'Enter a valid ejection fraction.';
  else if (ef < MIN_EF || ef > MAX_EF) {
    errors.efPercent = `EF must be between ${MIN_EF} and ${MAX_EF}%.`;
  }

  if (sbp == null) errors.systolicBp = 'Enter a valid systolic blood pressure.';
  else if (sbp < MIN_SBP || sbp > MAX_SBP) {
    errors.systolicBp = `SBP must be between ${MIN_SBP} and ${MAX_SBP} mmHg.`;
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null, derivedBmi };
  }

  const creatinineUmolL = creatinineToUmolL(cr!, input.creatinineUnit)!;
  const clinical = toClinicalInput(input, {
    ageYears: age!,
    bmiKgM2: derivedBmi!,
    creatinineUmolL,
    efPercent: ef!,
    systolicMmHg: sbp!,
  });

  const result = calculateHeartFailureLifeExpectancy(clinical);
  return { isValid: true, errors: {}, result, derivedBmi };
}