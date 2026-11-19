import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { calculateWageToSalary, formatWageMoney } from './calculation';
import type {
  WageSourceField,
  WageToSalaryFieldErrors,
  WageToSalaryInput,
  WageToSalaryResult,
} from './types';

export interface WageToSalaryValidation {
  isValid: boolean;
  errors: WageToSalaryFieldErrors;
  result: WageToSalaryResult | null;
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

function sourceCurrency(input: WageToSalaryInput): SupportedCurrency {
  if (input.sourceField === 'hourly') return input.hourlyWageCurrency;
  if (input.sourceField === 'daily') return input.dailyWageCurrency;
  return input.weeklyWageCurrency;
}

function sourceRaw(input: WageToSalaryInput): string {
  if (input.sourceField === 'hourly') return input.hourlyWage;
  if (input.sourceField === 'daily') return input.dailyWage;
  return input.weeklyWage;
}

function wageErrorKey(
  field: WageSourceField
): keyof WageToSalaryFieldErrors {
  if (field === 'hourly') return 'hourlyWage';
  if (field === 'daily') return 'dailyWage';
  return 'weeklyWage';
}

/**
 * Validates the authoritative wage (≥ 0) and positive hours/days, computes
 * salaries in the source currency, then FX-converts each money amount into
 * its independent display currency. Hours/days never convert.
 */
export function validateWageToSalaryInput(
  input: WageToSalaryInput,
  rates?: CurrencyRatesSnapshot | null
): WageToSalaryValidation {
  const errors: WageToSalaryFieldErrors = {};
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

  const computed = calculateWageToSalary({
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

  const pairs: Array<{
    amount: number;
    to: SupportedCurrency;
  }> = [
    { amount: computed.monthly, to: input.monthlyCurrency },
    { amount: computed.yearly, to: input.yearlyCurrency },
    { amount: computed.hourly, to: input.hourlyWageCurrency },
    { amount: computed.daily, to: input.dailyWageCurrency },
    { amount: computed.weekly, to: input.weeklyWageCurrency },
  ];

  const converted: number[] = [];
  for (const pair of pairs) {
    const fx = convertMoney(pair.amount, from, pair.to, rates);
    if (!fx.ok) {
      errors.form = fx.message;
      return { isValid: false, errors, result: null };
    }
    converted.push(fx.amount);
  }

  const [monthly, yearly, hourly, daily, weekly] = converted;

  const result: WageToSalaryResult = {
    weeklyCanonical: computed.weekly,
    monthlyCanonical: computed.monthly,
    yearlyCanonical: computed.yearly,
    hourlyCanonical: computed.hourly,
    dailyCanonical: computed.daily,
    monthly,
    yearly,
    hourly,
    daily,
    weekly,
    sourceField,
    sourceCurrency: from,
    hourlyWageCurrency: input.hourlyWageCurrency,
    dailyWageCurrency: input.dailyWageCurrency,
    weeklyWageCurrency: input.weeklyWageCurrency,
    monthlyCurrency: input.monthlyCurrency,
    yearlyCurrency: input.yearlyCurrency,
    formattedHourly: formatWageMoney(hourly, input.hourlyWageCurrency),
    formattedDaily: formatWageMoney(daily, input.dailyWageCurrency),
    formattedWeekly: formatWageMoney(weekly, input.weeklyWageCurrency),
    formattedMonthly: formatWageMoney(monthly, input.monthlyCurrency),
    formattedYearly: formatWageMoney(yearly, input.yearlyCurrency),
  };

  return { isValid: true, errors, result };
}
