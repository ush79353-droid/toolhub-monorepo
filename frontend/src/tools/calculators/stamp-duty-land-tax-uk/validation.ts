import { calculateStampDutyLandTaxUkFromInput } from './calculation';
import type {
  StampDutyLandTaxUkFieldErrors,
  StampDutyLandTaxUkInput,
  StampDutyLandTaxUkResult,
} from './types';

function parseMoney(raw: string): {
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

export interface StampDutyLandTaxUkValidation {
  isValid: boolean;
  errors: StampDutyLandTaxUkFieldErrors;
  result: StampDutyLandTaxUkResult | null;
}

export function collectFieldErrors(
  input: StampDutyLandTaxUkInput,
): StampDutyLandTaxUkFieldErrors {
  const errors: StampDutyLandTaxUkFieldErrors = {};
  const parsed = parseMoney(input.propertyPrice);
  if (parsed.blank) {
    errors.propertyPrice = 'Enter the property price (£).';
  } else if (parsed.invalid || parsed.value == null) {
    errors.propertyPrice = 'Enter a valid property price.';
  } else if (parsed.value < 0) {
    errors.propertyPrice = 'Property price cannot be negative.';
  }
  return errors;
}

export function hasFieldErrors(errors: StampDutyLandTaxUkFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateStampDutyLandTaxUkInput(
  input: StampDutyLandTaxUkInput,
): StampDutyLandTaxUkValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateStampDutyLandTaxUkFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
