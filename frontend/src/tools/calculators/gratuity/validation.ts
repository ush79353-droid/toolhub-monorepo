import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { calculateGratuity, formatGratuityMoney } from './calculation';
import type {
  GratuityFieldErrors,
  GratuityInput,
  GratuityResult,
} from './types';

export interface GratuityValidation {
  isValid: boolean;
  errors: GratuityFieldErrors;
  result: GratuityResult | null;
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

function parseWholeNonNegative(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const parsed = parseNumber(raw);
  if (parsed.blank || parsed.invalid || parsed.value === null) return parsed;
  if (!(parsed.value >= 0) || !Number.isInteger(parsed.value)) {
    return { value: null, blank: false, invalid: true };
  }
  return parsed;
}

function convertMoney(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
  rates: CurrencyRatesSnapshot | null | undefined
): { ok: true; amount: number } | { ok: false; message: string } {
  if (from === to) return { ok: true, amount };
  if (!rates?.available) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  const converted = convertCurrency({
    amount,
    from,
    to,
    rates: rates.rates,
  });
  if (!converted.ok) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  return { ok: true, amount: converted.amount };
}

/**
 * Validates inputs, computes gratuity in the salary currency, then FX-converts
 * the result into the independent gratuity display currency. Years/months never
 * convert.
 */
export function validateGratuityInput(
  input: GratuityInput,
  rates?: CurrencyRatesSnapshot | null
): GratuityValidation {
  const errors: GratuityFieldErrors = {};

  const salary = parseNumber(input.salary);
  const years = parseWholeNonNegative(input.years);
  const months = parseWholeNonNegative(input.months);

  if (salary.blank) {
    // Incomplete — blank result, not a hard form error on first paint.
    return { isValid: false, errors, result: null };
  }
  if (salary.invalid || salary.value === null) {
    errors.salary = 'Enter a valid final month salary + D.A.';
  } else if (!(salary.value >= 0)) {
    errors.salary = 'Salary + D.A. must be zero or greater.';
  }

  if (years.blank || years.invalid || years.value === null) {
    errors.years = 'Enter whole years of service (0 or greater).';
  }

  if (months.blank || months.invalid || months.value === null) {
    errors.months = 'Enter whole months of service (0 or greater).';
  } else if (months.value > 11) {
    errors.months =
      'Use 0–11 months (put extra full years in the years field).';
  }

  if (Boolean(errors.salary) || Boolean(errors.years) || Boolean(errors.months)) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateGratuity({
    salary: salary.value!,
    years: years.value!,
    months: months.value!,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const fx = convertMoney(
    computed.gratuity,
    input.salaryCurrency,
    input.gratuityCurrency,
    rates
  );
  if (!fx.ok) {
    errors.form = fx.message;
    return { isValid: false, errors, result: null };
  }

  const result: GratuityResult = {
    gratuityCanonical: computed.gratuity,
    gratuity: fx.amount,
    salaryCurrency: input.salaryCurrency,
    gratuityCurrency: input.gratuityCurrency,
    formattedGratuity: formatGratuityMoney(fx.amount, input.gratuityCurrency),
    eligibleYears: computed.eligibleYears,
    totalServiceMonths: computed.totalServiceMonths,
    qualifies: computed.qualifies,
  };

  return { isValid: true, errors, result };
}
