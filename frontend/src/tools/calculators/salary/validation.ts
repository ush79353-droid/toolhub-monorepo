import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { calculateSalary, formatSalaryMoney } from './calculation';
import type {
  SalaryFieldErrors,
  SalaryInput,
  SalaryResult,
} from './types';

export interface SalaryValidation {
  isValid: boolean;
  errors: SalaryFieldErrors;
  result: SalaryResult | null;
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
 * Validates pay (≥ 0), hours/day (> 0), days/week (> 0), holidays/vacation (≥ 0),
 * computes periods in the pay currency at full precision, then FX-converts each
 * result into its independent display currency. Schedule counts never convert.
 * Holidays and paid vacation are validated but not deducted from annual pay.
 */
export function validateSalaryInput(
  input: SalaryInput,
  rates?: CurrencyRatesSnapshot | null
): SalaryValidation {
  const errors: SalaryFieldErrors = {};

  const pay = parseNumber(input.payAmount);
  const hours = parseNumber(input.hoursPerDay);
  const days = parseNumber(input.daysPerWeek);
  const holidays = parseNumber(input.holidaysPerYear);
  const vacation = parseNumber(input.paidVacationPerYear);

  if (!pay.blank && (pay.invalid || pay.value === null)) {
    errors.payAmount = 'Enter a valid pay amount.';
  } else if (pay.value !== null && pay.value < 0) {
    errors.payAmount = 'Pay must be zero or greater.';
  }

  if (!hours.blank && (hours.invalid || hours.value === null)) {
    errors.hoursPerDay = 'Enter a valid hours-per-day value.';
  } else if (hours.value !== null && hours.value <= 0) {
    errors.hoursPerDay = 'Hours per day must be greater than zero.';
  }

  if (!days.blank && (days.invalid || days.value === null)) {
    errors.daysPerWeek = 'Enter a valid days-per-week value.';
  } else if (days.value !== null && days.value <= 0) {
    errors.daysPerWeek = 'Days per week must be greater than zero.';
  }

  if (!holidays.blank && (holidays.invalid || holidays.value === null)) {
    errors.holidaysPerYear = 'Enter a valid holidays-per-year value.';
  } else if (holidays.value !== null && holidays.value < 0) {
    errors.holidaysPerYear = 'Holidays per year must be zero or greater.';
  }

  if (!vacation.blank && (vacation.invalid || vacation.value === null)) {
    errors.paidVacationPerYear = 'Enter a valid paid-vacation value.';
  } else if (vacation.value !== null && vacation.value < 0) {
    errors.paidVacationPerYear = 'Paid vacation must be zero or greater.';
  }

  const incomplete =
    pay.blank ||
    hours.blank ||
    days.blank ||
    holidays.blank ||
    vacation.blank ||
    Boolean(errors.payAmount) ||
    Boolean(errors.hoursPerDay) ||
    Boolean(errors.daysPerWeek) ||
    Boolean(errors.holidaysPerYear) ||
    Boolean(errors.paidVacationPerYear);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  // Only hourly pay frequency is verified.
  if (input.payFrequency !== 'hour') {
    errors.form = 'Only Per hour pay is supported.';
    return { isValid: false, errors, result: null };
  }

  const computed = calculateSalary({
    hourlyPay: pay.value!,
    hoursPerDay: hours.value!,
    daysPerWeek: days.value!,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const from = input.payCurrency;

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

  const dailyFx = convertMoney(computed.daily, from, input.dailyCurrency, rates);
  if (!dailyFx.ok) {
    errors.form = dailyFx.message;
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

  const result: SalaryResult = {
    hourlyCanonical: computed.hourly,
    dailyCanonical: computed.daily,
    weeklyCanonical: computed.weekly,
    monthlyCanonical: computed.monthly,
    annualCanonical: computed.annual,
    hoursPerWeek: computed.hoursPerWeek,
    annualScheduledDays: computed.annualScheduledDays,
    hourly: hourlyFx.amount,
    daily: dailyFx.amount,
    weekly: weeklyFx.amount,
    monthly: monthlyFx.amount,
    annual: annualFx.amount,
    payCurrency: from,
    hourlyCurrency: input.hourlyCurrency,
    dailyCurrency: input.dailyCurrency,
    weeklyCurrency: input.weeklyCurrency,
    monthlyCurrency: input.monthlyCurrency,
    annualCurrency: input.annualCurrency,
    formattedHourly: formatSalaryMoney(hourlyFx.amount, input.hourlyCurrency),
    formattedDaily: formatSalaryMoney(dailyFx.amount, input.dailyCurrency),
    formattedWeekly: formatSalaryMoney(weeklyFx.amount, input.weeklyCurrency),
    formattedMonthly: formatSalaryMoney(
      monthlyFx.amount,
      input.monthlyCurrency
    ),
    formattedAnnual: formatSalaryMoney(annualFx.amount, input.annualCurrency),
  };

  return { isValid: true, errors, result };
}
