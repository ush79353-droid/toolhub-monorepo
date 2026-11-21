import {
  calculateMealCalorieFromInput,
  resolveDailyKcalFromMaintenance,
} from './calculation';
import {
  heightToCm,
  parseLoose,
  weightToKg,
} from '../maintenance-calorie/calculation';
import type {
  MealCalorieFieldErrors,
  MealCalorieInput,
  MealCalorieResult,
} from './types';

export interface MealCalorieValidation {
  isValid: boolean;
  errors: MealCalorieFieldErrors;
  result: MealCalorieResult | null;
}

function collectMaintenanceErrors(
  input: MealCalorieInput,
): MealCalorieFieldErrors {
  const errors: MealCalorieFieldErrors = {};

  if (input.ageYears.trim() === '') {
    errors.ageYears = 'Enter age in years.';
  } else {
    const age = parseLoose(input.ageYears);
    if (age == null || !(age >= 15 && age <= 100)) {
      errors.ageYears = 'Enter an adult age from 15 to 100.';
    }
  }

  if (input.heightValue.trim() === '') {
    errors.heightValue = 'Enter height.';
  } else {
    const h = parseLoose(input.heightValue);
    const cm = h == null ? null : heightToCm(h, input.heightUnit);
    if (cm == null || !(cm >= 100 && cm <= 250)) {
      errors.heightValue = 'Enter a plausible adult height.';
    }
  }

  if (input.weightValue.trim() === '') {
    errors.weightValue = 'Enter weight.';
  } else {
    const w = parseLoose(input.weightValue);
    const kg = w == null ? null : weightToKg(w, input.weightUnit);
    if (kg == null || !(kg >= 30 && kg <= 300)) {
      errors.weightValue = 'Enter a plausible adult weight.';
    }
  }

  return errors;
}

function parseManualDaily(raw: string): number | null {
  const n = parseLoose(raw);
  if (n == null || !(n > 0)) return null;
  if (n < 500 || n > 10_000) return null;
  return Math.round(n);
}

export function collectFieldErrors(input: MealCalorieInput): MealCalorieFieldErrors {
  if (input.calculateRequiredCalories) {
    return collectMaintenanceErrors(input);
  }

  const errors: MealCalorieFieldErrors = {};
  if (input.caloriesPerDay.trim() === '') {
    errors.caloriesPerDay = 'Enter daily calories.';
  } else if (parseManualDaily(input.caloriesPerDay) == null) {
    errors.caloriesPerDay = 'Enter a daily total between 500 and 10,000 kcal.';
  }
  return errors;
}

export function validateMealCalorieInput(
  input: MealCalorieInput,
): MealCalorieValidation {
  const errors = collectFieldErrors(input);
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (input.calculateRequiredCalories) {
    const resolved = resolveDailyKcalFromMaintenance(input);
    if (!resolved) {
      return {
        isValid: false,
        errors: {
          form: 'Unable to estimate maintenance calories with these inputs.',
        },
        result: null,
      };
    }
  }

  const manualDaily = input.calculateRequiredCalories
    ? null
    : parseManualDaily(input.caloriesPerDay);

  const result = calculateMealCalorieFromInput(input, manualDaily);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with the current inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}