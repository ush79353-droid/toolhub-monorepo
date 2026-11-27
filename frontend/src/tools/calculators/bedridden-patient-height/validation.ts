import { calculateBedridden, parseNumber } from './calculation';
import type {
  BedriddenFieldErrors,
  BedriddenInput,
  BedriddenResult,
} from './types';

export interface BedriddenValidation {
  errors: BedriddenFieldErrors;
  result: BedriddenResult | null;
}

function checkOptionalPositive(
  raw: string,
  label: string,
): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label}.`;
  if (!(n > 0)) return `${label} must be positive.`;
  return undefined;
}

function checkOptionalAge(raw: string): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return 'Enter a valid age.';
  if (n < 0 || n > 120) return 'Age must be between 0 and 120.';
  return undefined;
}

export function validateBedriddenInput(
  input: BedriddenInput,
): BedriddenValidation {
  const errors: BedriddenFieldErrors = {};

  const fields: [keyof BedriddenInput, string][] = [
    ['semiSpanText', 'semi-span'],
    ['halfArmSpanText', 'half-arm span'],
    ['armLengthText', 'arm length'],
    ['recumbentText', 'recumbent height'],
    ['kneeHeightText', 'knee height'],
    ['forearmText', 'forearm length'],
    ['demiSpanText', 'demi-span'],
    ['armCircText', 'arm circumference'],
    ['kneeWeightText', 'knee height'],
    ['calfText', 'calf circumference'],
    ['subscapularText', 'subscapular skinfold'],
    ['abdominalText', 'abdominal circumference'],
  ];

  for (const [key, label] of fields) {
    const err = checkOptionalPositive(String(input[key]), label);
    if (err) errors[key] = err;
  }

  const ageErr = checkOptionalAge(input.heightAgeText);
  if (ageErr) errors.heightAgeText = ageErr;

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateBedridden(input) };
}
