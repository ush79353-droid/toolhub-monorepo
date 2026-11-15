import type {
  BradfordFactorFieldErrors,
  BradfordFactorInput,
} from './types';

export interface BradfordFactorDraftStrings {
  spells: string;
  daysAbsent: string;
}

export interface BradfordFactorValidation {
  isValid: boolean;
  incomplete: boolean;
  errors: BradfordFactorFieldErrors;
  input: BradfordFactorInput | null;
}

function parseNonNegative(raw: string, fieldLabel: string): {
  value: number | null;
  blank: boolean;
  error?: string;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, error: `Enter a valid ${fieldLabel}.` };
  }
  if (!/^\+?\d+(\.\d+)?$/.test(cleaned)) {
    return {
      value: null,
      blank: false,
      error: `${fieldLabel} must be a non-negative number.`,
    };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, error: `Enter a valid ${fieldLabel}.` };
  }
  if (value < 0) {
    return { value: null, blank: false, error: `${fieldLabel} cannot be negative.` };
  }
  return { value, blank: false };
}

export function validateBradfordFactorDraft(
  draft: BradfordFactorDraftStrings
): BradfordFactorValidation {
  const errors: BradfordFactorFieldErrors = {};
  const spells = parseNonNegative(draft.spells, '# of times absent');
  const days = parseNonNegative(draft.daysAbsent, 'Days absent');
  const anyBlank = spells.blank || days.blank;

  if (!spells.blank && spells.error) errors.spells = spells.error;
  if (!days.blank && days.error) errors.daysAbsent = days.error;

  if (anyBlank || Object.keys(errors).length > 0) {
    return {
      isValid: false,
      incomplete: anyBlank && Object.keys(errors).length === 0,
      errors,
      input: null,
    };
  }

  return {
    isValid: true,
    incomplete: false,
    errors: {},
    input: { spells: spells.value!, daysAbsent: days.value! },
  };
}
