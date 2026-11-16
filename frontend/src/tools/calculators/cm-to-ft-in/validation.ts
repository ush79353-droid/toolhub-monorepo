import {
  MAX_ABS_VALUE,
  type CmToFtInFieldErrors,
  type CmToFtInInput,
} from './types';

export function isIncompleteNumber(raw: string): boolean {
  const cleaned = raw.trim();
  return (
    cleaned === '' ||
    cleaned === '.' ||
    cleaned === '-' ||
    cleaned === '-.' ||
    cleaned.endsWith('.') ||
    /e[+-]?$/i.test(cleaned)
  );
}

export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function lengthProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateCmToFtIn(input: CmToFtInInput): {
  isValid: boolean;
  errors: CmToFtInFieldErrors;
} {
  const errors: CmToFtInFieldErrors = {};
  let blank = false;

  if (input.source === 'centimeters') {
    const state = lengthProblem(input.centimeters);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.centimeters = 'Enter a valid length in centimeters.';
    else if (state === 'negative') errors.centimeters = 'Length cannot be negative.';
    else if (state === 'large') errors.centimeters = 'Enter a smaller value.';
  } else {
    const feetState = lengthProblem(input.feet);
    const inchesState = lengthProblem(input.inches);

    if (feetState === 'blank' && inchesState === 'blank') {
      blank = true;
    } else {
      if (feetState !== 'blank' && feetState !== 'ok') {
        if (feetState === 'bad') errors.feet = 'Enter a valid number of feet.';
        else if (feetState === 'negative') errors.feet = 'Feet cannot be negative.';
        else if (feetState === 'large') errors.feet = 'Enter a smaller value.';
      }
      if (inchesState !== 'blank' && inchesState !== 'ok') {
        if (inchesState === 'bad') errors.inches = 'Enter a valid number of inches.';
        else if (inchesState === 'negative') errors.inches = 'Inches cannot be negative.';
        else if (inchesState === 'large') errors.inches = 'Enter a smaller value.';
      }
    }
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
