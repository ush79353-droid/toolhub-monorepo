import { calculateLungCancerRisk, computeBmiKgM2, heightToMeters, weightToKg } from './calculation';
import type {
  LungCancerRiskFieldErrors,
  LungCancerRiskInput,
  LungCancerRiskResult,
} from './types';

export interface LungCancerRiskValidation {
  isValid: boolean;
  errors: LungCancerRiskFieldErrors;
  result: LungCancerRiskResult | null;
  /** BMI shown when weight+height valid even if other fields incomplete. */
  previewBmi: number | null;
}

function isFiniteNumber(v: number | null): v is number {
  return v != null && Number.isFinite(v);
}

/** HUNT derivation: adults >20; Omni documents ~21–86. */
const AGE_MIN = 20;
const AGE_MAX = 86;
const CIG_MIN = 2;
const CIG_MAX = 35;
const QUIT_MIN = 0;
const QUIT_MAX = 45;
const SMOKE_H_MIN = 0;
const SMOKE_H_MAX = 24;

export function validateLungCancerRiskInput(
  input: LungCancerRiskInput,
): LungCancerRiskValidation {
  const errors: LungCancerRiskFieldErrors = {};

  let previewBmi: number | null = null;
  if (isFiniteNumber(input.weight) && isFiniteNumber(input.height)) {
    if (input.weight > 0 && input.height > 0) {
      const kg = weightToKg(input.weight, input.weightUnit);
      const m = heightToMeters(input.height, input.heightUnit);
      if (m > 0) previewBmi = computeBmiKgM2(kg, m);
    }
  }

  if (!isFiniteNumber(input.ageYears)) {
    errors.ageYears = 'Required';
  } else if (input.ageYears < AGE_MIN || input.ageYears > AGE_MAX) {
    errors.ageYears = `Enter age ${AGE_MIN}–${AGE_MAX} years (HUNT adult ever-smoker range).`;
  }

  if (!isFiniteNumber(input.weight) || input.weight <= 0) {
    errors.weight = 'Enter a positive weight.';
  }

  if (!isFiniteNumber(input.height) || input.height <= 0) {
    errors.height = 'Enter a positive height.';
  }

  if (!isFiniteNumber(input.smokingYears)) {
    errors.smokingYears = 'Required';
  } else if (input.smokingYears <= 0) {
    errors.smokingYears =
      'Model is for ever-smokers — enter smoking years greater than 0.';
  } else if (input.smokingYears > 80) {
    errors.smokingYears = 'Smoking years looks too high.';
  }

  if (!isFiniteNumber(input.cigarettesPerDay)) {
    errors.cigarettesPerDay = 'Required';
  } else if (
    input.cigarettesPerDay < CIG_MIN ||
    input.cigarettesPerDay > CIG_MAX
  ) {
    errors.cigarettesPerDay = `Enter ${CIG_MIN}–${CIG_MAX} cigarettes/day (model range).`;
  }

  if (!isFiniteNumber(input.yearsSinceQuitting)) {
    errors.yearsSinceQuitting = 'Required (use 0 if still smoking).';
  } else if (
    input.yearsSinceQuitting < QUIT_MIN ||
    input.yearsSinceQuitting > QUIT_MAX
  ) {
    errors.yearsSinceQuitting = `Enter ${QUIT_MIN}–${QUIT_MAX} years since quitting.`;
  }

  if (!isFiniteNumber(input.smokeRoomHours)) {
    errors.smokeRoomHours = 'Required (use 0 if none).';
  } else if (
    input.smokeRoomHours < SMOKE_H_MIN ||
    input.smokeRoomHours > SMOKE_H_MAX
  ) {
    errors.smokeRoomHours = `Enter ${SMOKE_H_MIN}–${SMOKE_H_MAX} hours/day.`;
  }

  const blocking =
    errors.ageYears ||
    errors.weight ||
    errors.height ||
    errors.smokingYears ||
    errors.cigarettesPerDay ||
    errors.yearsSinceQuitting ||
    errors.smokeRoomHours;

  if (blocking) {
    if (!errors.form) {
      errors.form =
        'Complete age, body measures, and smoking history (ever-smokers only) to see 6- and 16-year risks.';
    }
    return { isValid: false, errors, result: null, previewBmi };
  }

  return {
    isValid: true,
    errors: {},
    result: calculateLungCancerRisk(input),
    previewBmi,
  };
}
