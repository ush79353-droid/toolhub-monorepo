import { calculateMilesToDollarsFromInput } from './calculation';
import type {
  MilesToDollarsFieldErrors,
  MilesToDollarsInput,
  MilesToDollarsResult,
} from './types';

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

export interface MilesToDollarsValidation {
  isValid: boolean;
  errors: MilesToDollarsFieldErrors;
  result: MilesToDollarsResult | null;
}

export function collectFieldErrors(
  input: MilesToDollarsInput,
): MilesToDollarsFieldErrors {
  const errors: MilesToDollarsFieldErrors = {};

  const v = parseNumber(input.valuePerMile);
  if (!v.blank) {
    if (v.invalid || v.value == null) {
      errors.valuePerMile = 'Please enter a valid miles value.';
    } else if (!(v.value > 0)) {
      errors.valuePerMile = 'Miles value must be greater than zero.';
    }
  }

  const m = parseNumber(input.milesRequired);
  if (!m.blank) {
    if (m.invalid || m.value == null) {
      errors.milesRequired = 'Please enter a valid mile quantity.';
    } else if (m.value < 0) {
      errors.milesRequired = 'Miles cannot be negative.';
    }
  }

  const f = parseNumber(input.additionalFees);
  if (!f.blank) {
    if (f.invalid || f.value == null) {
      errors.additionalFees = 'Please enter a valid fee amount.';
    } else if (f.value < 0) {
      errors.additionalFees = 'Fees cannot be negative.';
    }
  }

  const c = parseNumber(input.cashTicketPrice);
  if (!c.blank) {
    if (c.invalid || c.value == null) {
      errors.cashTicketPrice = 'Please enter a valid cash price.';
    } else if (c.value < 0) {
      errors.cashTicketPrice = 'Cash price cannot be negative.';
    }
  }

  if (input.showConvert) {
    const cm = parseNumber(input.convertMiles);
    if (!cm.blank) {
      if (cm.invalid || cm.value == null || cm.value < 0) {
        errors.convertMiles = 'Miles balance cannot be negative.';
      }
    }
  }

  if (input.showCompare) {
    const bm = parseNumber(input.optionBMiles);
    if (!bm.blank) {
      if (bm.invalid || bm.value == null || bm.value < 0) {
        errors.optionBMiles = 'Option B miles cannot be negative.';
      }
    }
    const bf = parseNumber(input.optionBFees);
    if (!bf.blank) {
      if (bf.invalid || bf.value == null || bf.value < 0) {
        errors.optionBFees = 'Option B fees cannot be negative.';
      }
    }
    const bc = parseNumber(input.optionBCash);
    if (!bc.blank) {
      if (bc.invalid || bc.value == null || bc.value < 0) {
        errors.optionBCash = 'Option B cash price cannot be negative.';
      }
    }
  }

  if (input.showTarget) {
    const t = parseNumber(input.targetDollars);
    if (!t.blank) {
      if (t.invalid || t.value == null || t.value < 0) {
        errors.targetDollars = 'Target value cannot be negative.';
      }
    }
  }

  return errors;
}

export function validateMilesToDollarsInputs(
  input: MilesToDollarsInput,
): MilesToDollarsValidation {
  const errors = collectFieldErrors(input);

  if (
    parseNumber(input.valuePerMile).blank ||
    parseNumber(input.milesRequired).blank ||
    parseNumber(input.additionalFees).blank ||
    parseNumber(input.cashTicketPrice).blank
  ) {
    return { isValid: false, errors, result: null };
  }

  if (input.showConvert && parseNumber(input.convertMiles).blank) {
    return { isValid: false, errors, result: null };
  }

  if (input.showCompare) {
    if (
      parseNumber(input.optionBMiles).blank ||
      parseNumber(input.optionBFees).blank ||
      parseNumber(input.optionBCash).blank
    ) {
      return { isValid: false, errors, result: null };
    }
  }

  if (input.showTarget && parseNumber(input.targetDollars).blank) {
    return { isValid: false, errors, result: null };
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateMilesToDollarsFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
