import { calculateAdrenalWashout, parseNumber } from './calculation';
import type {
  AdrenalWashoutFieldErrors,
  AdrenalWashoutInput,
  AdrenalWashoutResult,
} from './types';

export interface AdrenalWashoutValidation {
  errors: AdrenalWashoutFieldErrors;
  result: AdrenalWashoutResult | null;
}

const HU_MIN = -200;
const HU_MAX = 500;

function huFieldError(raw: string, label: string): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label} in HU.`;
  if (!(n >= HU_MIN && n <= HU_MAX)) {
    return `${label} must be between ${HU_MIN} and ${HU_MAX} HU.`;
  }
  return undefined;
}

export function validateAdrenalWashoutInput(
  input: AdrenalWashoutInput,
): AdrenalWashoutValidation {
  const errors: AdrenalWashoutFieldErrors = {};

  const preErr = huFieldError(input.preContrastHuText, 'pre-contrast HU');
  if (preErr) errors.preContrastHuText = preErr;

  const enhErr = huFieldError(input.enhancedHuText, 'post-contrast HU');
  if (enhErr) errors.enhancedHuText = enhErr;

  const delErr = huFieldError(input.delayedHuText, 'delayed HU');
  if (delErr) errors.delayedHuText = delErr;

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return {
    errors: {},
    result: calculateAdrenalWashout(input),
  };
}
