import {
  MAX_ABS_VALUE,
  type AtmConversionFieldErrors,
  type AtmConversionInput,
  type AtmPressureUnit,
} from './types';

/** Half-typed values such as `1.` or `1e` stay incomplete. */
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

/** Blank and incomplete drafts become null. Any other non-number becomes NaN. */
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

const fieldKey: Record<AtmPressureUnit, keyof AtmConversionFieldErrors> = {
  atm: 'atm',
  bar: 'bar',
  psi: 'psi',
  Pa: 'Pa',
};

const fieldLabel: Record<AtmPressureUnit, string> = {
  atm: 'atmospheres',
  bar: 'bar',
  psi: 'psi',
  Pa: 'pascals',
};

export function validateAtmConversion(input: AtmConversionInput): {
  isValid: boolean;
  errors: AtmConversionFieldErrors;
} {
  const errors: AtmConversionFieldErrors = {};
  let blank = false;
  const key = fieldKey[input.source];
  const value =
    input.source === 'atm'
      ? input.atm
      : input.source === 'bar'
        ? input.bar
        : input.source === 'psi'
          ? input.psi
          : input.Pa;

  const state = pressureProblem(value);
  if (state === 'blank') blank = true;
  else if (state === 'bad') errors[key] = `Enter a valid pressure in ${fieldLabel[input.source]}.`;
  else if (state === 'large') errors[key] = 'Enter a smaller value.';

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
