import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { calculateHourlyWage, formatHourlyWageMoney } from './calculation';
import type {
  HourlyWageFieldErrors,
  HourlyWageInput,
  HourlyWageResult,
} from './types';

export interface HourlyWageValidation {
  isValid: boolean;
  errors: HourlyWageFieldErrors;
  result: HourlyWageResult | null;
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
 * Validates hourly (≥ 0) and hours/week (> 0), computes periods in the hourly
 * currency at full precision, then FX-converts each result into its independent
 * display currency. Hours never convert.
 */
export function validateHourlyWageInput(
  input: HourlyWageInput,
  rates?: CurrencyRatesSnapshot | null
): HourlyWageValidation {
  const errors: HourlyWageFieldErrors = {};

  const hourly = parseNumber(input.hourlyWage);
  const hours = parseNumber(input.hoursPerWeek);

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

  const incomplete =
    hourly.blank ||
    hours.blank ||
    Boolean(errors.hourlyWage) ||
    Boolean(errors.hoursPerWeek);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateHourlyWage({
    hourlyWage: hourly.value!,
    hoursPerWeek: hours.value!,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const from = input.hourlyWageCurrency;
  const fxPairs: Array<{ amount: number; to: SupportedCurrency }> = [
    { amount: computed.perSecond, to: input.perSecondCurrency },
    { amount: computed.perMinute, to: input.perMinuteCurrency },
    { amount: computed.daily, to: input.dailyCurrency },
    { amount: computed.weekly, to: input.weeklyCurrency },
    { amount: computed.biweekly, to: input.biweeklyCurrency },
    { amount: computed.monthly, to: input.monthlyCurrency },
    { amount: computed.annual, to: input.annualCurrency },
  ];

  const converted: number[] = [];
  for (const pair of fxPairs) {
    const fx = convertMoney(pair.amount, from, pair.to, rates);
    if (!fx.ok) {
      errors.form = fx.message;
      return { isValid: false, errors, result: null };
    }
    converted.push(fx.amount);
  }

  const [
    perSecond,
    perMinute,
    daily,
    weekly,
    biweekly,
    monthly,
    annual,
  ] = converted;

  const result: HourlyWageResult = {
    perSecondCanonical: computed.perSecond,
    perMinuteCanonical: computed.perMinute,
    dailyCanonical: computed.daily,
    weeklyCanonical: computed.weekly,
    biweeklyCanonical: computed.biweekly,
    monthlyCanonical: computed.monthly,
    annualCanonical: computed.annual,
    hourlyWageCurrency: from,
    perSecond,
    perMinute,
    daily,
    weekly,
    biweekly,
    monthly,
    annual,
    perSecondCurrency: input.perSecondCurrency,
    perMinuteCurrency: input.perMinuteCurrency,
    dailyCurrency: input.dailyCurrency,
    weeklyCurrency: input.weeklyCurrency,
    biweeklyCurrency: input.biweeklyCurrency,
    monthlyCurrency: input.monthlyCurrency,
    annualCurrency: input.annualCurrency,
    formattedPerSecond: formatHourlyWageMoney(
      perSecond,
      input.perSecondCurrency
    ),
    formattedPerMinute: formatHourlyWageMoney(
      perMinute,
      input.perMinuteCurrency
    ),
    formattedDaily: formatHourlyWageMoney(daily, input.dailyCurrency),
    formattedWeekly: formatHourlyWageMoney(weekly, input.weeklyCurrency),
    formattedBiweekly: formatHourlyWageMoney(
      biweekly,
      input.biweeklyCurrency
    ),
    formattedMonthly: formatHourlyWageMoney(monthly, input.monthlyCurrency),
    formattedAnnual: formatHourlyWageMoney(annual, input.annualCurrency),
  };

  return { isValid: true, errors, result };
}
