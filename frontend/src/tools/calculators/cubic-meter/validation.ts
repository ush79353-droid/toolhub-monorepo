import {
  MAX_ABS_VALUE,
  type CubicMeterFieldErrors,
  type CubicMeterInput,
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

function numProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

function applyError(
  errors: Record<string, string | undefined>,
  key: string,
  state: ReturnType<typeof numProblem>,
  noun: string
): boolean {
  if (state === 'blank') return true;
  if (state === 'bad') errors[key] = `Enter a valid ${noun}.`;
  else if (state === 'negative') errors[key] = `${noun} cannot be negative.`;
  else if (state === 'large') errors[key] = 'Enter a smaller value.';
  return false;
}

export function validateCubicMeter(input: CubicMeterInput): {
  isValid: boolean;
  errors: CubicMeterFieldErrors;
} {
  const errors: CubicMeterFieldErrors = {};
  let blank = false;

  if (input.source === 'dimensions') {
    blank =
      applyError(errors, 'length', numProblem(input.length), 'Length') || blank;
    blank = applyError(errors, 'width', numProblem(input.width), 'Width') || blank;
    blank =
      applyError(errors, 'height', numProblem(input.height), 'Height') || blank;
  } else {
    blank = applyError(errors, 'volume', numProblem(input.volume), 'Volume') || blank;
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}

export function validateMissingDimension(input: MissingDimensionInput): {
  isValid: boolean;
  errors: MissingDimensionFieldErrors;
} {
  const errors: MissingDimensionFieldErrors = {};
  let blank = false;

  blank =
    applyError(
      errors,
      'volumeCubicMeters',
      numProblem(input.volumeCubicMeters),
      'Volume'
    ) || blank;

  if (input.unknown !== 'length') {
    blank =
      applyError(errors, 'length', numProblem(input.length), 'Length') || blank;
  }
  if (input.unknown !== 'width') {
    blank = applyError(errors, 'width', numProblem(input.width), 'Width') || blank;
  }
  if (input.unknown !== 'height') {
    blank =
      applyError(errors, 'height', numProblem(input.height), 'Height') || blank;
  }

  if (!blank && Object.keys(errors).length === 0) {
    let product = 1;
    if (input.unknown !== 'length') product *= Math.abs(input.length!);
    if (input.unknown !== 'width') product *= Math.abs(input.width!);
    if (input.unknown !== 'height') product *= Math.abs(input.height!);
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
