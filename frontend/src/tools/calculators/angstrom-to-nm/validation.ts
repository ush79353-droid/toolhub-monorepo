import {
  MAX_ABS_VALUE,
  type AngstromToNmFieldErrors,
  type AngstromToNmInput,
  type AngstromNmSource,
} from './types';

/** Half-typed values such as `1.` or `1e` stay incomplete so the source field is not overwritten. */
export function isIncompleteNumber(raw: string): boolean {
  const cleaned = raw.trim().toLowerCase();
  if (
    cleaned === '' ||
    cleaned === '.' ||
    cleaned === '-' ||
    cleaned === '-.' ||
    cleaned.endsWith('.') ||
    cleaned.endsWith('e') ||
    cleaned.endsWith('e+') ||
    cleaned.endsWith('e-') ||
    cleaned.endsWith('-e') ||
    cleaned.endsWith('+e')
  ) {
    return true;
  }
  return false;
}

/** Blank and incomplete drafts become null. Any other non-number becomes NaN. */
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

const fieldLabel: Record<AngstromNmSource, keyof AngstromToNmFieldErrors> = {
  angstroms: 'angstroms',
  nanometers: 'nanometers',
  mils: 'mils',
};

const fieldMessage: Record<AngstromNmSource, string> = {
  angstroms: 'angstroms',
  nanometers: 'nanometers',
  mils: 'mils (thousandths of an inch)',
};

export function validateAngstromToNm(input: AngstromToNmInput): {
  isValid: boolean;
  errors: AngstromToNmFieldErrors;
} {
  const errors: AngstromToNmFieldErrors = {};
  let blank = false;
  const key = fieldLabel[input.source];
  const value =
    input.source === 'angstroms'
      ? input.angstroms
      : input.source === 'nanometers'
        ? input.nanometers
        : input.mils;
  const state = lengthProblem(value);
  if (state === 'blank') blank = true;
  else if (state === 'bad') errors[key] = `Enter a valid number of ${fieldMessage[input.source]}.`;
  else if (state === 'negative') errors[key] = 'Length cannot be negative.';
  else if (state === 'large') errors[key] = 'Enter a smaller value.';

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
