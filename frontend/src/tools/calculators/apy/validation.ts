import { calculateApy } from './calculation';
import type { ApyFieldErrors, ApyInput, ApyResult } from './types';

export interface ApyValidation {
  isValid: boolean;
  errors: ApyFieldErrors;
  result: ApyResult | null;
}

function parseNumber(raw: string): { value: number | null; blank: boolean; invalid: boolean } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

export function validateApyInput(input: ApyInput): ApyValidation {
  const errors: ApyFieldErrors = {};

  const deposit = parseNumber(input.initialDeposit);
  const apr = parseNumber(input.aprPercent);
  const term = parseNumber(input.term);

  if (!deposit.blank && (deposit.invalid || deposit.value === null)) {
    errors.initialDeposit = 'Enter a valid initial deposit.';
  } else if (!deposit.blank && deposit.value !== null && !(deposit.value > 0)) {
    errors.initialDeposit = 'Initial deposit must be greater than zero.';
  }

  if (!apr.blank && (apr.invalid || apr.value === null)) {
    errors.aprPercent = 'Enter a valid APR.';
  } else if (!apr.blank && apr.value !== null && !(apr.value > -100)) {
    errors.aprPercent = 'APR must be greater than −100%.';
  }

  if (!term.blank && (term.invalid || term.value === null)) {
    errors.term = 'Enter a valid term.';
  } else if (!term.blank && term.value !== null && term.value < 0) {
    errors.term = 'Term cannot be negative.';
  }

  const incomplete =
    deposit.blank || apr.blank || term.blank || Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateApy(
    deposit.value!,
    apr.value!,
    input.compoundFrequency,
    term.value!,
    input.termUnit,
    input.currency
  );

  if (!result) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
