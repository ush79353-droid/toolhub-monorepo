import type {
  AbsencePercentageField,
  AbsencePercentageFieldErrors,
  AbsencePercentageInput,
} from './types';

export interface AbsencePercentageValidation {
  isValid: boolean;
  /** True when any required field is still empty (no error yet). */
  incomplete: boolean;
  errors: AbsencePercentageFieldErrors;
  input: AbsencePercentageInput | null;
}

function isBlank(raw: string): boolean {
  return raw.trim() === '';
}

/** Parse a nonnegative whole number; rejects decimals, signs other than leading +, and junk. */
export function parseWholeNumber(
  raw: string,
  options: { allowZero: boolean; fieldLabel: string }
): { value: number | null; blank: boolean; error?: string } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') {
    return { value: null, blank: true };
  }
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, error: `Enter a valid ${options.fieldLabel}.` };
  }
  if (!/^\+?\d+$/.test(cleaned)) {
    return {
      value: null,
      blank: false,
      error: `${options.fieldLabel} must be a whole number.`,
    };
  }
  const value = Number(cleaned);
  if (!Number.isSafeInteger(value)) {
    return {
      value: null,
      blank: false,
      error: `${options.fieldLabel} is too large.`,
    };
  }
  if (value < 0) {
    return {
      value: null,
      blank: false,
      error: `${options.fieldLabel} cannot be negative.`,
    };
  }
  if (!options.allowZero && value === 0) {
    return {
      value: null,
      blank: false,
      error: `${options.fieldLabel} must be greater than zero.`,
    };
  }
  return { value, blank: false };
}

export interface AbsencePercentageDraftStrings {
  totalEmployees: string;
  totalWorkdays: string;
  totalDaysAbsent: string;
}

export function validateAbsencePercentageDraft(
  draft: AbsencePercentageDraftStrings
): AbsencePercentageValidation {
  const errors: AbsencePercentageFieldErrors = {};

  const employees = parseWholeNumber(draft.totalEmployees, {
    allowZero: false,
    fieldLabel: 'Total employees',
  });
  const workdays = parseWholeNumber(draft.totalWorkdays, {
    allowZero: false,
    fieldLabel: 'Total workdays',
  });
  const absent = parseWholeNumber(draft.totalDaysAbsent, {
    allowZero: true,
    fieldLabel: 'Total days absent',
  });

  const anyBlank = employees.blank || workdays.blank || absent.blank;

  if (!employees.blank && employees.error) errors.totalEmployees = employees.error;
  if (!workdays.blank && workdays.error) errors.totalWorkdays = workdays.error;
  if (!absent.blank && absent.error) errors.totalDaysAbsent = absent.error;

  if (anyBlank || Object.keys(errors).length > 0) {
    return {
      isValid: false,
      incomplete: anyBlank && Object.keys(errors).length === 0,
      errors,
      input: null,
    };
  }

  const input: AbsencePercentageInput = {
    totalEmployees: employees.value!,
    totalWorkdays: workdays.value!,
    totalDaysAbsent: absent.value!,
  };

  const available = input.totalEmployees * input.totalWorkdays;
  if (input.totalDaysAbsent > available) {
    errors.totalDaysAbsent = `Total days absent cannot exceed ${available.toLocaleString('en-US')} available employee-workdays.`;
    return { isValid: false, incomplete: false, errors, input: null };
  }

  return { isValid: true, incomplete: false, errors: {}, input };
}

export function clearFieldError(
  errors: AbsencePercentageFieldErrors,
  field: AbsencePercentageField
): AbsencePercentageFieldErrors {
  const next = { ...errors };
  delete next[field];
  return next;
}

export function isBlankDraft(draft: AbsencePercentageDraftStrings): boolean {
  return (
    isBlank(draft.totalEmployees) &&
    isBlank(draft.totalWorkdays) &&
    isBlank(draft.totalDaysAbsent)
  );
}
