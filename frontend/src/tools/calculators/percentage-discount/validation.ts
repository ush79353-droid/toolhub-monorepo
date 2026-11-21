import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculatePercentageDiscount,
  formatPercentageDiscountMoney,
} from './calculation';
import type {
  PercentageDiscountFieldErrors,
  PercentageDiscountInput,
  PercentageDiscountResult,
} from './types';

export interface PercentageDiscountValidation {
  isValid: boolean;
  errors: PercentageDiscountFieldErrors;
  result: PercentageDiscountResult | null;
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
 * Validates price before (≥ 0) and discount percent (0–100), computes
 * percent-off results in the price-before currency at full precision, then
 * FX-converts each result into its independent display currency. Discount %
 * never converts.
 */
export function validatePercentageDiscountInput(
  input: PercentageDiscountInput,
  rates?: CurrencyRatesSnapshot | null
): PercentageDiscountValidation {
  const errors: PercentageDiscountFieldErrors = {};

  const price = parseNumber(input.priceBefore);
  const rate = parseNumber(input.discountPercent);

  if (!price.blank && (price.invalid || price.value === null)) {
    errors.priceBefore = 'Enter a valid price before discount.';
  } else if (price.value !== null && price.value < 0) {
    errors.priceBefore = 'Price before discount must be zero or greater.';
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.discountPercent = 'Enter a valid discount percent.';
  } else if (rate.value !== null && (rate.value < 0 || rate.value > 100)) {
    errors.discountPercent = 'Discount must be between 0% and 100%.';
  }

  const incomplete =
    price.blank ||
    rate.blank ||
    Boolean(errors.priceBefore) ||
    Boolean(errors.discountPercent);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculatePercentageDiscount({
    priceBefore: price.value!,
    discountPercent: rate.value!,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const priceCurrency = input.priceBeforeCurrency;

  const afterFx = convertMoney(
    computed.priceAfter,
    priceCurrency,
    input.priceAfterCurrency,
    rates
  );
  if (!afterFx.ok) {
    errors.form = afterFx.message;
    return { isValid: false, errors, result: null };
  }

  const saveFx = convertMoney(
    computed.discountAmount,
    priceCurrency,
    input.youSaveCurrency,
    rates
  );
  if (!saveFx.ok) {
    errors.form = saveFx.message;
    return { isValid: false, errors, result: null };
  }

  const result: PercentageDiscountResult = {
    priceAfterCanonical: computed.priceAfter,
    youSaveCanonical: computed.discountAmount,
    priceAfter: afterFx.amount,
    youSave: saveFx.amount,
    priceBeforeCurrency: priceCurrency,
    priceAfterCurrency: input.priceAfterCurrency,
    youSaveCurrency: input.youSaveCurrency,
    formattedPriceAfter: formatPercentageDiscountMoney(
      afterFx.amount,
      input.priceAfterCurrency
    ),
    formattedYouSave: formatPercentageDiscountMoney(
      saveFx.amount,
      input.youSaveCurrency
    ),
  };

  return { isValid: true, errors, result };
}
