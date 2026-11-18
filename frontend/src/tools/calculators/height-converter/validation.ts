import { MAX_ABS_VALUE, type HeightFieldErrors, type HeightInput } from './types';

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

function lengthProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

function applyError(
  errors: HeightFieldErrors,
  field: keyof HeightFieldErrors,
  state: ReturnType<typeof lengthProblem>,
  labels: { bad: string; negative: string; large: string },
): boolean {
  if (state === 'blank') return true;
  if (state === 'bad') errors[field] = labels.bad;
  else if (state === 'negative') errors[field] = labels.negative;
  else if (state === 'large') errors[field] = labels.large;
  return false;
}

function validateCompound(
  errors: HeightFieldErrors,
  a: number | null,
  b: number | null,
  aField: keyof HeightFieldErrors,
  bField: keyof HeightFieldErrors,
  aLabels: { bad: string; negative: string; large: string },
  bLabels: { bad: string; negative: string; large: string },
): boolean {
  const aState = lengthProblem(a);
  const bState = lengthProblem(b);
  if (aState === 'blank' && bState === 'blank') return true;
  if (aState !== 'blank' && aState !== 'ok') {
    applyError(errors, aField, aState, aLabels);
  }
  if (bState !== 'blank' && bState !== 'ok') {
    applyError(errors, bField, bState, bLabels);
  }
  return false;
}

export function validateHeight(input: HeightInput): {
  isValid: boolean;
  errors: HeightFieldErrors;
} {
  const errors: HeightFieldErrors = {};
  let blank = false;

  if (input.source === 'centimeters') {
    blank = applyError(errors, 'centimeters', lengthProblem(input.centimeters), {
      bad: 'Enter a valid height in centimeters.',
      negative: 'Height cannot be negative.',
      large: 'Enter a smaller value.',
    });
  } else if (input.source === 'meters') {
    blank = applyError(errors, 'meters', lengthProblem(input.meters), {
      bad: 'Enter a valid height in meters.',
      negative: 'Height cannot be negative.',
      large: 'Enter a smaller value.',
    });
  } else if (input.source === 'metersCm') {
    blank = validateCompound(
      errors,
      input.metersPart,
      input.centimetersPart,
      'metersPart',
      'centimetersPart',
      {
        bad: 'Enter a valid number of meters.',
        negative: 'Meters cannot be negative.',
        large: 'Enter a smaller value.',
      },
      {
        bad: 'Enter a valid number of centimeters.',
        negative: 'Centimeters cannot be negative.',
        large: 'Enter a smaller value.',
      },
    );
  } else if (input.source === 'inches') {
    blank = applyError(errors, 'inches', lengthProblem(input.inches), {
      bad: 'Enter a valid height in inches.',
      negative: 'Height cannot be negative.',
      large: 'Enter a smaller value.',
    });
  } else if (input.source === 'feet') {
    blank = applyError(errors, 'feet', lengthProblem(input.feet), {
      bad: 'Enter a valid height in feet.',
      negative: 'Height cannot be negative.',
      large: 'Enter a smaller value.',
    });
  } else if (input.source === 'feetInches') {
    blank = validateCompound(
      errors,
      input.feetPart,
      input.inchesPart,
      'feetPart',
      'inchesPart',
      {
        bad: 'Enter a valid number of feet.',
        negative: 'Feet cannot be negative.',
        large: 'Enter a smaller value.',
      },
      {
        bad: 'Enter a valid number of inches.',
        negative: 'Inches cannot be negative.',
        large: 'Enter a smaller value.',
      },
    );
  } else {
    blank = applyError(errors, 'otherValue', lengthProblem(input.otherValue), {
      bad: 'Enter a valid height.',
      negative: 'Height cannot be negative.',
      large: 'Enter a smaller value.',
    });
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
