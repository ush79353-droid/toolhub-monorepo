import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { calculateBillRate, formatBillRateMoney } from './calculation';
import type {
  BillRateFieldErrors,
  BillRateInput,
  BillRateResult,
} from './types';

export interface BillRateValidation {
  isValid: boolean;
  errors: BillRateFieldErrors;
  result: BillRateResult | null;
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
 * Validates salary (≥ 0), capacity (> 0), multiplier (≥ 0); computes bill rate
 * in the annual-salary currency at full precision; FX-converts the bill rate
 * into its independent display currency. Capacity and multiplier never convert.
 */
export function validateBillRateInput(
  input: BillRateInput,
  rates?: CurrencyRatesSnapshot | null
): BillRateValidation {
  const errors: BillRateFieldErrors = {};

  const salary = parseNumber(input.annualSalary);
  const capacity = parseNumber(input.capacity);
  const multiplier = parseNumber(input.multiplier);

  if (!salary.blank && (salary.invalid || salary.value === null)) {
    errors.annualSalary = 'Enter a valid annual salary.';
  } else if (salary.value !== null && salary.value < 0) {
    errors.annualSalary = 'Annual salary must be zero or greater.';
  }

  if (!capacity.blank && (capacity.invalid || capacity.value === null)) {
    errors.capacity = 'Enter a valid capacity in hours per year.';
  } else if (capacity.value !== null && !(capacity.value > 0)) {
    errors.capacity = 'Capacity must be greater than zero.';
  }

  if (!multiplier.blank && (multiplier.invalid || multiplier.value === null)) {
    errors.multiplier = 'Enter a valid multiplier.';
  } else if (multiplier.value !== null && multiplier.value < 0) {
    errors.multiplier = 'Multiplier must be zero or greater.';
  }

  const incomplete =
    salary.blank ||
    capacity.blank ||
    multiplier.blank ||
    Boolean(errors.annualSalary) ||
    Boolean(errors.capacity) ||
    Boolean(errors.multiplier);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateBillRate({
    annualSalary: salary.value!,
    capacity: capacity.value!,
    multiplier: multiplier.value!,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite bill rate.';
    return { isValid: false, errors, result: null };
  }

  const salaryCurrency = input.annualSalaryCurrency;
  const billFx = convertMoney(
    computed.billRate,
    salaryCurrency,
    input.billRateCurrency,
    rates
  );
  if (!billFx.ok) {
    errors.form = billFx.message;
    return { isValid: false, errors, result: null };
  }

  const result: BillRateResult = {
    billRateCanonical: computed.billRate,
    billRate: billFx.amount,
    annualSalaryCurrency: salaryCurrency,
    billRateCurrency: input.billRateCurrency,
    formattedBillRate: formatBillRateMoney(
      billFx.amount,
      input.billRateCurrency
    ),
    capacity: capacity.value!,
    multiplier: multiplier.value!,
  };

  return { isValid: true, errors, result };
}
