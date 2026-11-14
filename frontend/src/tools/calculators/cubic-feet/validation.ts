import {
  MAX_ABS_VALUE,
  type CubicFeetFieldErrors,
  type CubicFeetInput,
  type MissingDimensionFieldErrors,
  type MissingDimensionInput,
} from './types';

/** Half-typed values such as `1.` stay incomplete. */
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
  const cleaned = raw.trim();
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function dimProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

function applyDimError(
  errors: Record<string, string | undefined>,
  key: string,
  state: ReturnType<typeof dimProblem>,
  noun: string
): boolean {
  if (state === 'blank') return true;
  if (state === 'bad') errors[key] = `Enter a valid ${noun}.`;
  else if (state === 'negative') errors[key] = 'Dimension cannot be negative.';
  else if (state === 'large') errors[key] = 'Enter a smaller value.';
  return false;
}

export function validateCubicFeet(input: CubicFeetInput): {
  isValid: boolean;
  errors: CubicFeetFieldErrors;
} {
  const errors: CubicFeetFieldErrors = {};
  let blank = false;

  blank =
    applyDimError(errors, 'length', dimProblem(input.length), 'length') || blank;
  blank = applyDimError(errors, 'width', dimProblem(input.width), 'width') || blank;
  blank = applyDimError(errors, 'height', dimProblem(input.height), 'height') || blank;

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}

export function validateMissingDimension(input: MissingDimensionInput): {
  isValid: boolean;
  errors: MissingDimensionFieldErrors;
} {
  const errors: MissingDimensionFieldErrors = {};
  let blank = false;

  const vol = dimProblem(input.volumeCubicFeet);
  if (vol === 'blank') blank = true;
  else if (vol === 'bad') errors.volumeCubicFeet = 'Enter a valid volume in cubic feet.';
  else if (vol === 'negative') errors.volumeCubicFeet = 'Volume cannot be negative.';
  else if (vol === 'large') errors.volumeCubicFeet = 'Enter a smaller value.';

  if (input.unknown !== 'length') {
    blank =
      applyDimError(errors, 'length', dimProblem(input.length), 'length') || blank;
  }
  if (input.unknown !== 'width') {
    blank = applyDimError(errors, 'width', dimProblem(input.width), 'width') || blank;
  }
  if (input.unknown !== 'height') {
    blank =
      applyDimError(errors, 'height', dimProblem(input.height), 'height') || blank;
  }

  if (!blank && Object.keys(errors).length === 0) {
    let product = 1;
    if (input.unknown !== 'length') {
      product *= Math.abs(input.length!);
    }
    if (input.unknown !== 'width') {
      product *= Math.abs(input.width!);
    }
    if (input.unknown !== 'height') {
      product *= Math.abs(input.height!);
    }
    if (product === 0) {
      const zeroKey =
        input.unknown !== 'length' && input.length === 0
          ? 'length'
          : input.unknown !== 'width' && input.width === 0
            ? 'width'
            : 'height';
      errors[zeroKey] = 'Cannot divide by a zero dimension.';
    }
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
