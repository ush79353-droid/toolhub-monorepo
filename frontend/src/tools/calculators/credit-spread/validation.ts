import { calculateCreditSpread } from './calculation';
import type {
  CreditSpreadFieldErrors,
  CreditSpreadInput,
  CreditSpreadResult,
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

const MAX_ABS = 1e6;

export interface CreditSpreadValidation {
  isValid: boolean;
  errors: CreditSpreadFieldErrors;
  result: CreditSpreadResult | null;
}

export function collectFieldErrors(
  input: CreditSpreadInput,
): CreditSpreadFieldErrors {
  const errors: CreditSpreadFieldErrors = {};
  const { solveTarget } = input;

  if (
    input.spreadInputUnit !== 'percentagePoints' &&
    input.spreadInputUnit !== 'basisPoints'
  ) {
    errors.creditSpread = 'Select percentage points or basis points.';
  }

  const corp = parseNumber(input.corporateBondYield);
  const gov = parseNumber(input.governmentBondYield);
  const spread = parseNumber(input.creditSpread);

  const needCorp =
    solveTarget === 'spread' || solveTarget === 'governmentYield';
  const needGov =
    solveTarget === 'spread' || solveTarget === 'corporateYield';
  const needSpread =
    solveTarget === 'corporateYield' || solveTarget === 'governmentYield';

  if (needCorp) {
    if (corp.blank) {
      errors.corporateBondYield = 'Enter the corporate bond yield (%).';
    } else if (corp.invalid || corp.value == null) {
      errors.corporateBondYield =
        'Enter a valid corporate bond yield (negative yields allowed).';
    } else if (Math.abs(corp.value) > MAX_ABS) {
      errors.corporateBondYield = 'Corporate bond yield is out of range.';
    }
  }

  if (needGov) {
    if (gov.blank) {
      errors.governmentBondYield = 'Enter the government bond yield (%).';
    } else if (gov.invalid || gov.value == null) {
      errors.governmentBondYield =
        'Enter a valid government bond yield (negative yields allowed).';
    } else if (Math.abs(gov.value) > MAX_ABS) {
      errors.governmentBondYield = 'Government bond yield is out of range.';
    }
  }

  if (needSpread) {
    if (spread.blank) {
      errors.creditSpread =
        input.spreadInputUnit === 'basisPoints'
          ? 'Enter the credit spread in basis points.'
          : 'Enter the credit spread in percentage points.';
    } else if (spread.invalid || spread.value == null) {
      errors.creditSpread = 'Enter a valid credit spread.';
    } else if (Math.abs(spread.value) > MAX_ABS * 100) {
      errors.creditSpread = 'Credit spread is out of range.';
    }
  }

  return errors;
}

export function hasFieldErrors(errors: CreditSpreadFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateCreditSpreadInput(
  input: CreditSpreadInput,
): CreditSpreadValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateCreditSpread(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
