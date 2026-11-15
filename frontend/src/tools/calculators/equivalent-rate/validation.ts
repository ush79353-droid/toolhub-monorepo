import { calculateEquivalentRate } from './calculation';
import type {
  EquivalentRateFieldErrors,
  EquivalentRateInput,
  EquivalentRateResult,
} from './types';

export interface EquivalentRateValidation {
  isValid: boolean;
  errors: EquivalentRateFieldErrors;
  result: EquivalentRateResult | null;
}

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
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

export function validateEquivalentRateInput(
  input: EquivalentRateInput
): EquivalentRateValidation {
  const errors: EquivalentRateFieldErrors = {};

  const nominal = parseNumber(input.nominalInterestRatePercent);
  const m = parseNumber(input.compoundingFrequency);
  const n = parseNumber(input.newCompoundingFrequency);

  if (!nominal.blank && (nominal.invalid || nominal.value === null)) {
    errors.nominalInterestRatePercent = 'Enter a valid nominal interest rate.';
  }

  if (!m.blank && (m.invalid || m.value === null)) {
    errors.compoundingFrequency = 'Enter a valid compounding frequency.';
  } else if (!m.blank && m.value !== null && !(m.value > 0)) {
    errors.compoundingFrequency = 'Compounding frequency must be greater than zero.';
  }

  if (!n.blank && (n.invalid || n.value === null)) {
    errors.newCompoundingFrequency = 'Enter a valid new compounding frequency.';
  } else if (!n.blank && n.value !== null && !(n.value > 0)) {
    errors.newCompoundingFrequency =
      'New compounding frequency must be greater than zero.';
  }

  const incomplete =
    nominal.blank ||
    m.blank ||
    n.blank ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateEquivalentRate({
    nominalInterestRatePercent: nominal.value!,
    compoundingFrequency: m.value!,
    newCompoundingFrequency: n.value!,
  });

  if (!result) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
