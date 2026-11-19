import {
  calculateVatFromGross,
  calculateVatFromNet,
} from './calculation';
import type { VatFieldErrors, VatInput, VatResult } from './types';

function parseNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return null;
  return value;
}

export function validateVatInput(input: VatInput): {
  isValid: boolean;
  errors: VatFieldErrors;
  result: VatResult | null;
} {
  const errors: VatFieldErrors = {};
  const vatRate = parseNumber(input.vatRate);

  if (vatRate === null) {
    errors.vatRate = 'Enter a VAT rate.';
  } else if (!(vatRate > -100)) {
    errors.vatRate = 'VAT rate must be greater than −100%.';
  }

  let source: number | null = null;
  if (input.driver === 'net') {
    source = parseNumber(input.netPrice);
    if (source === null) errors.netPrice = 'Enter a net price.';
    else if (source < 0) errors.netPrice = 'Net price cannot be negative.';
  } else if (input.driver === 'gross') {
    source = parseNumber(input.grossPrice);
    if (source === null) errors.grossPrice = 'Enter a gross price.';
    else if (source < 0) errors.grossPrice = 'Gross price cannot be negative.';
  } else {
    source = parseNumber(input.amount);
    if (source === null) errors.amount = 'Enter an amount.';
    else if (source < 0) errors.amount = 'Amount cannot be negative.';
  }

  if (Object.keys(errors).length > 0 || vatRate === null || source === null) {
    return { isValid: false, errors, result: null };
  }

  const fromGross =
    input.driver === 'gross' || (input.driver === 'amount' && input.mode === 'included');

  const result = fromGross
    ? calculateVatFromGross(source, vatRate, input.currency, 'included')
    : calculateVatFromNet(source, vatRate, input.currency, 'excluded');

  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate VAT with the current inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
