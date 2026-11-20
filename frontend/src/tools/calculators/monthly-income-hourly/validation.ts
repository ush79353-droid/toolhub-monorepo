import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateMonthlyIncomeHourly,
  formatMonthlyIncomeHourlyMoney,
} from './calculation';
import type {
  MonthlyIncomeHourlyFieldErrors,
  MonthlyIncomeHourlyInput,
  MonthlyIncomeHourlyResult,
  MonthlyIncomeHourlySourceField,
} from './types';

export interface MonthlyIncomeHourlyValidation {
  isValid: boolean;
  errors: MonthlyIncomeHourlyFieldErrors;
  result: MonthlyIncomeHourlyResult | null;
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

export function validateMonthlyIncomeHourlyInput(
  input: MonthlyIncomeHourlyInput,
  rates?: CurrencyRatesSnapshot | null
): MonthlyIncomeHourlyValidation {
  const errors: MonthlyIncomeHourlyFieldErrors = {};
  const sourceField: MonthlyIncomeHourlySourceField = input.sourceField;
  const hours = parseNumber(input.hoursPerWeek);
  const wage = parseNumber(input[sourceField]);

  if (!hours.blank && (hours.invalid || hours.value === null)) {
    errors.hoursPerWeek = 'Enter a valid hours-per-week value.';
  } else if (hours.value !== null && hours.value <= 0) {
    errors.hoursPerWeek = 'Hours per week must be greater than zero.';
  }

  if (!wage.blank && (wage.invalid || wage.value === null)) {
    errors[sourceField] = 'Enter a valid income amount.';
  } else if (wage.value !== null && wage.value < 0) {
    errors[sourceField] = 'Income must be zero or greater.';
  }

  if (
    hours.blank ||
    wage.blank ||
    Boolean(errors.hoursPerWeek) ||
    Boolean(errors[sourceField])
  ) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateMonthlyIncomeHourly({
    hoursPerWeek: hours.value!,
    sourceField,
    sourceAmount: wage.value!,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const from =
    sourceField === 'monthly' ? input.monthlyCurrency : input.hourlyCurrency;

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

  const result: MonthlyIncomeHourlyResult = {
    monthlyCanonical: computed.monthly,
    hourlyCanonical: computed.hourly,
    annualHours: computed.annualHours,
    monthly: monthlyFx.amount,
    hourly: hourlyFx.amount,
    monthlyCurrency: input.monthlyCurrency,
    hourlyCurrency: input.hourlyCurrency,
    sourceCurrency: from,
    formattedMonthly: formatMonthlyIncomeHourlyMoney(
      monthlyFx.amount,
      input.monthlyCurrency
    ),
    formattedHourly: formatMonthlyIncomeHourlyMoney(
      hourlyFx.amount,
      input.hourlyCurrency
    ),
    sourceField,
  };

  return { isValid: true, errors, result };
}
