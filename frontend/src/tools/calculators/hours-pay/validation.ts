import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { calculateHoursPay, formatHoursPayMoney } from './calculation';
import type {
  HoursPayFieldErrors,
  HoursPayInput,
  HoursPayResult,
  HoursPaySourceField,
} from './types';

export interface HoursPayValidation {
  isValid: boolean;
  errors: HoursPayFieldErrors;
  result: HoursPayResult | null;
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

function sourceCurrency(input: HoursPayInput): SupportedCurrency {
  if (input.sourceField === 'daily') return input.dailyPayCurrency;
  if (input.sourceField === 'weekly') return input.weeklyPayCurrency;
  if (input.sourceField === 'monthly') return input.monthlyPayCurrency;
  return input.annualPayCurrency;
}

function sourceRaw(input: HoursPayInput): string {
  if (input.sourceField === 'daily') return input.dailyPay;
  if (input.sourceField === 'weekly') return input.weeklyPay;
  if (input.sourceField === 'monthly') return input.monthlyPay;
  return input.annualPay;
}

function payErrorKey(
  field: HoursPaySourceField
): keyof HoursPayFieldErrors {
  if (field === 'daily') return 'dailyPay';
  if (field === 'weekly') return 'weeklyPay';
  if (field === 'monthly') return 'monthlyPay';
  return 'annualPay';
}

/**
 * Validates the authoritative pay (≥ 0) and positive working-time inputs,
 * computes periods in the source currency, then FX-converts each money amount
 * into its independent display currency. Hours/days/weeks never convert.
 */
export function validateHoursPayInput(
  input: HoursPayInput,
  rates?: CurrencyRatesSnapshot | null
): HoursPayValidation {
  const errors: HoursPayFieldErrors = {};
  const sourceField = input.sourceField;
  const pay = parseNumber(sourceRaw(input));
  const hours = parseNumber(input.hoursPerDay);
  const days = parseNumber(input.daysPerWeek);
  const weeks = parseNumber(input.weeksPerYear);

  const payKey = payErrorKey(sourceField);
  if (!pay.blank && (pay.invalid || pay.value === null)) {
    errors[payKey] = 'Enter a valid pay amount.';
  } else if (pay.value !== null && pay.value < 0) {
    errors[payKey] = 'Pay must be zero or greater.';
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

  const incomplete =
    pay.blank ||
    Boolean(errors[payKey]) ||
    Boolean(errors.hoursPerDay) ||
    Boolean(errors.daysPerWeek) ||
    Boolean(errors.weeksPerYear);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateHoursPay({
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
    { amount: computed.daily, to: input.dailyPayCurrency },
    { amount: computed.weekly, to: input.weeklyPayCurrency },
    { amount: computed.monthly, to: input.monthlyPayCurrency },
    { amount: computed.annual, to: input.annualPayCurrency },
    { amount: computed.hourly, to: input.hourlyCurrency },
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

  const [daily, weekly, monthly, annual, hourly] = converted;

  const result: HoursPayResult = {
    dailyCanonical: computed.daily,
    weeklyCanonical: computed.weekly,
    monthlyCanonical: computed.monthly,
    annualCanonical: computed.annual,
    hourlyCanonical: computed.hourly,
    daily,
    weekly,
    monthly,
    annual,
    hourly,
    sourceField,
    sourceCurrency: from,
    dailyPayCurrency: input.dailyPayCurrency,
    weeklyPayCurrency: input.weeklyPayCurrency,
    monthlyPayCurrency: input.monthlyPayCurrency,
    annualPayCurrency: input.annualPayCurrency,
    hourlyCurrency: input.hourlyCurrency,
    formattedDaily: formatHoursPayMoney(daily, input.dailyPayCurrency),
    formattedWeekly: formatHoursPayMoney(weekly, input.weeklyPayCurrency),
    formattedMonthly: formatHoursPayMoney(monthly, input.monthlyPayCurrency),
    formattedAnnual: formatHoursPayMoney(annual, input.annualPayCurrency),
    formattedHourly: formatHoursPayMoney(hourly, input.hourlyCurrency),
  };

  return { isValid: true, errors, result };
}
