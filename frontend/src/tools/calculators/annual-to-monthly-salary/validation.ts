import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { calculateAnnualToMonthly, formatWageMoney } from './calculation';
import type {
  AnnualToMonthlySalaryFieldErrors,
  AnnualToMonthlySalaryInput,
  AnnualToMonthlySalaryResult,
} from './types';

export interface AnnualToMonthlySalaryValidation {
  isValid: boolean;
  errors: AnnualToMonthlySalaryFieldErrors;
  result: AnnualToMonthlySalaryResult | null;
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
 * Validates hours (> 0) and annual salary (≥ 0), computes wage periods in the
 * annual currency at full precision, then FX-converts each period into its
 * independent display currency. Hours never convert.
 */
export function validateAnnualToMonthlySalaryInput(
  input: AnnualToMonthlySalaryInput,
  rates?: CurrencyRatesSnapshot | null
): AnnualToMonthlySalaryValidation {
  const errors: AnnualToMonthlySalaryFieldErrors = {};

  const hours = parseNumber(input.hoursPerWeek);
  const annual = parseNumber(input.annualSalary);

  if (!hours.blank && (hours.invalid || hours.value === null)) {
    errors.hoursPerWeek = 'Enter a valid hours-per-week value.';
  } else if (hours.value !== null && hours.value <= 0) {
    errors.hoursPerWeek = 'Hours per week must be greater than zero.';
  }

  if (!annual.blank && (annual.invalid || annual.value === null)) {
    errors.annualSalary = 'Enter a valid annual salary.';
  } else if (annual.value !== null && annual.value < 0) {
    errors.annualSalary = 'Annual salary must be zero or greater.';
  }

  const incomplete =
    hours.blank ||
    annual.blank ||
    Boolean(errors.hoursPerWeek) ||
    Boolean(errors.annualSalary);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateAnnualToMonthly({
    annualSalary: annual.value!,
    hoursPerWeek: hours.value!,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const from = input.annualSalaryCurrency;

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

  const hourlyFx = convertMoney(
    computed.hourly,
    from,
    input.hourlyCurrency,
    rates
  );
  if (!hourlyFx.ok) {
    errors.form = hourlyFx.message;
    return { isValid: false, errors, result: null };
  }

  const result: AnnualToMonthlySalaryResult = {
    annualCanonical: computed.annual,
    monthlyCanonical: computed.monthly,
    weeklyCanonical: computed.weekly,
    dailyCanonical: computed.daily,
    hourlyCanonical: computed.hourly,
    annualHours: computed.annualHours,
    monthly: monthlyFx.amount,
    weekly: weeklyFx.amount,
    daily: dailyFx.amount,
    hourly: hourlyFx.amount,
    annualSalaryCurrency: from,
    monthlyCurrency: input.monthlyCurrency,
    weeklyCurrency: input.weeklyCurrency,
    dailyCurrency: input.dailyCurrency,
    hourlyCurrency: input.hourlyCurrency,
    formattedMonthly: formatWageMoney(monthlyFx.amount, input.monthlyCurrency),
    formattedWeekly: formatWageMoney(weeklyFx.amount, input.weeklyCurrency),
    formattedDaily: formatWageMoney(dailyFx.amount, input.dailyCurrency),
    formattedHourly: formatWageMoney(hourlyFx.amount, input.hourlyCurrency),
  };

  return { isValid: true, errors, result };
}
