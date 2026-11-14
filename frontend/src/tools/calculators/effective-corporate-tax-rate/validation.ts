import { isSupportedCurrency } from '@/tools/shared/currency';
import { calculateEffectiveCorporateTaxRate } from './calculation';
import type {
  EffectiveCorporateTaxRateFieldErrors,
  EffectiveCorporateTaxRateInput,
} from './types';

function parseNumber(raw: string): { blank: boolean; value: number | null; invalid: boolean } {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return { blank: true, value: null, invalid: false };
  if (/infinity|nan/i.test(trimmed)) {
    return { blank: false, value: null, invalid: true };
  }
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(trimmed)) {
    return { blank: false, value: null, invalid: true };
  }
  const value = Number(trimmed);
  if (!Number.isFinite(value)) {
    return { blank: false, value: null, invalid: true };
  }
  return { blank: false, value, invalid: false };
}

export function validateEffectiveCorporateTaxRateInput(
  input: EffectiveCorporateTaxRateInput
): {
  isValid: boolean;
  errors: EffectiveCorporateTaxRateFieldErrors;
  parsed:
    | {
        earningsBeforeTax: number;
        incomeTaxPaid: number;
        currency: EffectiveCorporateTaxRateInput['currency'];
      }
    | null;
} {
  const errors: EffectiveCorporateTaxRateFieldErrors = {};

  if (!isSupportedCurrency(input.currency)) {
    errors.currency = 'Choose a supported currency';
  }

  const earnings = parseNumber(input.earningsBeforeTax);
  const tax = parseNumber(input.incomeTaxPaid);

  if (earnings.blank || tax.blank) {
    return { isValid: false, errors, parsed: null };
  }

  if (earnings.invalid || earnings.value === null) {
    errors.earningsBeforeTax = 'Enter a valid earnings before tax amount';
  } else if (earnings.value <= 0) {
    errors.earningsBeforeTax = 'Earnings before tax must be greater than zero';
  }

  if (tax.invalid || tax.value === null) {
    errors.incomeTaxPaid = 'Enter a valid income tax paid amount';
  } else if (tax.value < 0) {
    errors.incomeTaxPaid = 'Income tax paid cannot be negative';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, parsed: null };
  }

  const rate = calculateEffectiveCorporateTaxRate(earnings.value!, tax.value!);
  if (!Number.isFinite(rate)) {
    errors.form = 'This combination does not produce a finite effective tax rate.';
    return { isValid: false, errors, parsed: null };
  }

  return {
    isValid: true,
    errors,
    parsed: {
      earningsBeforeTax: earnings.value!,
      incomeTaxPaid: tax.value!,
      currency: input.currency,
    },
  };
}
