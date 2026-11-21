import { calculateInsulinDosage, parseNumber } from './calculation';
import type {
  InsulinDosageFieldErrors,
  InsulinDosageInput,
  InsulinDosageResult,
} from './types';

export interface InsulinDosageValidation {
  isValid: boolean;
  errors: InsulinDosageFieldErrors;
  result: InsulinDosageResult | null;
}

export function collectFieldErrors(
  input: InsulinDosageInput,
): InsulinDosageFieldErrors {
  const errors: InsulinDosageFieldErrors = {};

  if (input.glucoseUnit !== 'mg/dL' && input.glucoseUnit !== 'mmol/L') {
    errors.form = 'Select a glucose unit.';
  }

  if (input.knowTotalDailyDose && input.totalDailyDose.trim() !== '') {
    const tdd = parseNumber(input.totalDailyDose);
    if (tdd == null) {
      errors.totalDailyDose = 'Enter a valid total daily dose.';
    } else if (!(tdd > 0)) {
      errors.totalDailyDose = 'Total daily dose must be greater than zero.';
    } else if (tdd > 500) {
      errors.totalDailyDose = 'Total daily dose is out of a realistic range.';
    }
  }

  if (input.carbsGrams.trim() !== '') {
    const carbs = parseNumber(input.carbsGrams);
    if (carbs == null) {
      errors.carbsGrams = 'Enter valid carbohydrate grams.';
    } else if (carbs < 0) {
      errors.carbsGrams = 'Carbohydrates cannot be negative.';
    } else if (carbs > 500) {
      errors.carbsGrams = 'Carbohydrate amount is out of range.';
    }
  }

  if (input.carbRatio.trim() !== '') {
    const ratio = parseNumber(input.carbRatio);
    if (ratio == null) {
      errors.carbRatio = 'Enter a valid carbohydrate ratio.';
    } else if (!(ratio > 0)) {
      errors.carbRatio = 'Carbohydrate ratio must be greater than zero.';
    }
  } else if (input.carbsGrams.trim() !== '') {
    errors.carbRatio = 'Enter a carbohydrate ratio (g per unit).';
  }

  if (input.currentGlucose.trim() !== '') {
    const g = parseNumber(input.currentGlucose);
    if (g == null) {
      errors.currentGlucose = 'Enter a valid current glucose.';
    } else if (g < 0) {
      errors.currentGlucose = 'Glucose cannot be negative.';
    }
  }

  if (input.targetGlucose.trim() !== '') {
    const g = parseNumber(input.targetGlucose);
    if (g == null) {
      errors.targetGlucose = 'Enter a valid target glucose.';
    } else if (g < 0) {
      errors.targetGlucose = 'Target cannot be negative.';
    }
  } else if (input.currentGlucose.trim() !== '') {
    errors.targetGlucose = 'Enter a target glucose.';
  }

  if (input.sensitivity.trim() !== '') {
    const s = parseNumber(input.sensitivity);
    if (s == null) {
      errors.sensitivity = 'Enter a valid insulin sensitivity factor.';
    } else if (!(s > 0)) {
      errors.sensitivity = 'Sensitivity must be greater than zero.';
    }
  } else if (input.currentGlucose.trim() !== '') {
    errors.sensitivity = 'Enter an insulin sensitivity factor.';
  }

  return errors;
}

export function hasFieldErrors(errors: InsulinDosageFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateInsulinDosageInput(
  input: InsulinDosageInput,
): InsulinDosageValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateInsulinDosage(input);
  if (!result) {
    return { isValid: false, errors: {}, result: null };
  }
  return { isValid: true, errors: {}, result };
}
