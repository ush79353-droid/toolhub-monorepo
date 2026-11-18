import {
  MAX_ABS_VALUE,
  type MpaToPsigFieldErrors,
  type MpaToPsigInput,
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

function pressureProblem(value: number | null): 'blank' | 'bad' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (Math.abs(value) > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateMpaToPsig(input: MpaToPsigInput): {
  isValid: boolean;
  errors: MpaToPsigFieldErrors;
} {
  const errors: MpaToPsigFieldErrors = {};
  let blank = false;

  if (input.source === 'MPa') {
    const state = pressureProblem(input.MPa);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.MPa = 'Enter a valid gauge pressure in megapascals.';
    else if (state === 'large') errors.MPa = 'Enter a smaller absolute value.';
  } else {
    const state = pressureProblem(input.psig);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.psig = 'Enter a valid pressure in psig.';
    else if (state === 'large') errors.psig = 'Enter a smaller absolute value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
