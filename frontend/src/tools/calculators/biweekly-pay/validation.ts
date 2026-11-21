import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { calculateBiweeklyPay, formatBiweeklyMoney } from './calculation';
import type {
  BiweeklyPayFieldErrors,
  BiweeklyPayInput,
  BiweeklyPayResult,
  BiweeklyPaySourceField,
} from './types';

export interface BiweeklyPayValidation {
  isValid: boolean;
  errors: BiweeklyPayFieldErrors;
  result: BiweeklyPayResult | null;
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

function sourceCurrency(input: BiweeklyPayInput): SupportedCurrency {
  switch (input.sourceField) {
    case 'annual':
      return input.annualSalaryCurrency;
    case 'monthly':
      return input.monthlyWageCurrency;
    case 'weekly':
      return input.weeklyWageCurrency;
    case 'daily':
      return input.dailyWageCurrency;
    case 'hourly':
      return input.hourlyWageCurrency;
  }
}

function sourceRaw(input: BiweeklyPayInput): string {
  switch (input.sourceField) {
    case 'annual':
      return input.annualSalary;
    case 'monthly':
      return input.monthlyWage;
    case 'weekly':
      return input.weeklyWage;
    case 'daily':
      return input.dailyWage;
    case 'hourly':
      return input.hourlyWage;
  }
}

function wageErrorKey(
  field: BiweeklyPaySourceField
): keyof BiweeklyPayFieldErrors {
  switch (field) {
    case 'annual':
      return 'annualSalary';
    case 'monthly':
      return 'monthlyWage';
    case 'weekly':
      return 'weeklyWage';
    case 'daily':
      return 'dailyWage';
    case 'hourly':
      return 'hourlyWage';
  }
}

/**
 * Validates the authoritative wage (≥ 0) and positive hours/days, computes
 * biweekly pay in the source currency, then FX-converts into the biweekly
 * display currency. Hours/days never convert.
 */
export function validateBiweeklyPayInput(
  input: BiweeklyPayInput,
  rates?: CurrencyRatesSnapshot | null
): BiweeklyPayValidation {
  const errors: BiweeklyPayFieldErrors = {};
  const sourceField = input.sourceField;
  const wage = parseNumber(sourceRaw(input));
  const hours = parseNumber(input.hoursPerWeek);
  const days = parseNumber(input.daysPerWeek);
  const wageKey = wageErrorKey(sourceField);

  if (!wage.blank && (wage.invalid || wage.value === null)) {
    errors[wageKey] = 'Enter a valid wage amount.';
  } else if (wage.value !== null && wage.value < 0) {
    errors[wageKey] = 'Wage must be zero or greater.';
  }

  if (!hours.blank && (hours.invalid || hours.value === null)) {
    errors.hoursPerWeek = 'Enter a valid hours-per-week value.';
  } else if (hours.blank || hours.value === null || hours.value <= 0) {
    errors.hoursPerWeek = 'Hours per week must be greater than zero.';
  }

  if (!days.blank && (days.invalid || days.value === null)) {
    errors.daysPerWeek = 'Enter a valid days-per-week value.';
  } else if (days.blank || days.value === null || days.value <= 0) {
    errors.daysPerWeek = 'Days per week must be greater than zero.';
  }

  const incomplete =
    wage.blank ||
    Boolean(errors[wageKey]) ||
    Boolean(errors.hoursPerWeek) ||
    Boolean(errors.daysPerWeek);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateBiweeklyPay({
    sourceField,
    sourceAmount: wage.value!,
    hoursPerWeek: hours.value!,
    daysPerWeek: days.value!,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const from = sourceCurrency(input);
  const fx = convertMoney(
    computed.biweekly,
    from,
    input.biweeklyCurrency,
    rates
  );
  if (!fx.ok) {
    errors.form = fx.message;
    return { isValid: false, errors, result: null };
  }

  const result: BiweeklyPayResult = {
    biweeklyCanonical: computed.biweekly,
    biweekly: fx.amount,
    sourceField,
    sourceCurrency: from,
    biweeklyCurrency: input.biweeklyCurrency,
    formattedBiweekly: formatBiweeklyMoney(fx.amount, input.biweeklyCurrency),
  };

  return { isValid: true, errors, result };
}
