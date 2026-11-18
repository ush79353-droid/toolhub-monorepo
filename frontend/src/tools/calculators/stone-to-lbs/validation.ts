import {
  MAX_ABS_VALUE,
  OTHER_MASS_OPTIONS,
  type OtherMassUnit,
  type StoneToLbsFieldErrors,
  type StoneToLbsInput,
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

const OTHER_SET = new Set<string>(OTHER_MASS_OPTIONS.map((o) => o.value));

export function isOtherMassUnit(value: string): value is OtherMassUnit {
  return OTHER_SET.has(value);
}

function massProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateStoneToLbs(input: StoneToLbsInput): {
  isValid: boolean;
  errors: StoneToLbsFieldErrors;
} {
  const errors: StoneToLbsFieldErrors = {};

  if (!isOtherMassUnit(input.otherUnit)) {
    errors.otherUnit = 'Select a valid mass unit.';
  }

  const field =
    input.source === 'st' ? 'st' : input.source === 'lb' ? 'lb' : 'other';
  const state = massProblem(input.value);

  if (state === 'blank') {
    return { isValid: false, errors };
  }
  if (state === 'bad') {
    errors[field] = 'Enter a valid finite mass.';
  } else if (state === 'negative') {
    errors[field] = 'Mass cannot be negative.';
  } else if (state === 'large') {
    errors[field] = 'Enter a smaller mass.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
