import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateSemiMonthlyPay,
  formatSemiMonthlyMoney,
} from './calculation';
import type {
  SemiMonthlyPayFieldErrors,
  SemiMonthlyPayInput,
  SemiMonthlyPayResult,
  SemiMonthlyPaySourceField,
} from './types';

export interface SemiMonthlyPayValidation {
  isValid: boolean;
  errors: SemiMonthlyPayFieldErrors;
  result: SemiMonthlyPayResult | null;
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
  rates: CurrencyRatesSnapshot | null | undefined,
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

function sourceCurrency(input: SemiMonthlyPayInput): SupportedCurrency {
  switch (input.sourceField) {
    case 'hourly':
      return input.hourlyWageCurrency;
    case 'daily':
      return input.dailyWageCurrency;
    case 'weekly':
      return input.weeklyWageCurrency;
    case 'monthly':
      return input.monthlyWageCurrency;
    case 'yearly':
      return input.yearlyWageCurrency;
  }
}

function sourceRaw(input: SemiMonthlyPayInput): string {
  switch (input.sourceField) {
    case 'hourly':
      return input.hourlyWage;
    case 'daily':
      return input.dailyWage;
    case 'weekly':
      return input.weeklyWage;
    case 'monthly':
      return input.monthlyWage;
    case 'yearly':
      return input.yearlyWage;
  }
}

function wageErrorKey(
  field: SemiMonthlyPaySourceField,
): keyof SemiMonthlyPayFieldErrors {
  switch (field) {
    case 'hourly':
      return 'hourlyWage';
    case 'daily':
      return 'dailyWage';
    case 'weekly':
      return 'weeklyWage';
    case 'monthly':
      return 'monthlyWage';
    case 'yearly':
      return 'yearlyWage';
  }
}

/**
 * Validates authoritative wage (≥ 0) and schedule, derives all period wages in
 * the source currency, then FX-converts peers + semi-monthly into their
 * selected currencies. Hours/days never convert.
 */
export function validateSemiMonthlyPayInput(
  input: SemiMonthlyPayInput,
  rates?: CurrencyRatesSnapshot | null,
): SemiMonthlyPayValidation {
  const errors: SemiMonthlyPayFieldErrors = {};
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
  } else if (days.value > 7) {
    errors.daysPerWeek = 'Days per week cannot exceed 7.';
  }

  const incomplete =
    wage.blank ||
    Boolean(errors[wageKey]) ||
    Boolean(errors.hoursPerWeek) ||
    Boolean(errors.daysPerWeek);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateSemiMonthlyPay({
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

  const peers: {
    amount: number;
    currency: SupportedCurrency;
  }[] = [
    { amount: computed.hourly, currency: input.hourlyWageCurrency },
    { amount: computed.daily, currency: input.dailyWageCurrency },
    { amount: computed.weekly, currency: input.weeklyWageCurrency },
    { amount: computed.monthly, currency: input.monthlyWageCurrency },
    { amount: computed.yearly, currency: input.yearlyWageCurrency },
    { amount: computed.semiMonthly, currency: input.semiMonthlyCurrency },
  ];

  const converted: number[] = [];
  for (const peer of peers) {
    const fx = convertMoney(peer.amount, from, peer.currency, rates);
    if (!fx.ok) {
      errors.form = fx.message;
      return { isValid: false, errors, result: null };
    }
    converted.push(fx.amount);
  }

  const [
    hourlyDisp,
    dailyDisp,
    weeklyDisp,
    monthlyDisp,
    yearlyDisp,
    semiDisp,
  ] = converted;

  const result: SemiMonthlyPayResult = {
    hourlyCanonical: computed.hourly,
    dailyCanonical: computed.daily,
    weeklyCanonical: computed.weekly,
    monthlyCanonical: computed.monthly,
    yearlyCanonical: computed.yearly,
    semiMonthlyCanonical: computed.semiMonthly,
    formattedHourly: formatSemiMonthlyMoney(hourlyDisp, input.hourlyWageCurrency),
    formattedDaily: formatSemiMonthlyMoney(dailyDisp, input.dailyWageCurrency),
    formattedWeekly: formatSemiMonthlyMoney(weeklyDisp, input.weeklyWageCurrency),
    formattedMonthly: formatSemiMonthlyMoney(monthlyDisp, input.monthlyWageCurrency),
    formattedYearly: formatSemiMonthlyMoney(yearlyDisp, input.yearlyWageCurrency),
    semiMonthly: semiDisp,
    formattedSemiMonthly: formatSemiMonthlyMoney(
      semiDisp,
      input.semiMonthlyCurrency,
    ),
    sourceField,
    sourceCurrency: from,
    semiMonthlyCurrency: input.semiMonthlyCurrency,
  };

  return { isValid: true, errors: {}, result };
}
