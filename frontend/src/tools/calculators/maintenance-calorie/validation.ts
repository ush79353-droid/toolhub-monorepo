import {
  computeMaintenanceCalorie,
  parseLoose,
  heightToCm,
  weightToKg,
} from './calculation';
import type {
  MaintenanceCalorieFieldErrors,
  MaintenanceCalorieInput,
  MaintenanceCalorieResult,
} from './types';

export interface MaintenanceCalorieValidation {
  isValid: boolean;
  errors: MaintenanceCalorieFieldErrors;
  result: MaintenanceCalorieResult | null;
}

export function validateMaintenanceCalorieInput(
  input: MaintenanceCalorieInput,
): MaintenanceCalorieValidation {
  const errors: MaintenanceCalorieFieldErrors = {};

  const age = parseLoose(input.ageYears);
  if (age === null) errors.ageYears = 'Enter age in years.';
  else if (age < 15 || age > 100)
    errors.ageYears = 'Age must be between 15 and 100 years.';

  const heightRaw = parseLoose(input.heightValue);
  if (heightRaw === null || heightRaw <= 0)
    errors.heightValue = 'Enter a positive height.';
  else {
    const cm = heightToCm(heightRaw, input.heightUnit);
    if (cm == null || cm < 100 || cm > 250)
      errors.heightValue = 'Height is outside a realistic adult range.';
  }

  const weightRaw = parseLoose(input.weightValue);
  if (weightRaw === null || weightRaw <= 0)
    errors.weightValue = 'Enter a positive weight.';
  else {
    const kg = weightToKg(weightRaw, input.weightUnit);
    if (kg == null || kg < 30 || kg > 300)
      errors.weightValue = 'Weight is outside a realistic adult range.';
  }

  if (input.showMacroPercent || input.showMacroKcal) {
    const p = parseLoose(input.proteinPct);
    const c = parseLoose(input.carbPct);
    const f = parseLoose(input.fatPct);
    if (p === null || p < 10 || p > 35)
      errors.proteinPct = 'Protein share must be 10–35%.';
    if (c === null || c < 45 || c > 65)
      errors.carbPct = 'Carbohydrate share must be 45–65%.';
    if (f === null || f < 20 || f > 35)
      errors.fatPct = 'Fat share must be 20–35%.';
    if (
      p !== null &&
      c !== null &&
      f !== null &&
      Math.abs(p + c + f - 100) >= 0.05
    ) {
      errors.form = 'Macro percentages must add up to 100%.';
    }
  }

  if (input.showChangeWeight) {
    const goalRaw = parseLoose(input.goalWeightValue);
    if (goalRaw === null || goalRaw <= 0)
      errors.goalWeightValue = 'Enter a goal weight.';
    const weekly = parseLoose(input.weeklyChangeKg);
    if (weekly === null || weekly <= 0)
      errors.weeklyChangeKg = 'Enter a positive weekly change.';
    else if (weekly > 1)
      errors.weeklyChangeKg = 'Keep weekly change at or below 1 kg.';

    if (
      !errors.goalWeightValue &&
      !errors.weightValue &&
      goalRaw !== null &&
      weightRaw !== null
    ) {
      const goalKg = weightToKg(goalRaw, input.goalWeightUnit);
      const curKg = weightToKg(weightRaw, input.weightUnit);
      if (goalKg != null && curKg != null) {
        if (input.changeDirection === 'lose' && !(goalKg < curKg))
          errors.goalWeightValue = 'Goal weight must be below current weight.';
        if (input.changeDirection === 'gain' && !(goalKg > curKg))
          errors.goalWeightValue = 'Goal weight must be above current weight.';
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = computeMaintenanceCalorie(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Could not compute maintenance calories for these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
