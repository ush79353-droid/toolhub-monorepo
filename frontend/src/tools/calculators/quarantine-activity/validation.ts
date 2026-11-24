import { calculateQuarantineActivity, parseNumber } from './calculation';
import type {
  QuarantineActivityFieldErrors,
  QuarantineActivityInput,
  QuarantineActivityResult,
} from './types';

export interface QuarantineActivityValidation {
  errors: QuarantineActivityFieldErrors;
  result: QuarantineActivityResult | null;
}

function validateTime(
  text: string,
  activityId: string,
): string | undefined {
  if (text.trim() === '') {
    if (activityId) return undefined; // activity alone is ok (no kcal yet)
    return undefined;
  }
  const n = parseNumber(text);
  if (n === null) return 'Enter a valid time.';
  if (!(n > 0)) return 'Time must be positive.';
  return undefined;
}

export function validateQuarantineActivityInput(
  input: QuarantineActivityInput,
): QuarantineActivityValidation {
  const errors: QuarantineActivityFieldErrors = {};

  if (input.ageYearsText.trim() !== '') {
    const age = parseNumber(input.ageYearsText);
    if (age === null) errors.ageYearsText = 'Enter a valid age.';
    else if (!(age >= 15 && age <= 100))
      errors.ageYearsText = 'Age must be 15–100 years.';
  }

  if (input.heightText.trim() !== '') {
    const h = parseNumber(input.heightText);
    if (h === null) errors.heightText = 'Enter a valid height.';
    else if (!(h > 0)) errors.heightText = 'Height must be positive.';
  }

  if (input.weightText.trim() !== '') {
    const w = parseNumber(input.weightText);
    if (w === null) errors.weightText = 'Enter a valid weight.';
    else if (!(w > 0)) errors.weightText = 'Weight must be positive.';
  }

  const timeKeys = [
    'removedTime0',
    'removedTime1',
    'removedTime2',
    'addedTime0',
    'addedTime1',
    'addedTime2',
  ] as const;

  input.removed.forEach((slot, i) => {
    const err = validateTime(slot.timeText, slot.activityId);
    if (err) errors[timeKeys[i]!] = err;
  });
  input.added.forEach((slot, i) => {
    const err = validateTime(slot.timeText, slot.activityId);
    if (err) errors[timeKeys[i + 3]!] = err;
  });

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateQuarantineActivity(input) };
}
