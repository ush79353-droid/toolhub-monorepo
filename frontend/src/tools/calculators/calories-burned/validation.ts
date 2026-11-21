import { activityById, activitySupportsDistance } from './activities';
import {
  calculateCaloriesBurned,
  minutesFromDistance,
  totalMinutes,
  weightToKg,
} from './calculation';
import type {
  CaloriesBurnedFieldErrors,
  CaloriesBurnedInput,
  CaloriesBurnedResult,
  WeightUnit,
} from './types';

export interface CaloriesBurnedValidation {
  isValid: boolean;
  errors: CaloriesBurnedFieldErrors;
  result: CaloriesBurnedResult | null;
}

export const MIN_WEIGHT_KG = 35;
export const MAX_WEIGHT_KG = 160;
export const MIN_WEIGHT_LB = 80;
export const MAX_WEIGHT_LB = 350;

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

function parseNonNegative(raw: string): {
  value: number;
  blank: boolean;
  invalid: boolean;
} {
  const parsed = parseNumber(raw);
  if (parsed.blank) return { value: 0, blank: true, invalid: false };
  if (parsed.invalid || parsed.value == null || parsed.value < 0) {
    return { value: 0, blank: false, invalid: true };
  }
  return { value: parsed.value, blank: false, invalid: false };
}

function weightInRange(value: number, unit: WeightUnit): boolean {
  if (unit === 'kg') {
    return value >= MIN_WEIGHT_KG && value <= MAX_WEIGHT_KG;
  }
  return value >= MIN_WEIGHT_LB && value <= MAX_WEIGHT_LB;
}

export function validateCaloriesBurnedInput(
  input: CaloriesBurnedInput,
): CaloriesBurnedValidation {
  const errors: CaloriesBurnedFieldErrors = {};
  let hasFieldError = false;

  const activity = activityById(input.activityId);
  if (!input.activityId || !activity) {
    errors.activityId = 'Select an activity.';
    hasFieldError = true;
  }

  const weightParsed = parseNumber(input.weightValue);
  if (weightParsed.blank) {
    errors.weightValue = 'Enter your body weight.';
    hasFieldError = true;
  } else if (weightParsed.invalid || weightParsed.value == null) {
    errors.weightValue = 'Enter a valid body weight.';
    hasFieldError = true;
  } else if (!(weightParsed.value > 0)) {
    errors.weightValue = 'Body weight must be greater than zero.';
    hasFieldError = true;
  } else if (!weightInRange(weightParsed.value, input.weightUnit)) {
    errors.weightValue =
      input.weightUnit === 'kg'
        ? `Weight must be between ${MIN_WEIGHT_KG} and ${MAX_WEIGHT_KG} kg.`
        : `Weight must be between ${MIN_WEIGHT_LB} and ${MAX_WEIGHT_LB} lb.`;
    hasFieldError = true;
  }

  const supportsDistance = activitySupportsDistance(activity);

  if (input.durationInputMode === 'distance' && !supportsDistance) {
    errors.durationInputMode =
      'Distance mode is only available for walking, running, and cycling paces with a known speed.';
    hasFieldError = true;
  }

  let durationMinutes: number | null = null;
  let distanceMilesUsed: number | null = null;

  if (input.durationInputMode === 'distance' && supportsDistance && activity) {
    const dist = parseNumber(input.distanceMiles);
    if (dist.blank) {
      errors.distanceMiles = 'Enter the distance traveled.';
      hasFieldError = true;
    } else if (dist.invalid || dist.value == null || !(dist.value > 0)) {
      errors.distanceMiles = 'Enter a positive distance in miles.';
      hasFieldError = true;
    } else if (activity.speedMph == null) {
      errors.form = 'Selected activity has no pace for distance conversion.';
      hasFieldError = true;
    } else {
      durationMinutes = minutesFromDistance(dist.value, activity.speedMph);
      if (durationMinutes == null) {
        errors.distanceMiles = 'Unable to convert distance to time at this pace.';
        hasFieldError = true;
      } else {
        distanceMilesUsed = dist.value;
      }
    }
  } else {
    const hours = parseNonNegative(input.durationHours);
    const minutes = parseNonNegative(input.durationMinutes);
    if (hours.invalid) {
      errors.durationHours = 'Enter a valid number of hours.';
      hasFieldError = true;
    }
    if (minutes.invalid) {
      errors.durationMinutes = 'Enter a valid number of minutes.';
      hasFieldError = true;
    }
    if (!hours.invalid && !minutes.invalid) {
      const total = totalMinutes(hours.value, minutes.value);
      if (total <= 0) {
        errors.durationMinutes = 'Enter a duration greater than zero.';
        hasFieldError = true;
      } else {
        durationMinutes = total;
      }
    }
  }

  if (hasFieldError) {
    return { isValid: false, errors, result: null };
  }

  if (
    !activity ||
    weightParsed.value == null ||
    durationMinutes == null ||
    durationMinutes <= 0
  ) {
    return { isValid: false, errors, result: null };
  }

  const weightKg = weightToKg(weightParsed.value, input.weightUnit);
  if (weightKg == null) {
    errors.weightValue = 'Unable to use this body weight.';
    return { isValid: false, errors, result: null };
  }

  const result = calculateCaloriesBurned({
    activityId: activity.id,
    activityLabel: activity.label,
    met: activity.met,
    weightKg,
    durationMinutes,
    usedDistanceMode: input.durationInputMode === 'distance',
    distanceMiles: distanceMilesUsed,
  });

  if (!result) {
    errors.form = 'Unable to estimate calories with these inputs.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}