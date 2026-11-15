import {
  MAX_ABS_VALUE,
  type AdditionFieldErrors,
  type AdditionInput,
  type EquivalenceFieldErrors,
  type EquivalenceInput,
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

function numProblem(
  value: number | null,
  opts: { allowBlank?: boolean } = {}
): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return opts.allowBlank ? 'ok' : 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateEquivalence(input: EquivalenceInput): {
  isValid: boolean;
  errors: EquivalenceFieldErrors;
} {
  const errors: EquivalenceFieldErrors = {};
  let blank = false;

  const check = (
    value: number | null,
    key: keyof EquivalenceFieldErrors,
    label: string
  ) => {
    const p = numProblem(value);
    if (p === 'blank') blank = true;
    else if (p === 'bad') errors[key] = `Enter a valid ${label}.`;
    else if (p === 'negative') errors[key] = `${label} cannot be negative.`;
    else if (p === 'large') errors[key] = `Enter a smaller ${label}.`;
  };

  switch (input.source) {
    case 'pounds':
      check(input.pounds, 'pounds', 'pounds');
      break;
    case 'ounces':
      check(input.ounces, 'ounces', 'ounces');
      break;
    case 'mixed': {
      const p = numProblem(input.mixedPounds, { allowBlank: true });
      const o = numProblem(input.mixedOunces, { allowBlank: true });
      if (input.mixedPounds === null && input.mixedOunces === null) blank = true;
      if (p === 'bad') errors.mixedPounds = 'Enter a valid pounds value.';
      else if (p === 'negative') errors.mixedPounds = 'Pounds cannot be negative.';
      else if (p === 'large') errors.mixedPounds = 'Enter a smaller pounds value.';
      if (o === 'bad') errors.mixedOunces = 'Enter a valid ounces value.';
      else if (o === 'negative') errors.mixedOunces = 'Ounces cannot be negative.';
      else if (o === 'large') errors.mixedOunces = 'Enter a smaller ounces value.';
      break;
    }
    case 'metric':
      check(input.metric, 'metric', 'metric mass');
      break;
    case 'stones':
      check(input.stones, 'stones', 'stones');
      break;
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}

export function validateAddition(input: AdditionInput): {
  isValid: boolean;
  errors: AdditionFieldErrors;
} {
  const errors: AdditionFieldErrors = {};
  let anyComplete = false;

  for (const row of input.rows) {
    const p = numProblem(row.pounds, { allowBlank: true });
    const o = numProblem(row.ounces, { allowBlank: true });
    if (row.pounds !== null || row.ounces !== null) anyComplete = true;

    if (p === 'bad') errors[`${row.id}:pounds`] = 'Enter a valid pounds value.';
    else if (p === 'negative') errors[`${row.id}:pounds`] = 'Pounds cannot be negative.';
    else if (p === 'large') errors[`${row.id}:pounds`] = 'Enter a smaller pounds value.';

    if (o === 'bad') errors[`${row.id}:ounces`] = 'Enter a valid ounces value.';
    else if (o === 'negative') errors[`${row.id}:ounces`] = 'Ounces cannot be negative.';
    else if (o === 'large') errors[`${row.id}:ounces`] = 'Enter a smaller ounces value.';
  }

  return {
    isValid: Object.keys(errors).length === 0 && anyComplete,
    errors,
  };
}
