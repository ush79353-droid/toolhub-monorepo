import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { calculateWagePeriods, formatWageMoney } from './calculation';
import type {
  WageCalculatorFieldErrors,
  WageCalculatorInput,
  WageCalculatorResult,
  WageSourceField,
} from './types';

export interface WageCalculatorValidation {
  isValid: boolean;
  errors: WageCalculatorFieldErrors;
  result: WageCalculatorResult | null;
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

function sourceCurrency(input: WageCalculatorInput): SupportedCurrency {
  switch (input.sourceField) {
    case 'hourly':
      return input.hourlyCurrency;
    case 'perSecond':
      return input.perSecondCurrency;
    case 'perMinute':
      return input.perMinuteCurrency;
    case 'daily':
      return input.dailyCurrency;
    case 'weekly':
      return input.weeklyCurrency;
    case 'biweekly':
      return input.biweeklyCurrency;
    case 'monthly':
      return input.monthlyCurrency;
    case 'annual':
      return input.annualCurrency;
  }
}

function sourceRaw(input: WageCalculatorInput): string {
  return input[input.sourceField];
}

/**
 * Validates hours (> 0) and the authoritative wage (≥ 0), computes all periods
 * in the source currency at full precision, then FX-converts each period into
 * its independent display currency. Hours never convert.
 */
export function validateWageCalculatorInput(
  input: WageCalculatorInput,
  rates?: CurrencyRatesSnapshot | null
): WageCalculatorValidation {
  const errors: WageCalculatorFieldErrors = {};
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

  const pairs: Array<{
    amount: number;
    to: SupportedCurrency;
    assign: (
      amount: number
    ) => Partial<
      Pick<
        WageCalculatorResult,
        | 'hourly'
        | 'perSecond'
        | 'perMinute'
        | 'daily'
        | 'weekly'
        | 'biweekly'
        | 'monthly'
        | 'annual'
        | 'formattedHourly'
        | 'formattedPerSecond'
        | 'formattedPerMinute'
        | 'formattedDaily'
        | 'formattedWeekly'
        | 'formattedBiweekly'
        | 'formattedMonthly'
        | 'formattedAnnual'
      >
    >;
  }> = [
    {
      amount: computed.hourly,
      to: input.hourlyCurrency,
      assign: (amount) => ({
        hourly: amount,
        formattedHourly: formatWageMoney(amount, input.hourlyCurrency),
      }),
    },
    {
      amount: computed.perSecond,
      to: input.perSecondCurrency,
      assign: (amount) => ({
        perSecond: amount,
        formattedPerSecond: formatWageMoney(amount, input.perSecondCurrency),
      }),
    },
    {
      amount: computed.perMinute,
      to: input.perMinuteCurrency,
      assign: (amount) => ({
        perMinute: amount,
        formattedPerMinute: formatWageMoney(amount, input.perMinuteCurrency),
      }),
    },
    {
      amount: computed.daily,
      to: input.dailyCurrency,
      assign: (amount) => ({
        daily: amount,
        formattedDaily: formatWageMoney(amount, input.dailyCurrency),
      }),
    },
    {
      amount: computed.weekly,
      to: input.weeklyCurrency,
      assign: (amount) => ({
        weekly: amount,
        formattedWeekly: formatWageMoney(amount, input.weeklyCurrency),
      }),
    },
    {
      amount: computed.biweekly,
      to: input.biweeklyCurrency,
      assign: (amount) => ({
        biweekly: amount,
        formattedBiweekly: formatWageMoney(amount, input.biweeklyCurrency),
      }),
    },
    {
      amount: computed.monthly,
      to: input.monthlyCurrency,
      assign: (amount) => ({
        monthly: amount,
        formattedMonthly: formatWageMoney(amount, input.monthlyCurrency),
      }),
    },
    {
      amount: computed.annual,
      to: input.annualCurrency,
      assign: (amount) => ({
        annual: amount,
        formattedAnnual: formatWageMoney(amount, input.annualCurrency),
      }),
    },
  ];

  const display: Partial<WageCalculatorResult> = {};
  for (const pair of pairs) {
    const fx = convertMoney(pair.amount, from, pair.to, rates);
    if (!fx.ok) {
      errors.form = fx.message;
      return { isValid: false, errors, result: null };
    }
    Object.assign(display, pair.assign(fx.amount));
  }

  const result: WageCalculatorResult = {
    hourlyCanonical: computed.hourly,
    perSecondCanonical: computed.perSecond,
    perMinuteCanonical: computed.perMinute,
    dailyCanonical: computed.daily,
    weeklyCanonical: computed.weekly,
    biweeklyCanonical: computed.biweekly,
    monthlyCanonical: computed.monthly,
    annualCanonical: computed.annual,
    annualHours: computed.annualHours,
    hourly: display.hourly!,
    perSecond: display.perSecond!,
    perMinute: display.perMinute!,
    daily: display.daily!,
    weekly: display.weekly!,
    biweekly: display.biweekly!,
    monthly: display.monthly!,
    annual: display.annual!,
    hourlyCurrency: input.hourlyCurrency,
    perSecondCurrency: input.perSecondCurrency,
    perMinuteCurrency: input.perMinuteCurrency,
    dailyCurrency: input.dailyCurrency,
    weeklyCurrency: input.weeklyCurrency,
    biweeklyCurrency: input.biweeklyCurrency,
    monthlyCurrency: input.monthlyCurrency,
    annualCurrency: input.annualCurrency,
    sourceCurrency: from,
    formattedHourly: display.formattedHourly!,
    formattedPerSecond: display.formattedPerSecond!,
    formattedPerMinute: display.formattedPerMinute!,
    formattedDaily: display.formattedDaily!,
    formattedWeekly: display.formattedWeekly!,
    formattedBiweekly: display.formattedBiweekly!,
    formattedMonthly: display.formattedMonthly!,
    formattedAnnual: display.formattedAnnual!,
    sourceField,
  };

  return { isValid: true, errors, result };
}
