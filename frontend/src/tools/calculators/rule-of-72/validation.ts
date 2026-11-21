import { calculateRuleOf72 } from './calculation';
import type {
  RuleOf72FieldErrors,
  RuleOf72Input,
  RuleOf72Result,
} from './types';

const MIN_ABS = 1e-12;
const MAX_ABS = 1e12;

function parseAmount(raw: string): {
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

export interface RuleOf72Validation {
  isValid: boolean;
  errors: RuleOf72FieldErrors;
  result: RuleOf72Result | null;
}

export function collectFieldErrors(input: RuleOf72Input): RuleOf72FieldErrors {
  const errors: RuleOf72FieldErrors = {};
  const field = input.lastEdited;
  const raw =
    field === 'increase' ? input.increasePercent : input.doublingTime;
  const parsed = parseAmount(raw);
  const key = field === 'increase' ? 'increasePercent' : 'doublingTime';

  if (parsed.blank) return errors;
  if (parsed.invalid || parsed.value == null) {
    errors[key] =
      field === 'increase'
        ? 'Enter a valid positive percent per period.'
        : 'Enter a valid positive number of periods.';
    return errors;
  }
  if (parsed.value <= 0) {
    errors[key] =
      field === 'increase'
        ? 'Increase must be greater than zero.'
        : 'Doubling time must be greater than zero.';
    return errors;
  }
  if (parsed.value < MIN_ABS || parsed.value > MAX_ABS) {
    errors[key] = 'Value is out of a usable range for the Rule of 72.';
  }
  return errors;
}

export function hasFieldErrors(errors: RuleOf72FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateRuleOf72Input(
  input: RuleOf72Input,
): RuleOf72Validation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const sourceRaw =
    input.lastEdited === 'increase'
      ? input.increasePercent
      : input.doublingTime;
  if (sourceRaw.trim() === '') {
    return { isValid: false, errors: {}, result: null };
  }
  const result = calculateRuleOf72(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
