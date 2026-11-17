import {
  MAX_ABS_VALUE,
  type KgCmToPsiFieldErrors,
  type KgCmToPsiInput,
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

export function validateKgCmToPsi(input: KgCmToPsiInput): {
  isValid: boolean;
  errors: KgCmToPsiFieldErrors;
} {
  const errors: KgCmToPsiFieldErrors = {};
  let blank = false;

  if (input.source === 'kgfCm2') {
    const state = pressureProblem(input.kgfCm2);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.kgfCm2 = 'Enter a valid pressure in kgf/cm².';
    else if (state === 'large') errors.kgfCm2 = 'Enter a smaller absolute value.';
  } else {
    const state = pressureProblem(input.psi);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.psi = 'Enter a valid pressure in psi.';
    else if (state === 'large') errors.psi = 'Enter a smaller absolute value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
