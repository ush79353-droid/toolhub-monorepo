import { calculateKarvonen, parseNumber } from './calculation';
import type {
  KarvonenFieldErrors,
  KarvonenInput,
  KarvonenResult,
} from './types';

export interface KarvonenValidation {
  errors: KarvonenFieldErrors;
  result: KarvonenResult | null;
}

function checkPositiveHr(raw: string, label: string): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label}.`;
  if (!(n > 0)) return `${label} must be greater than 0.`;
  if (n > 300) return `${label} looks unrealistically high.`;
  return undefined;
}

export function validateKarvonenInput(input: KarvonenInput): KarvonenValidation {
  const errors: KarvonenFieldErrors = {};

  const rhrErr = checkPositiveHr(input.restingHrText, 'resting heart rate');
  if (rhrErr) errors.restingHrText = rhrErr;

  if (input.knowMaxHr === 'yes') {
    const mhrErr = checkPositiveHr(input.maximumHrText, 'maximum heart rate');
    if (mhrErr) errors.maximumHrText = mhrErr;
  } else if (input.ageText.trim() !== '') {
    const age = parseNumber(input.ageText);
    if (age === null) errors.ageText = 'Enter a valid age.';
    else if (!(age > 0) || age > 120) errors.ageText = 'Age must be between 1 and 120.';
  }

  if (input.intensityText.trim() !== '') {
    const intensity = parseNumber(input.intensityText);
    if (intensity === null) errors.intensityText = 'Enter a valid intensity.';
    else if (intensity < 0 || intensity > 100) {
      errors.intensityText = 'Intensity must be between 0 and 100%.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateKarvonen(input),
  };
}
