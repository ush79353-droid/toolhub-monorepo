import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculatePrivateSavings,
  formatPrivateSavingsMoney,
} from './calculation';
import type {
  PrivateSavingsFieldErrors,
  PrivateSavingsInput,
  PrivateSavingsResult,
} from './types';

export interface PrivateSavingsValidation {
  isValid: boolean;
  errors: PrivateSavingsFieldErrors;
  result: PrivateSavingsResult | null;
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
 * Validates monetary inputs, normalizes Y/T/C into the private-savings currency
 * with stored FX rates, then computes Sp = Y − T − C at full precision.
 * Zero and negative Sp (dissaving) are allowed. The additional-parameters
 * checkbox does not change the formula (no verified extra fields in specs).
 */
export function validatePrivateSavingsInput(
  input: PrivateSavingsInput,
  rates?: CurrencyRatesSnapshot | null
): PrivateSavingsValidation {
  const errors: PrivateSavingsFieldErrors = {};

  const income = parseNumber(input.totalIncome);
  const taxes = parseNumber(input.taxes);
  const consumption = parseNumber(input.consumption);

  if (!income.blank && (income.invalid || income.value === null)) {
    errors.totalIncome = 'Enter a valid total income.';
  }
  if (!taxes.blank && (taxes.invalid || taxes.value === null)) {
    errors.taxes = 'Enter a valid tax amount.';
  }
  if (!consumption.blank && (consumption.invalid || consumption.value === null)) {
    errors.consumption = 'Enter a valid consumption amount.';
  }

  const incomplete =
    income.blank ||
    taxes.blank ||
    consumption.blank ||
    Boolean(errors.totalIncome) ||
    Boolean(errors.taxes) ||
    Boolean(errors.consumption);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const target = input.privateSavingsCurrency;

  const incomeNorm = convertMoney(
    income.value!,
    input.totalIncomeCurrency,
    target,
    rates
  );
  if (!incomeNorm.ok) {
    errors.form = incomeNorm.message;
    return { isValid: false, errors, result: null };
  }

  const taxesNorm = convertMoney(
    taxes.value!,
    input.taxesCurrency,
    target,
    rates
  );
  if (!taxesNorm.ok) {
    errors.form = taxesNorm.message;
    return { isValid: false, errors, result: null };
  }

  const consumptionNorm = convertMoney(
    consumption.value!,
    input.consumptionCurrency,
    target,
    rates
  );
  if (!consumptionNorm.ok) {
    errors.form = consumptionNorm.message;
    return { isValid: false, errors, result: null };
  }

  const privateSavings = calculatePrivateSavings({
    totalIncome: incomeNorm.amount,
    taxes: taxesNorm.amount,
    consumption: consumptionNorm.amount,
  });

  if (privateSavings === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const result: PrivateSavingsResult = {
    privateSavings,
    privateSavingsCanonical: privateSavings,
    currency: target,
    formattedPrivateSavings: formatPrivateSavingsMoney(privateSavings, target),
    isDissaving: privateSavings < 0,
  };

  return { isValid: true, errors, result };
}
