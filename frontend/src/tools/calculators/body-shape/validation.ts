import { calculateBodyShape, parseNumber } from './calculation';
import type {
  BodyShapeFieldErrors,
  BodyShapeInput,
  BodyShapeResult,
} from './types';

export interface BodyShapeValidation {
  errors: BodyShapeFieldErrors;
  result: BodyShapeResult | null;
}

const FIELDS: ReadonlyArray<
  [keyof BodyShapeFieldErrors, keyof BodyShapeInput, string]
> = [
  ['bustText', 'bustText', 'bust size'],
  ['waistText', 'waistText', 'waist size'],
  ['highHipText', 'highHipText', 'high hip size'],
  ['hipText', 'hipText', 'hip size'],
];

export function validateBodyShapeInput(
  input: BodyShapeInput,
  opts: { requireComplete?: boolean } = {},
): BodyShapeValidation {
  const errors: BodyShapeFieldErrors = {};
  const requireComplete = opts.requireComplete ?? false;

  for (const [errKey, textKey, label] of FIELDS) {
    const filled = input[textKey].trim() !== '';
    if (filled || requireComplete) {
      const n = parseNumber(input[textKey]);
      if (n === null) errors[errKey] = `Enter a valid ${label}.`;
      else if (!(n > 0)) errors[errKey] = `${label} must be greater than zero.`;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  const allComplete = FIELDS.every(([, textKey]) => input[textKey].trim() !== '');
  if (!allComplete) {
    if (requireComplete) {
      for (const [errKey, textKey, label] of FIELDS) {
        if (input[textKey].trim() === '') errors[errKey] = `Enter ${label}.`;
      }
      return { errors, result: null };
    }
    return { errors: {}, result: null };
  }

  return { errors: {}, result: calculateBodyShape(input) };
}