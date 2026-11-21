import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateDividendYield,
  formatDividendMoney,
  formatYieldPercent,
  isDividendFrequency,
  paymentsPerYearForFrequency,
} from './calculation';
import type {
  DividendYieldFieldErrors,
  DividendYieldInput,
  DividendYieldResult,
} from './types';

export interface DividendYieldValidation {
  isValid: boolean;
  errors: DividendYieldFieldErrors;
  result: DividendYieldResult | null;
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
 * Validates inputs, normalizes share price into the dividends-per-period
 * currency, computes annual dividends and yield at full precision, then converts
 * annual dividends into its independent display currency. Frequency and yield %
 * are never FX-converted. Missing frequency blocks results.
 */
export function validateDividendYieldInput(
  input: DividendYieldInput,
  rates?: CurrencyRatesSnapshot | null
): DividendYieldValidation {
  const errors: DividendYieldFieldErrors = {};

  const period = parseNumber(input.dividendsPerPeriod);
  const price = parseNumber(input.sharePrice);

  if (!period.blank && (period.invalid || period.value === null)) {
    errors.dividendsPerPeriod = 'Enter a valid dividends per period amount.';
  } else if (!period.blank && period.value !== null && period.value < 0) {
    errors.dividendsPerPeriod = 'Dividends per period cannot be negative.';
  }

  if (input.frequency === '') {
    // Required selection — do not invent a payment count.
  } else if (!isDividendFrequency(input.frequency)) {
    errors.frequency = 'Select a valid dividend frequency.';
  }

  if (!price.blank && (price.invalid || price.value === null)) {
    errors.sharePrice = 'Enter a valid share price.';
  } else if (!price.blank && price.value !== null && !(price.value > 0)) {
    errors.sharePrice = 'Share price must be greater than zero.';
  }

  const frequencyMissing = input.frequency === '';
  const incomplete =
    period.blank ||
    frequencyMissing ||
    Boolean(errors.dividendsPerPeriod) ||
    Boolean(errors.frequency);

  if (incomplete) {
    if (frequencyMissing && !period.blank && !errors.dividendsPerPeriod) {
      errors.frequency = 'Select a dividend frequency.';
    }
    return { isValid: false, errors, result: null };
  }

  const paymentsPerYear = paymentsPerYearForFrequency(input.frequency);
  if (paymentsPerYear === null) {
    errors.frequency = 'Select a valid dividend frequency.';
    return { isValid: false, errors, result: null };
  }

  let shareInPeriod: number | null = null;
  if (!price.blank && !errors.sharePrice && price.value !== null) {
    const converted = convertMoney(
      price.value,
      input.sharePriceCurrency,
      input.dividendsPerPeriodCurrency,
      rates
    );
    if (!converted.ok) {
      errors.form = converted.message;
      return { isValid: false, errors, result: null };
    }
    shareInPeriod = converted.amount;
  }

  const computed = calculateDividendYield({
    dividendsPerPeriod: period.value!,
    paymentsPerYear,
    // Invalid/blank share price → annual dividends only (no misleading yield).
    sharePrice: shareInPeriod,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const annualOut = convertMoney(
    computed.annualDividends,
    input.dividendsPerPeriodCurrency,
    input.annualDividendsCurrency,
    rates
  );
  if (!annualOut.ok) {
    errors.form = annualOut.message;
    return { isValid: false, errors, result: null };
  }

  const result: DividendYieldResult = {
    annualDividendsInPeriodCurrency: computed.annualDividends,
    annualDividends: annualOut.amount,
    dividendYieldPercent: computed.dividendYieldPercent,
    dividendsPerPeriodCurrency: input.dividendsPerPeriodCurrency,
    annualDividendsCurrency: input.annualDividendsCurrency,
    sharePriceCurrency: input.sharePriceCurrency,
    formattedAnnualDividends: formatDividendMoney(
      annualOut.amount,
      input.annualDividendsCurrency
    ),
    formattedDividendYieldPercent:
      computed.dividendYieldPercent !== null
        ? formatYieldPercent(computed.dividendYieldPercent)
        : null,
    paymentsPerYear,
  };

  // Annual section can succeed while share-price field still shows an error.
  return { isValid: true, errors, result };
}
