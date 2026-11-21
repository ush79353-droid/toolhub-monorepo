import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateFutureSalary,
  formatFutureSalaryMoney,
} from './calculation';
import type {
  FutureSalaryFieldErrors,
  FutureSalaryInput,
  FutureSalaryResult,
} from './types';

export interface FutureSalaryValidation {
  isValid: boolean;
  errors: FutureSalaryFieldErrors;
  result: FutureSalaryResult | null;
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
 * Validates inputs, computes compound future + real salary in the current-
 * salary currency, then FX-converts each result into its independent display
 * currency. Growth %, inflation %, and years are never converted.
 */
export function validateFutureSalaryInput(
  input: FutureSalaryInput,
  rates?: CurrencyRatesSnapshot | null
): FutureSalaryValidation {
  const errors: FutureSalaryFieldErrors = {};

  const current = parseNumber(input.currentSalary);
  const growth = parseNumber(input.salaryGrowthPercent);
  const years = parseNumber(input.years);
  const inflation = parseNumber(input.inflationPercent);

  if (current.blank || current.invalid || current.value === null) {
    errors.currentSalary = 'Enter a valid current salary.';
  } else if (!(current.value >= 0)) {
    errors.currentSalary = 'Current salary must be zero or greater.';
  }

  if (growth.blank || growth.invalid || growth.value === null) {
    errors.salaryGrowthPercent = 'Enter a valid average salary change.';
  } else if (!(growth.value > -100)) {
    errors.salaryGrowthPercent =
      'Salary change must be greater than −100%.';
  }

  if (years.blank || years.invalid || years.value === null) {
    errors.years = 'Enter a valid number of years.';
  } else if (!(years.value >= 0)) {
    errors.years = 'Number of years must be zero or greater.';
  }

  if (inflation.blank || inflation.invalid || inflation.value === null) {
    errors.inflationPercent = 'Enter a valid average inflation rate.';
  } else if (!(inflation.value > -100)) {
    errors.inflationPercent = 'Inflation must be greater than −100%.';
  }

  if (
    Boolean(errors.currentSalary) ||
    Boolean(errors.salaryGrowthPercent) ||
    Boolean(errors.years) ||
    Boolean(errors.inflationPercent)
  ) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateFutureSalary({
    currentSalary: current.value!,
    salaryGrowthPercent: growth.value!,
    years: years.value!,
    inflationPercent: inflation.value!,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const baseCurrency = input.currentSalaryCurrency;

  const futureFx = convertMoney(
    computed.futureSalary,
    baseCurrency,
    input.futureSalaryCurrency,
    rates
  );
  if (!futureFx.ok) {
    errors.form = futureFx.message;
    return { isValid: false, errors, result: null };
  }

  const realFx = convertMoney(
    computed.realSalary,
    baseCurrency,
    input.realSalaryCurrency,
    rates
  );
  if (!realFx.ok) {
    errors.form = realFx.message;
    return { isValid: false, errors, result: null };
  }

  const result: FutureSalaryResult = {
    futureSalaryCanonical: computed.futureSalary,
    realSalaryCanonical: computed.realSalary,
    futureSalary: futureFx.amount,
    realSalary: realFx.amount,
    currentSalaryCurrency: baseCurrency,
    futureSalaryCurrency: input.futureSalaryCurrency,
    realSalaryCurrency: input.realSalaryCurrency,
    formattedFutureSalary: formatFutureSalaryMoney(
      futureFx.amount,
      input.futureSalaryCurrency
    ),
    formattedRealSalary: formatFutureSalaryMoney(
      realFx.amount,
      input.realSalaryCurrency
    ),
  };

  return { isValid: true, errors, result };
}
