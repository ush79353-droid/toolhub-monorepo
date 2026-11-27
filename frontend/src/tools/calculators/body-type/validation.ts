import { calculateBodyType, parseNumber } from './calculation';
import type {
  BodyTypeFieldErrors,
  BodyTypeInput,
  BodyTypeResult,
} from './types';

export interface BodyTypeValidation {
  errors: BodyTypeFieldErrors;
  result: BodyTypeResult | null;
}

export function validateBodyTypeInput(
  input: BodyTypeInput,
  options?: { requireComplete?: boolean },
): BodyTypeValidation {
  const requireComplete = options?.requireComplete ?? false;
  const errors: BodyTypeFieldErrors = {};

  const check = (
    key: keyof BodyTypeFieldErrors,
    raw: string,
    label: string,
  ) => {
    if (raw.trim() === '') {
      if (requireComplete) errors[key] = `Enter ${label}.`;
      return;
    }
    const n = parseNumber(raw);
    if (n === null) errors[key] = `Enter a valid ${label}.`;
    else if (!(n > 0)) errors[key] = `${label} must be greater than zero.`;
  };

  check('bustText', input.bustText, 'bust size');
  check('waistText', input.waistText, 'waist size');
  check('highHipText', input.highHipText, 'high hip size');
  check('hipText', input.hipText, 'hip size');

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  if (
    requireComplete &&
    (input.bustText.trim() === '' ||
      input.waistText.trim() === '' ||
      input.highHipText.trim() === '' ||
      input.hipText.trim() === '')
  ) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateBodyType(input),
  };
}
