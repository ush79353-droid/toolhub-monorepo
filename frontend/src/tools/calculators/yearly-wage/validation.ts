import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { calculateYearlyWage, formatYearlyWageMoney } from './calculation';
import type {
  YearlyWageFieldErrors,
  YearlyWageInput,
  YearlyWageResult,
} from './types';

export interface YearlyWageValidation {
  isValid: boolean;
  errors: YearlyWageFieldErrors;
  result: YearlyWageResult | null;
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
 * Validates hours (≥ 0), weeks (0–52), wage (≥ 0), tax (0–100); computes
 * yearly/net results in the hourly-wage currency at full precision; FX-converts
 * each money result into its independent display currency. Hours, weeks, and
 * tax percent never convert.
 */
export function validateYearlyWageInput(
  input: YearlyWageInput,
  rates?: CurrencyRatesSnapshot | null
): YearlyWageValidation {
  const errors: YearlyWageFieldErrors = {};

  const hours = parseNumber(input.hoursPerWeek);
  const weeks = parseNumber(input.weeksPerYear);
  const wage = parseNumber(input.hourlyWage);
  const tax = parseNumber(input.taxPercent);

  if (!hours.blank && (hours.invalid || hours.value === null)) {
    errors.hoursPerWeek = 'Enter a valid hours-per-week value.';
  } else if (hours.value !== null && hours.value < 0) {
    errors.hoursPerWeek = 'Hours per week must be zero or greater.';
  }

  if (!weeks.blank && (weeks.invalid || weeks.value === null)) {
    errors.weeksPerYear = 'Enter a valid weeks-per-year value.';
  } else if (weeks.value !== null && (weeks.value < 0 || weeks.value > 52)) {
    errors.weeksPerYear =
      'Working weeks per year must be between 0 and 52 under the standard calendar-year model.';
  }

  if (!wage.blank && (wage.invalid || wage.value === null)) {
    errors.hourlyWage = 'Enter a valid hourly wage.';
  } else if (wage.value !== null && wage.value < 0) {
    errors.hourlyWage = 'Hourly wage must be zero or greater.';
  }

  if (!tax.blank && (tax.invalid || tax.value === null)) {
    errors.taxPercent = 'Enter a valid tax percent.';
  } else if (tax.value !== null && (tax.value < 0 || tax.value > 100)) {
    errors.taxPercent = 'Tax must be between 0% and 100%.';
  }

  const incomplete =
    hours.blank ||
    weeks.blank ||
    wage.blank ||
    tax.blank ||
    Boolean(errors.hoursPerWeek) ||
    Boolean(errors.weeksPerYear) ||
    Boolean(errors.hourlyWage) ||
    Boolean(errors.taxPercent);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateYearlyWage({
    hourlyWage: wage.value!,
    hoursPerWeek: hours.value!,
    weeksPerYear: weeks.value!,
    taxPercent: tax.value!,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const wageCurrency = input.hourlyWageCurrency;

  const yearlyFx = convertMoney(
    computed.yearlyWage,
    wageCurrency,
    input.yearlyWageCurrency,
    rates
  );
  if (!yearlyFx.ok) {
    errors.form = yearlyFx.message;
    return { isValid: false, errors, result: null };
  }

  const netHourlyFx = convertMoney(
    computed.netHourly,
    wageCurrency,
    input.netHourlyCurrency,
    rates
  );
  if (!netHourlyFx.ok) {
    errors.form = netHourlyFx.message;
    return { isValid: false, errors, result: null };
  }

  const netYearlyFx = convertMoney(
    computed.netYearly,
    wageCurrency,
    input.netYearlyCurrency,
    rates
  );
  if (!netYearlyFx.ok) {
    errors.form = netYearlyFx.message;
    return { isValid: false, errors, result: null };
  }

  const result: YearlyWageResult = {
    yearlyWageCanonical: computed.yearlyWage,
    netHourlyCanonical: computed.netHourly,
    netYearlyCanonical: computed.netYearly,
    yearlyWage: yearlyFx.amount,
    netHourly: netHourlyFx.amount,
    netYearly: netYearlyFx.amount,
    hourlyWageCurrency: wageCurrency,
    yearlyWageCurrency: input.yearlyWageCurrency,
    netHourlyCurrency: input.netHourlyCurrency,
    netYearlyCurrency: input.netYearlyCurrency,
    formattedYearlyWage: formatYearlyWageMoney(
      yearlyFx.amount,
      input.yearlyWageCurrency
    ),
    formattedNetHourly: formatYearlyWageMoney(
      netHourlyFx.amount,
      input.netHourlyCurrency
    ),
    formattedNetYearly: formatYearlyWageMoney(
      netYearlyFx.amount,
      input.netYearlyCurrency
    ),
    taxPercent: tax.value!,
  };

  return { isValid: true, errors, result };
}
