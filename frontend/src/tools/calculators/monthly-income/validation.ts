import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateMonthlyIncome,
  formatMonthlyIncomeMoney,
} from './calculation';
import type {
  MonthlyIncomeFieldErrors,
  MonthlyIncomeInput,
  MonthlyIncomeResult,
  MonthlyIncomeSourceField,
} from './types';

export interface MonthlyIncomeValidation {
  isValid: boolean;
  errors: MonthlyIncomeFieldErrors;
  result: MonthlyIncomeResult | null;
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

function sourceCurrency(input: MonthlyIncomeInput): SupportedCurrency {
  if (input.sourceField === 'hourly') return input.hourlyCurrency;
  if (input.sourceField === 'daily') return input.dailyCurrency;
  if (input.sourceField === 'weekly') return input.weeklyCurrency;
  return input.yearlyCurrency;
}

function sourceRaw(input: MonthlyIncomeInput): string {
  if (input.sourceField === 'hourly') return input.hourly;
  if (input.sourceField === 'daily') return input.daily;
  if (input.sourceField === 'weekly') return input.weekly;
  return input.yearly;
}

function payKey(
  field: MonthlyIncomeSourceField
): keyof MonthlyIncomeFieldErrors {
  return field;
}

export function validateMonthlyIncomeInput(
  input: MonthlyIncomeInput,
  rates?: CurrencyRatesSnapshot | null
): MonthlyIncomeValidation {
  const errors: MonthlyIncomeFieldErrors = {};
  const sourceField = input.sourceField;
  const pay = parseNumber(sourceRaw(input));
  const hours = parseNumber(input.hoursPerDay);
  const days = parseNumber(input.daysPerWeek);
  const weeks = parseNumber(input.weeksPerYear);
  const key = payKey(sourceField);

  if (!pay.blank && (pay.invalid || pay.value === null)) {
    errors[key] = 'Enter a valid earnings amount.';
  } else if (pay.value !== null && pay.value < 0) {
    errors[key] = 'Earnings must be zero or greater.';
  }

  if (!hours.blank && (hours.invalid || hours.value === null)) {
    errors.hoursPerDay = 'Enter a valid hours-per-day value.';
  } else if (hours.blank || hours.value === null || hours.value <= 0) {
    errors.hoursPerDay = 'Hours per day must be greater than zero.';
  }

  if (!days.blank && (days.invalid || days.value === null)) {
    errors.daysPerWeek = 'Enter a valid days-per-week value.';
  } else if (days.blank || days.value === null || days.value <= 0) {
    errors.daysPerWeek = 'Days per week must be greater than zero.';
  } else if (days.value > 7) {
    errors.daysPerWeek = 'Days per week cannot exceed 7.';
  }

  if (!weeks.blank && (weeks.invalid || weeks.value === null)) {
    errors.weeksPerYear = 'Enter a valid weeks-per-year value.';
  } else if (weeks.blank || weeks.value === null || weeks.value <= 0) {
    errors.weeksPerYear = 'Weeks per year must be greater than zero.';
  }

  if (
    pay.blank ||
    errors[key] ||
    errors.hoursPerDay ||
    errors.daysPerWeek ||
    errors.weeksPerYear
  ) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateMonthlyIncome({
    sourceField,
    sourceAmount: pay.value!,
    hoursPerDay: hours.value!,
    daysPerWeek: days.value!,
    weeksPerYear: weeks.value!,
  });
  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const from = sourceCurrency(input);
  const pairs: Array<{ amount: number; to: SupportedCurrency }> = [
    { amount: computed.hourly, to: input.hourlyCurrency },
    { amount: computed.daily, to: input.dailyCurrency },
    { amount: computed.weekly, to: input.weeklyCurrency },
    { amount: computed.yearly, to: input.yearlyCurrency },
    { amount: computed.monthly, to: input.monthlyCurrency },
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
  const [hourly, daily, weekly, yearly, monthly] = converted;

  return {
    isValid: true,
    errors,
    result: {
      hourlyCanonical: computed.hourly,
      dailyCanonical: computed.daily,
      weeklyCanonical: computed.weekly,
      yearlyCanonical: computed.yearly,
      monthlyCanonical: computed.monthly,
      hourly,
      daily,
      weekly,
      yearly,
      monthly,
      sourceField,
      sourceCurrency: from,
      hourlyCurrency: input.hourlyCurrency,
      dailyCurrency: input.dailyCurrency,
      weeklyCurrency: input.weeklyCurrency,
      yearlyCurrency: input.yearlyCurrency,
      monthlyCurrency: input.monthlyCurrency,
      formattedHourly: formatMonthlyIncomeMoney(hourly, input.hourlyCurrency),
      formattedDaily: formatMonthlyIncomeMoney(daily, input.dailyCurrency),
      formattedWeekly: formatMonthlyIncomeMoney(weekly, input.weeklyCurrency),
      formattedYearly: formatMonthlyIncomeMoney(yearly, input.yearlyCurrency),
      formattedMonthly: formatMonthlyIncomeMoney(monthly, input.monthlyCurrency),
    },
  };
}
