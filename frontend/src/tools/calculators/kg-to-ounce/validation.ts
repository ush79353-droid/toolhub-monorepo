import {
  MAX_ABS_VALUE,
  type KgToOunceFieldErrors,
  type KgToOunceInput,
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

function massProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateKgToOunce(input: KgToOunceInput): {
  isValid: boolean;
  errors: KgToOunceFieldErrors;
} {
  const errors: KgToOunceFieldErrors = {};
  let blank = false;

  if (input.source === 'kg') {
    const state = massProblem(input.kg);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.kg = 'Enter a valid mass in kilograms.';
    else if (state === 'negative') errors.kg = 'Mass cannot be negative.';
    else if (state === 'large') errors.kg = 'Enter a smaller mass.';
  } else if (input.source === 'oz') {
    const state = massProblem(input.oz);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.oz = 'Enter a valid mass in ounces.';
    else if (state === 'negative') errors.oz = 'Mass cannot be negative.';
    else if (state === 'large') errors.oz = 'Enter a smaller mass.';
  } else if (input.source === 'troyOz') {
    const state = massProblem(input.troyOz);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.troyOz = 'Enter a valid mass in troy ounces.';
    else if (state === 'negative') errors.troyOz = 'Mass cannot be negative.';
    else if (state === 'large') errors.troyOz = 'Enter a smaller mass.';
  } else if (input.source === 'lbOz') {
    const lbBlank = input.lbPart === null;
    const ozBlank = input.ozPart === null;
    if (lbBlank && ozBlank) {
      blank = true;
    } else {
      if (!lbBlank) {
        const state = massProblem(input.lbPart);
        if (state === 'bad') errors.lbPart = 'Enter a valid whole-pound component.';
        else if (state === 'negative') errors.lbPart = 'Pounds cannot be negative.';
        else if (state === 'large') errors.lbPart = 'Enter a smaller value.';
      }
      if (!ozBlank) {
        const state = massProblem(input.ozPart);
        if (state === 'bad') errors.ozPart = 'Enter a valid ounce remainder.';
        else if (state === 'negative') errors.ozPart = 'Ounces cannot be negative.';
        else if (state === 'large') errors.ozPart = 'Enter a smaller value.';
      }
    }
  } else {
    const state = massProblem(input.moreValue);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.moreValue = 'Enter a valid mass value.';
    else if (state === 'negative') errors.moreValue = 'Mass cannot be negative.';
    else if (state === 'large') errors.moreValue = 'Enter a smaller mass.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
