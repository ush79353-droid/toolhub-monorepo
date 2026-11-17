import {
  MAX_ABS_VALUE,
  type InchToMeterFieldErrors,
  type InchToMeterInput,
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

function lengthProblem(value: number | null): 'blank' | 'bad' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (Math.abs(value) > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateInchToMeter(input: InchToMeterInput): {
  isValid: boolean;
  errors: InchToMeterFieldErrors;
} {
  const errors: InchToMeterFieldErrors = {};
  let blank = false;

  if (input.source === 'inches') {
    const state = lengthProblem(input.inches);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.inches = 'Enter a valid length in inches.';
    else if (state === 'large') errors.inches = 'Enter a smaller absolute value.';
  } else if (input.source === 'meters') {
    const state = lengthProblem(input.meters);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.meters = 'Enter a valid length in meters.';
    else if (state === 'large') errors.meters = 'Enter a smaller absolute value.';
  } else {
    const feetBlank = input.feetPart === null;
    const inchesBlank = input.inchesPart === null;
    if (feetBlank && inchesBlank) {
      blank = true;
    } else {
      if (!feetBlank) {
        const state = lengthProblem(input.feetPart);
        if (state === 'bad') errors.feetPart = 'Enter a valid feet value.';
        else if (state === 'large') errors.feetPart = 'Enter a smaller absolute value.';
      }
      if (!inchesBlank) {
        const state = lengthProblem(input.inchesPart);
        if (state === 'bad') errors.inchesPart = 'Enter a valid inches value.';
        else if (state === 'large') errors.inchesPart = 'Enter a smaller absolute value.';
      }
    }
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
