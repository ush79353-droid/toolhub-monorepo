import {
  calculateFreeFloat,
  formatFloatPercent,
  formatShareCount,
  interpretFreeFloat,
} from './calculation';
import type {
  FreeFloatFieldErrors,
  FreeFloatInput,
  FreeFloatResult,
} from './types';

export interface FreeFloatValidation {
  isValid: boolean;
  errors: FreeFloatFieldErrors;
  result: FreeFloatResult | null;
}

function parseWholeShare(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
  fractional: boolean;
  unsafe: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') {
    return {
      value: null,
      blank: true,
      invalid: false,
      fractional: false,
      unsafe: false,
    };
  }
  if (/infinity|nan/i.test(cleaned)) {
    return {
      value: null,
      blank: false,
      invalid: true,
      fractional: false,
      unsafe: false,
    };
  }
  if (!/^-?\d+(\.0+)?$/.test(cleaned) && !/^-?\d+$/.test(cleaned)) {
    // Allow integer strings; reject clear fractions like 1.5
    if (/^-?\d+\.\d*[1-9]\d*$/.test(cleaned)) {
      return {
        value: null,
        blank: false,
        invalid: false,
        fractional: true,
        unsafe: false,
      };
    }
    const n = Number(cleaned);
    if (!Number.isFinite(n)) {
      return {
        value: null,
        blank: false,
        invalid: true,
        fractional: false,
        unsafe: false,
      };
    }
    if (!Number.isInteger(n)) {
      return {
        value: null,
        blank: false,
        invalid: false,
        fractional: true,
        unsafe: false,
      };
    }
    if (!Number.isSafeInteger(n)) {
      return {
        value: null,
        blank: false,
        invalid: false,
        fractional: false,
        unsafe: true,
      };
    }
    return {
      value: n,
      blank: false,
      invalid: false,
      fractional: false,
      unsafe: false,
    };
  }

  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return {
      value: null,
      blank: false,
      invalid: true,
      fractional: false,
      unsafe: false,
    };
  }
  if (!Number.isInteger(value)) {
    return {
      value: null,
      blank: false,
      invalid: false,
      fractional: true,
      unsafe: false,
    };
  }
  if (!Number.isSafeInteger(value)) {
    return {
      value: null,
      blank: false,
      invalid: false,
      fractional: false,
      unsafe: true,
    };
  }
  return {
    value,
    blank: false,
    invalid: false,
    fractional: false,
    unsafe: false,
  };
}

export function validateFreeFloatInput(
  input: FreeFloatInput
): FreeFloatValidation {
  const errors: FreeFloatFieldErrors = {};
  let hasFieldError = false;

  const outstanding = parseWholeShare(input.outstandingShares);
  if (outstanding.blank) {
    errors.outstandingShares = 'Enter outstanding shares.';
    hasFieldError = true;
  } else if (outstanding.fractional) {
    errors.outstandingShares =
      'Outstanding shares must be a whole number (no fractions).';
    hasFieldError = true;
  } else if (outstanding.unsafe) {
    errors.outstandingShares =
      'Outstanding shares exceed the supported numeric range.';
    hasFieldError = true;
  } else if (outstanding.invalid || outstanding.value === null) {
    errors.outstandingShares = 'Enter a valid whole number of shares.';
    hasFieldError = true;
  } else if (outstanding.value <= 0) {
    errors.outstandingShares = 'Outstanding shares must be greater than zero.';
    hasFieldError = true;
  }

  const restricted = parseWholeShare(input.restrictedShares);
  if (restricted.blank) {
    errors.restrictedShares = 'Enter restricted shares (use 0 if none).';
    hasFieldError = true;
  } else if (restricted.fractional) {
    errors.restrictedShares =
      'Restricted shares must be a whole number (no fractions).';
    hasFieldError = true;
  } else if (restricted.unsafe) {
    errors.restrictedShares =
      'Restricted shares exceed the supported numeric range.';
    hasFieldError = true;
  } else if (restricted.invalid || restricted.value === null) {
    errors.restrictedShares = 'Enter a valid whole number of shares.';
    hasFieldError = true;
  } else if (restricted.value < 0) {
    errors.restrictedShares = 'Restricted shares cannot be negative.';
    hasFieldError = true;
  }

  const closely = parseWholeShare(input.closelyHeldShares);
  if (closely.blank) {
    errors.closelyHeldShares = 'Enter closely held shares (use 0 if none).';
    hasFieldError = true;
  } else if (closely.fractional) {
    errors.closelyHeldShares =
      'Closely held shares must be a whole number (no fractions).';
    hasFieldError = true;
  } else if (closely.unsafe) {
    errors.closelyHeldShares =
      'Closely held shares exceed the supported numeric range.';
    hasFieldError = true;
  } else if (closely.invalid || closely.value === null) {
    errors.closelyHeldShares = 'Enter a valid whole number of shares.';
    hasFieldError = true;
  } else if (closely.value < 0) {
    errors.closelyHeldShares = 'Closely held shares cannot be negative.';
    hasFieldError = true;
  }

  if (
    !hasFieldError &&
    outstanding.value != null &&
    restricted.value != null &&
    closely.value != null
  ) {
    const totalExcluded = restricted.value + closely.value;
    if (!Number.isSafeInteger(totalExcluded)) {
      errors.form =
        'Total excluded shares exceed the supported numeric range.';
      hasFieldError = true;
    } else if (totalExcluded > outstanding.value) {
      errors.form =
        'Restricted and closely held shares cannot exceed outstanding shares.';
      hasFieldError = true;
    }
  }

  if (hasFieldError) {
    return { isValid: false, errors, result: null };
  }

  if (
    outstanding.value === null ||
    restricted.value === null ||
    closely.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const math = calculateFreeFloat({
    outstandingShares: outstanding.value,
    restrictedShares: restricted.value,
    closelyHeldShares: closely.value,
  });

  if (math === null) {
    errors.form = 'Unable to calculate free float with these inputs.';
    return { isValid: false, errors, result: null };
  }

  const result: FreeFloatResult = {
    freeFloat: math.freeFloat,
    freeFloatPercentage: math.freeFloatPercentage,
    formattedFreeFloat: formatShareCount(math.freeFloat),
    formattedPercentage: `${formatFloatPercent(math.freeFloatPercentage)}%`,
    interpretation: interpretFreeFloat(
      math.freeFloat,
      math.freeFloatPercentage
    ),
    warningMessage:
      'Count restricted and closely held shares as mutually exclusive categories — do not double-count the same share in both.',
  };

  return { isValid: true, errors, result };
}
