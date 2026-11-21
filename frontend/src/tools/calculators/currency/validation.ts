import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  convertAmountWithRates,
  formatCurrencyAmount,
  formatFxRate,
} from './calculation';
import type {
  CurrencyCalculatorFieldErrors,
  CurrencyCalculatorInput,
  CurrencyCalculatorResult,
} from './types';

export interface CurrencyCalculatorValidation {
  isValid: boolean;
  errors: CurrencyCalculatorFieldErrors;
  result: CurrencyCalculatorResult | null;
}

function parseAmount(raw: string): {
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

export function validateCurrencyCalculatorInput(
  input: CurrencyCalculatorInput,
  rates?: CurrencyRatesSnapshot | null
): CurrencyCalculatorValidation {
  const errors: CurrencyCalculatorFieldErrors = {};
  const parsed = parseAmount(input.amount);

  if (parsed.blank) {
    errors.amount = 'Enter an amount.';
  } else if (parsed.invalid || parsed.value === null) {
    errors.amount = 'Enter a valid positive number.';
  } else if (parsed.value < 0) {
    errors.amount = 'Amount cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const amount = parsed.value!;
  const computation = convertAmountWithRates(
    amount,
    input.fromCurrency,
    input.toCurrency,
    rates
  );

  if (!computation) {
    errors.form = CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
    return { isValid: false, errors, result: null };
  }

  const result: CurrencyCalculatorResult = {
    amount: computation.amount,
    fromCurrency: input.fromCurrency,
    toCurrency: input.toCurrency,
    convertedAmount: computation.convertedAmount,
    rateFromTo: computation.rateFromTo,
    rateToFrom: computation.rateToFrom,
    formattedAmount: formatCurrencyAmount(computation.amount, input.fromCurrency),
    formattedConvertedAmount: formatCurrencyAmount(
      computation.convertedAmount,
      input.toCurrency
    ),
    formattedRateFromTo: formatFxRate(computation.rateFromTo),
    formattedRateToFrom: formatFxRate(computation.rateToFrom),
    sameCurrency: computation.sameCurrency,
    fetchedAt: rates?.fetchedAt ?? null,
    isStale: Boolean(rates?.isStale),
    ratesAvailable: Boolean(rates?.available) || computation.sameCurrency,
  };

  return { isValid: true, errors: {}, result };
}
