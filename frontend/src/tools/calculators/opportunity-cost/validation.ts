import { calculateOpportunityCost } from './calculation';
import type {
  OpportunityCostFieldErrors,
  OpportunityCostInput,
  OpportunityCostResult,
} from './types';

export interface OpportunityCostValidation {
  isValid: boolean;
  errors: OpportunityCostFieldErrors;
  result: OpportunityCostResult | null;
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

function parseNonNegative(
  raw: string,
  label: string
): { value: number | null; blank: boolean; error?: string } {
  const parsed = parseNumber(raw);
  if (parsed.blank) return { value: 0, blank: true };
  if (parsed.invalid || parsed.value === null) {
    return { value: null, blank: false, error: `Enter a valid ${label}.` };
  }
  if (parsed.value < 0) {
    return { value: null, blank: false, error: `${label} cannot be negative.` };
  }
  return { value: parsed.value, blank: false };
}

export function validateOpportunityCostInput(
  input: OpportunityCostInput
): OpportunityCostValidation {
  const errors: OpportunityCostFieldErrors = {};

  const money = parseNonNegative(input.moneyToSpend, 'Money to spend');
  const annualReturn = parseNumber(input.annualReturn);
  const years = parseNonNegative(input.years, 'Years');
  const months = parseNonNegative(input.months, 'Months');
  const incomeTax = parseNumber(input.incomeTax);
  const inflation = parseNumber(input.inflation);

  if (money.error) errors.moneyToSpend = money.error;

  if (annualReturn.blank) {
    // keep incomplete
  } else if (annualReturn.invalid || annualReturn.value === null) {
    errors.annualReturn = 'Enter a valid annual return.';
  }

  if (years.error) errors.years = years.error;
  if (months.error) errors.months = months.error;

  if (incomeTax.blank) {
    // incomplete
  } else if (incomeTax.invalid || incomeTax.value === null) {
    errors.incomeTax = 'Enter a valid income tax.';
  } else if (incomeTax.value < 0 || incomeTax.value > 100) {
    errors.incomeTax = 'Income tax must be between 0% and 100%.';
  }

  if (inflation.blank) {
    // incomplete
  } else if (inflation.invalid || inflation.value === null) {
    errors.inflation = 'Enter a valid inflation rate.';
  } else if (!(inflation.value > -100)) {
    errors.inflation = 'Inflation rate must be greater than −100%.';
  }

  const durationBlank = years.blank && months.blank;
  const incomplete =
    money.blank ||
    annualReturn.blank ||
    durationBlank ||
    incomeTax.blank ||
    inflation.blank ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateOpportunityCost(
    money.value!,
    annualReturn.value!,
    years.value!,
    months.value!,
    incomeTax.value!,
    inflation.value!,
    input.currency
  );

  if (!result) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
