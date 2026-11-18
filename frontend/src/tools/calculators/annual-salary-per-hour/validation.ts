import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { calculateWagePeriods, formatWageMoney } from './calculation';
import type {
  AnnualSalaryPerHourFieldErrors,
  AnnualSalaryPerHourInput,
  AnnualSalaryPerHourResult,
  WageSourceField,
} from './types';

export interface AnnualSalaryPerHourValidation {
  isValid: boolean;
  errors: AnnualSalaryPerHourFieldErrors;
  result: AnnualSalaryPerHourResult | null;
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

function sourceCurrency(input: AnnualSalaryPerHourInput): SupportedCurrency {
  switch (input.sourceField) {
    case 'hourly':
      return input.hourlyCurrency;
    case 'daily':
      return input.dailyCurrency;
    case 'weekly':
      return input.weeklyCurrency;
    case 'monthly':
      return input.monthlyCurrency;
    case 'annual':
      return input.annualCurrency;
  }
}

function sourceRaw(input: AnnualSalaryPerHourInput): string {
  return input[input.sourceField];
}

/**
 * Validates hours (> 0) and the authoritative wage (≥ 0), computes all periods
 * in the source currency at full precision, then FX-converts each period into
 * its independent display currency. Hours never convert.
 */
export function validateAnnualSalaryPerHourInput(
  input: AnnualSalaryPerHourInput,
  rates?: CurrencyRatesSnapshot | null
): AnnualSalaryPerHourValidation {
  const errors: AnnualSalaryPerHourFieldErrors = {};
  const sourceField: WageSourceField = input.sourceField;

  const hours = parseNumber(input.hoursPerWeek);
  const wage = parseNumber(sourceRaw(input));

  if (!hours.blank && (hours.invalid || hours.value === null)) {
    errors.hoursPerWeek = 'Enter a valid hours-per-week value.';
  } else if (hours.value !== null && hours.value <= 0) {
    errors.hoursPerWeek = 'Hours per week must be greater than zero.';
  }

  const wageErrorKey = sourceField;
  if (!wage.blank && (wage.invalid || wage.value === null)) {
    errors[wageErrorKey] = 'Enter a valid wage amount.';
  } else if (wage.value !== null && wage.value < 0) {
    errors[wageErrorKey] = 'Wage must be zero or greater.';
  }

  const incomplete =
    hours.blank ||
    wage.blank ||
    Boolean(errors.hoursPerWeek) ||
    Boolean(errors[wageErrorKey]);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateWagePeriods({
    hoursPerWeek: hours.value!,
    sourceField,
    sourceAmount: wage.value!,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const from = sourceCurrency(input);

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

  const result: AnnualSalaryPerHourResult = {
    hourlyCanonical: computed.hourly,
    dailyCanonical: computed.daily,
    weeklyCanonical: computed.weekly,
    monthlyCanonical: computed.monthly,
    annualCanonical: computed.annual,
    annualHours: computed.annualHours,
    hourly: hourlyFx.amount,
    daily: dailyFx.amount,
    weekly: weeklyFx.amount,
    monthly: monthlyFx.amount,
    annual: annualFx.amount,
    hourlyCurrency: input.hourlyCurrency,
    dailyCurrency: input.dailyCurrency,
    weeklyCurrency: input.weeklyCurrency,
    monthlyCurrency: input.monthlyCurrency,
    annualCurrency: input.annualCurrency,
    sourceCurrency: from,
    formattedHourly: formatWageMoney(hourlyFx.amount, input.hourlyCurrency),
    formattedDaily: formatWageMoney(dailyFx.amount, input.dailyCurrency),
    formattedWeekly: formatWageMoney(weeklyFx.amount, input.weeklyCurrency),
    formattedMonthly: formatWageMoney(monthlyFx.amount, input.monthlyCurrency),
    formattedAnnual: formatWageMoney(annualFx.amount, input.annualCurrency),
    sourceField,
  };

  return { isValid: true, errors, result };
}
