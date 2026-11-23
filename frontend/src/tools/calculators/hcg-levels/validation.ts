import { calculateFromInput } from './calculation';
import type {
  HcgLevelsFieldErrors,
  HcgLevelsInput,
  HcgLevelsResult,
} from './types';

export interface HcgLevelsValidation {
  isValid: boolean;
  errors: HcgLevelsFieldErrors;
  result: HcgLevelsResult | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export function validateHcgLevelsInput(
  input: HcgLevelsInput
): HcgLevelsValidation {
  const errors: HcgLevelsFieldErrors = {};
  const first = parseNumber(input.firstLevel);
  const second = parseNumber(input.secondLevel);
  const elapsed = parseNumber(input.elapsedValue);

  if (first.blank || second.blank || elapsed.blank) {
    return { isValid: false, errors, result: null };
  }

  if (first.invalid || first.value === null || first.value <= 0) {
    errors.firstLevel = 'Enter a positive first β-hCG level.';
  }
  if (second.invalid || second.value === null || second.value < 0) {
    errors.secondLevel = 'Enter a valid non-negative second β-hCG level.';
  }
  if (elapsed.invalid || elapsed.value === null || elapsed.value <= 0) {
    errors.elapsedValue = 'Enter a positive time between measurements.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateFromInput(
    input,
    first.value!,
    second.value!,
    elapsed.value!
  );
  if (!result) {
    errors.form = 'Unable to compute serial β-hCG metrics for these inputs.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
