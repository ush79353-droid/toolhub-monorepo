import {
  MAX_ABS_VALUE,
  type CmHeightFieldErrors,
  type CmHeightInput,
} from './types';

/** Half-typed values such as `1.` stay incomplete so the source field is not overwritten. */
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

function lengthProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

function applyLengthError(
  errors: CmHeightFieldErrors,
  field: keyof CmHeightFieldErrors,
  state: ReturnType<typeof lengthProblem>,
  labels: { bad: string; negative: string; large: string },
): boolean {
  if (state === 'blank') return true;
  if (state === 'bad') errors[field] = labels.bad;
  else if (state === 'negative') errors[field] = labels.negative;
  else if (state === 'large') errors[field] = labels.large;
  return false;
}

export function validateCmHeight(input: CmHeightInput): {
  isValid: boolean;
  errors: CmHeightFieldErrors;
} {
  const errors: CmHeightFieldErrors = {};
  let blank = false;

  if (input.source === 'feetInches') {
    const feetState = lengthProblem(input.feet);
    const inchesState = lengthProblem(input.inches);

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
  } else if (input.source === 'centimeters') {
    blank = applyLengthError(errors, 'centimeters', lengthProblem(input.centimeters), {
      bad: 'Enter a valid height in centimeters.',
      negative: 'Height cannot be negative.',
      large: 'Enter a smaller value.',
    });
  } else if (input.source === 'meters') {
    blank = applyLengthError(errors, 'meters', lengthProblem(input.meters), {
      bad: 'Enter a valid height in meters.',
      negative: 'Height cannot be negative.',
      large: 'Enter a smaller value.',
    });
  } else if (input.source === 'millimeters') {
    blank = applyLengthError(errors, 'millimeters', lengthProblem(input.millimeters), {
      bad: 'Enter a valid height in millimeters.',
      negative: 'Height cannot be negative.',
      large: 'Enter a smaller value.',
    });
  } else if (input.source === 'totalInches') {
    blank = applyLengthError(errors, 'totalInches', lengthProblem(input.totalInches), {
      bad: 'Enter a valid height in inches.',
      negative: 'Height cannot be negative.',
      large: 'Enter a smaller value.',
    });
  } else {
    blank = applyLengthError(errors, 'decimalFeet', lengthProblem(input.decimalFeet), {
      bad: 'Enter a valid height in decimal feet.',
      negative: 'Height cannot be negative.',
      large: 'Enter a smaller value.',
    });
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
