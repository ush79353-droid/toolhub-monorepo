import {
  MAX_ABS_VALUE,
  type HeightInInchesFieldErrors,
  type HeightInInchesInput,
} from './types';

/** Half-typed values such as `1.` stay incomplete so the source field is not overwritten. */
export function isIncompleteNumber(raw: string): boolean {
  const cleaned = raw.trim();
  return (
    cleaned === '' ||
    cleaned === '.' ||
    cleaned === '-' ||
    cleaned === '-.' ||
    cleaned.endsWith('.')
  );
}

/** Blank and incomplete drafts become null. Any other non-number becomes NaN. */
export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim();
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

function applyLengthError(
  errors: HeightInInchesFieldErrors,
  field: keyof HeightInInchesFieldErrors,
  state: ReturnType<typeof lengthProblem>,
  labels: { bad: string; negative: string; large: string }
): boolean {
  if (state === 'blank') return true;
  if (state === 'bad') errors[field] = labels.bad;
  else if (state === 'negative') errors[field] = labels.negative;
  else if (state === 'large') errors[field] = labels.large;
  return false;
}

export function validateHeightInInches(input: HeightInInchesInput): {
  isValid: boolean;
  errors: HeightInInchesFieldErrors;
} {
  const errors: HeightInInchesFieldErrors = {};
  let blank = false;

  if (input.source === 'feetInches') {
    const feetState = lengthProblem(input.feet);
    const inchesState = lengthProblem(input.inches);

    // Both blank → incomplete. One blank is treated as 0 by the engine.
    if (feetState === 'blank' && inchesState === 'blank') {
      blank = true;
    } else {
      if (feetState !== 'blank' && feetState !== 'ok') {
        applyLengthError(errors, 'feet', feetState, {
          bad: 'Enter a valid number of feet.',
          negative: 'Feet cannot be negative.',
          large: 'Enter a smaller value.',
        });
      }
      if (inchesState !== 'blank' && inchesState !== 'ok') {
        applyLengthError(errors, 'inches', inchesState, {
          bad: 'Enter a valid number of inches.',
          negative: 'Inches cannot be negative.',
          large: 'Enter a smaller value.',
        });
      }
    }
  } else if (input.source === 'totalInches') {
    blank = applyLengthError(errors, 'totalInches', lengthProblem(input.totalInches), {
      bad: 'Enter a valid number of inches.',
      negative: 'Height cannot be negative.',
      large: 'Enter a smaller value.',
    });
  } else if (input.source === 'centimeters') {
    blank = applyLengthError(errors, 'centimeters', lengthProblem(input.centimeters), {
      bad: 'Enter a valid number of centimeters.',
      negative: 'Height cannot be negative.',
      large: 'Enter a smaller value.',
    });
  } else {
    blank = applyLengthError(errors, 'meters', lengthProblem(input.meters), {
      bad: 'Enter a valid number of meters.',
      negative: 'Height cannot be negative.',
      large: 'Enter a smaller value.',
    });
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
