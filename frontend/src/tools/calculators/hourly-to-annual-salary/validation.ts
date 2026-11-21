import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { calculateHourlyToAnnual, formatWageMoney } from './calculation';
import type {
  HourlyToAnnualSalaryFieldErrors,
  HourlyToAnnualSalaryInput,
  HourlyToAnnualSalaryResult,
} from './types';

export interface HourlyToAnnualSalaryValidation {
  isValid: boolean;
  errors: HourlyToAnnualSalaryFieldErrors;
  result: HourlyToAnnualSalaryResult | null;
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
 * Validates hourly (≥ 0), hours/week (> 0), days/week (> 0), computes periods
 * in the hourly currency at full precision, then FX-converts each result into
 * its independent display currency. Hours and days never convert.
 */
export function validateHourlyToAnnualSalaryInput(
  input: HourlyToAnnualSalaryInput,
  rates?: CurrencyRatesSnapshot | null
): HourlyToAnnualSalaryValidation {
  const errors: HourlyToAnnualSalaryFieldErrors = {};

  const hourly = parseNumber(input.hourlyWage);
  const hours = parseNumber(input.hoursPerWeek);
  const days = parseNumber(input.daysPerWeek);

  if (!hourly.blank && (hourly.invalid || hourly.value === null)) {
    errors.hourlyWage = 'Enter a valid hourly wage.';
  } else if (hourly.value !== null && hourly.value < 0) {
    errors.hourlyWage = 'Hourly wage must be zero or greater.';
  }

  if (!hours.blank && (hours.invalid || hours.value === null)) {
    errors.hoursPerWeek = 'Enter a valid hours-per-week value.';
  } else if (hours.value !== null && hours.value <= 0) {
    errors.hoursPerWeek = 'Hours per week must be greater than zero.';
  }

  if (!days.blank && (days.invalid || days.value === null)) {
    errors.daysPerWeek = 'Enter a valid days-per-week value.';
  } else if (days.value !== null && days.value <= 0) {
    errors.daysPerWeek = 'Days per week must be greater than zero.';
  }

  const incomplete =
    hourly.blank ||
    hours.blank ||
    days.blank ||
    Boolean(errors.hourlyWage) ||
    Boolean(errors.hoursPerWeek) ||
    Boolean(errors.daysPerWeek);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateHourlyToAnnual({
    hourlyWage: hourly.value!,
    hoursPerWeek: hours.value!,
    daysPerWeek: days.value!,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const from = input.hourlyWageCurrency;

  const annualFx = convertMoney(
    computed.annual,
    from,
    input.annualCurrency,
    rates
  );
  if (!annualFx.ok) {
    errors.form = annualFx.message;
    return { isValid: false, errors, result: null };
  }

  const monthlyFx = convertMoney(
    computed.monthly,
    from,
    input.monthlyCurrency,
    rates
  );
  if (!monthlyFx.ok) {
    errors.form = monthlyFx.message;
    return { isValid: false, errors, result: null };
  }

  const weeklyFx = convertMoney(
    computed.weekly,
    from,
    input.weeklyCurrency,
    rates
  );
  if (!weeklyFx.ok) {
    errors.form = weeklyFx.message;
    return { isValid: false, errors, result: null };
  }

  const dailyFx = convertMoney(computed.daily, from, input.dailyCurrency, rates);
  if (!dailyFx.ok) {
    errors.form = dailyFx.message;
    return { isValid: false, errors, result: null };
  }

  const result: HourlyToAnnualSalaryResult = {
    hourlyCanonical: computed.hourly,
    weeklyCanonical: computed.weekly,
    annualCanonical: computed.annual,
    monthlyCanonical: computed.monthly,
    dailyCanonical: computed.daily,
    weekly: weeklyFx.amount,
    annual: annualFx.amount,
    monthly: monthlyFx.amount,
    daily: dailyFx.amount,
    hourlyWageCurrency: from,
    annualCurrency: input.annualCurrency,
    monthlyCurrency: input.monthlyCurrency,
    weeklyCurrency: input.weeklyCurrency,
    dailyCurrency: input.dailyCurrency,
    formattedAnnual: formatWageMoney(annualFx.amount, input.annualCurrency),
    formattedMonthly: formatWageMoney(monthlyFx.amount, input.monthlyCurrency),
    formattedWeekly: formatWageMoney(weeklyFx.amount, input.weeklyCurrency),
    formattedDaily: formatWageMoney(dailyFx.amount, input.dailyCurrency),
  };

  return { isValid: true, errors, result };
}
