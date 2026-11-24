import { calculateStillbirthRisk, deriveBmi } from './calculation';
import type {
  StillbirthRiskFieldErrors,
  StillbirthRiskInput,
  StillbirthRiskResult,
} from './types';
import {
  hasPregestationalDiabetes,
  isBlackEthnicity,
  isNulliparous,
} from './calculation';

export interface StillbirthRiskValidation {
  isValid: boolean;
  errors: StillbirthRiskFieldErrors;
  result: StillbirthRiskResult | null;
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
 * Result appears when age, height, and pre-pregnancy weight are valid so BMI
 * and age coefficients can be applied. Previous pregnancies must be answered.
 */
export function validateStillbirthRiskInput(
  input: StillbirthRiskInput
): StillbirthRiskValidation {
  const errors: StillbirthRiskFieldErrors = {};

  const ageParsed = parseNumber(input.ageYears);
  if (ageParsed.blank) {
    return { isValid: false, errors, result: null };
  }
  if (ageParsed.invalid || ageParsed.value == null) {
    errors.ageYears = 'Enter a valid age in years.';
    return { isValid: false, errors, result: null };
  }
  if (ageParsed.value < 12 || ageParsed.value > 55) {
    errors.ageYears = 'Age should be between 12 and 55 years for this model.';
    return { isValid: false, errors, result: null };
  }

  const hParsed = parseNumber(input.heightCm);
  if (hParsed.blank) {
    return { isValid: false, errors, result: null };
  }
  if (hParsed.invalid || hParsed.value == null || hParsed.value <= 0) {
    errors.heightCm = 'Enter a valid height in centimeters.';
    return { isValid: false, errors, result: null };
  }
  if (hParsed.value < 120 || hParsed.value > 220) {
    errors.heightCm = 'Height is outside the supported range (cm).';
    return { isValid: false, errors, result: null };
  }

  const wParsed = parseNumber(input.weightKg);
  if (wParsed.blank) {
    return { isValid: false, errors, result: null };
  }
  if (wParsed.invalid || wParsed.value == null || wParsed.value <= 0) {
    errors.weightKg = 'Enter a valid pre-pregnancy weight in kilograms.';
    return { isValid: false, errors, result: null };
  }
  if (wParsed.value < 35 || wParsed.value > 200) {
    errors.weightKg = 'Pre-pregnancy weight is outside the supported range (kg).';
    return { isValid: false, errors, result: null };
  }

  const bmi = deriveBmi(wParsed.value, hParsed.value);
  if (bmi == null || bmi < 14 || bmi > 70) {
    errors.bmi = 'Height and weight do not yield a plausible pre-pregnancy BMI.';
    return { isValid: false, errors, result: null };
  }

  if (input.previousPregnancies === null) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateStillbirthRisk(
    {
      ageYears: ageParsed.value,
      bmi,
      isBlack: isBlackEthnicity(input.ethnicity),
      nulliparous: isNulliparous(input.previousPregnancies),
      smoking: input.smokingDuringPregnancy,
      chronicHypertension: input.chronicHypertension,
      pregestationalDiabetes: hasPregestationalDiabetes(input.diabetes),
    },
    {
      art: input.art,
      sle: input.sle,
      aps: input.aps,
      alcoholDuringPregnancy: input.alcoholDuringPregnancy,
      ethnicity: input.ethnicity,
    }
  );

  return { isValid: true, errors, result };
}