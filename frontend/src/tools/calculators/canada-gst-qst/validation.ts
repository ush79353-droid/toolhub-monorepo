import {
  calculateCanadaGstQst,
  formatCadMoney,
  formatRatePercent,
} from './calculation';
import { getProvinceConfig } from './rates';
import type {
  CanadaGstQstFieldErrors,
  CanadaGstQstInput,
  CanadaGstQstResult,
} from './types';

export interface CanadaGstQstValidation {
  isValid: boolean;
  errors: CanadaGstQstFieldErrors;
  result: CanadaGstQstResult | null;
}

function parseAmount(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '').replace(/^\$/, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

export function validateCanadaGstQstInput(
  input: CanadaGstQstInput
): CanadaGstQstValidation {
  const errors: CanadaGstQstFieldErrors = {};

  try {
    getProvinceConfig(input.province);
  } catch {
    errors.form = 'Select a valid province or territory.';
    return { isValid: false, errors, result: null };
  }

  const amount = parseAmount(input.amountBeforeTax);
  if (!amount.blank && (amount.invalid || amount.value === null)) {
    errors.amountBeforeTax = 'Enter a valid amount before tax in CAD.';
  } else if (amount.value !== null && amount.value < 0) {
    errors.amountBeforeTax = 'Amount before tax must be zero or greater.';
  }

  if (amount.blank || errors.amountBeforeTax || errors.form) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateCanadaGstQst({
    province: input.province,
    amountBeforeTax: amount.value!,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite tax result.';
    return { isValid: false, errors, result: null };
  }

  const result: CanadaGstQstResult = {
    province: computed.province,
    provinceName: computed.provinceName,
    blurb: computed.blurb,
    amountBeforeTax: computed.amountBeforeTax,
    taxLines: computed.lines.map((line) => ({
      key: line.key,
      label: line.label,
      ratePercentLabel: formatRatePercent(line.rate),
      amount: line.amount,
      formattedAmount: formatCadMoney(line.amount),
    })),
    totalTax: computed.totalTax,
    amountAfterTax: computed.amountAfterTax,
    formattedBefore: formatCadMoney(computed.amountBeforeTax),
    formattedTotalTax: formatCadMoney(computed.totalTax),
    formattedAfter: formatCadMoney(computed.amountAfterTax),
  };

  return { isValid: true, errors, result };
}
