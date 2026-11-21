import {
  calculateCalorieDeficit,
  calendarDaysBetween,
  heightToCm,
  MAX_WEEKLY_LOSS_KG,
  minSafeIntakeKcal,
  todayUtcDateOnly,
  weightToKg,
} from './calculation';
import type {
  CalorieDeficitFieldErrors,
  CalorieDeficitInput,
  CalorieDeficitResult,
} from './types';

export interface CalorieDeficitValidation {
  isValid: boolean;
  errors: CalorieDeficitFieldErrors;
  result: CalorieDeficitResult | null;
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

export function validateCalorieDeficitInput(
  input: CalorieDeficitInput,
  asOfDate: string = todayUtcDateOnly()
): CalorieDeficitValidation {
  const errors: CalorieDeficitFieldErrors = {};
  let hasFieldError = false;

  const age = parseNumber(input.ageYears);
  if (age.blank) {
    errors.ageYears = 'Enter age in years.';
    hasFieldError = true;
  } else if (
    age.invalid ||
    age.value === null ||
    !Number.isInteger(age.value) ||
    age.value < 15 ||
    age.value > 100
  ) {
    errors.ageYears = 'Enter a whole age between 15 and 100.';
    hasFieldError = true;
  }

  const heightRaw = parseNumber(input.heightValue);
  let heightCm: number | null = null;
  if (heightRaw.blank) {
    errors.heightValue = 'Enter height.';
    hasFieldError = true;
  } else if (heightRaw.invalid || heightRaw.value === null) {
    errors.heightValue = 'Enter a valid height.';
    hasFieldError = true;
  } else {
    heightCm = heightToCm(heightRaw.value, input.heightUnit);
    if (heightCm == null || heightCm < 100 || heightCm > 250) {
      errors.heightValue = 'Height is outside the supported adult range.';
      hasFieldError = true;
      heightCm = null;
    }
  }

  const curRaw = parseNumber(input.currentWeightValue);
  let currentKg: number | null = null;
  if (curRaw.blank) {
    errors.currentWeightValue = 'Enter current weight.';
    hasFieldError = true;
  } else if (curRaw.invalid || curRaw.value === null) {
    errors.currentWeightValue = 'Enter a valid current weight.';
    hasFieldError = true;
  } else {
    currentKg = weightToKg(curRaw.value, input.currentWeightUnit);
    if (currentKg == null || currentKg < 30 || currentKg > 300) {
      errors.currentWeightValue = 'Current weight is outside the supported range.';
      hasFieldError = true;
      currentKg = null;
    }
  }

  const tgtRaw = parseNumber(input.targetWeightValue);
  let targetKg: number | null = null;
  if (tgtRaw.blank) {
    errors.targetWeightValue = 'Enter target weight.';
    hasFieldError = true;
  } else if (tgtRaw.invalid || tgtRaw.value === null) {
    errors.targetWeightValue = 'Enter a valid target weight.';
    hasFieldError = true;
  } else {
    targetKg = weightToKg(tgtRaw.value, input.targetWeightUnit);
    if (targetKg == null || targetKg < 30 || targetKg > 300) {
      errors.targetWeightValue = 'Target weight is outside the supported range.';
      hasFieldError = true;
      targetKg = null;
    }
  }

  if (
    currentKg != null &&
    targetKg != null &&
    !errors.currentWeightValue &&
    !errors.targetWeightValue
  ) {
    if (targetKg >= currentKg) {
      errors.targetWeightValue =
        'Target weight must be below current weight for a calorie deficit plan.';
      hasFieldError = true;
    }
  }

  const targetDate = input.targetDate.trim();
  let days: number | null = null;
  if (!targetDate) {
    errors.targetDate = 'Enter a target date.';
    hasFieldError = true;
  } else {
    days = calendarDaysBetween(asOfDate, targetDate);
    if (days == null) {
      errors.targetDate = 'Enter a valid target date (YYYY-MM-DD).';
      hasFieldError = true;
    } else if (days <= 0) {
      errors.targetDate = 'Target date must be after today.';
      hasFieldError = true;
      days = null;
    } else if (days > 3650) {
      errors.targetDate = 'Target date cannot be more than 10 years ahead.';
      hasFieldError = true;
      days = null;
    }
  }

  if (
    hasFieldError ||
    age.value == null ||
    heightCm == null ||
    currentKg == null ||
    targetKg == null ||
    days == null
  ) {
    return { isValid: false, errors, result: null };
  }

  try {
    const result = calculateCalorieDeficit({
      sex: input.sex,
      ageYears: age.value,
      heightCm,
      currentWeightKg: currentKg,
      targetWeightKg: targetKg,
      days,
      asOfDate,
      targetDate,
    });

    const weeklyLoss = (result.weightDeltaKg / result.days) * 7;
    if (weeklyLoss > MAX_WEEKLY_LOSS_KG + 1e-9) {
      errors.form = `This goal implies more than ${MAX_WEEKLY_LOSS_KG} kg/week on average. Choose a later target date or a smaller weight change.`;
      return { isValid: false, errors, result: null };
    }

    const floor = minSafeIntakeKcal(input.sex);
    if (result.plannedIntakeKcal < floor) {
      errors.form = `Planned intake would fall below this calculator’s ${floor} kcal/day floor (sedentary maintenance assumption). Soften the goal or extend the timeline.`;
      return { isValid: false, errors, result: null };
    }

    return { isValid: true, errors: {}, result };
  } catch {
    errors.form = 'Unable to calculate a calorie deficit from the entered values.';
    return { isValid: false, errors, result: null };
  }
}
