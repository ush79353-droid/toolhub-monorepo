import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculatePercentOffDiscount,
  formatDiscountMoney,
} from './calculation';
import type {
  DiscountFieldErrors,
  DiscountInput,
  DiscountResult,
} from './types';

export interface DiscountValidation {
  isValid: boolean;
  errors: DiscountFieldErrors;
  result: DiscountResult | null;
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
 * Validates original price (≥ 0) and discount percent (0–100), computes
 * percent-off results in the original-price currency at full precision, then
 * FX-converts each result into its independent display currency. Discount %
 * and tax-included never convert. Tax-included does not change the math.
 */
export function validateDiscountInput(
  input: DiscountInput,
  rates?: CurrencyRatesSnapshot | null
): DiscountValidation {
  const errors: DiscountFieldErrors = {};

  const price = parseNumber(input.originalPrice);
  const rate = parseNumber(input.discountPercent);

  if (!price.blank && (price.invalid || price.value === null)) {
    errors.originalPrice = 'Enter a valid original price.';
  } else if (price.value !== null && price.value < 0) {
    errors.originalPrice = 'Original price must be zero or greater.';
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.discountPercent = 'Enter a valid discount percent.';
  } else if (rate.value !== null && (rate.value < 0 || rate.value > 100)) {
    errors.discountPercent = 'Discount must be between 0% and 100%.';
  }

  const incomplete =
    price.blank ||
    rate.blank ||
    Boolean(errors.originalPrice) ||
    Boolean(errors.discountPercent);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  // Only verified mode is percent_off; other types are not implemented.
  if (input.discountType !== 'percent_off') {
    errors.form = 'This discount type is not supported.';
    return { isValid: false, errors, result: null };
  }

  const computed = calculatePercentOffDiscount({
    originalPrice: price.value!,
    discountPercent: rate.value!,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const priceCurrency = input.originalPriceCurrency;

  const payFx = convertMoney(
    computed.finalPrice,
    priceCurrency,
    input.youPayCurrency,
    rates
  );
  if (!payFx.ok) {
    errors.form = payFx.message;
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

  const result: DiscountResult = {
    youPayCanonical: computed.finalPrice,
    youSaveCanonical: computed.discountAmount,
    youPay: payFx.amount,
    youSave: saveFx.amount,
    originalPriceCurrency: priceCurrency,
    youPayCurrency: input.youPayCurrency,
    youSaveCurrency: input.youSaveCurrency,
    formattedYouPay: formatDiscountMoney(payFx.amount, input.youPayCurrency),
    formattedYouSave: formatDiscountMoney(
      saveFx.amount,
      input.youSaveCurrency
    ),
    taxIncluded: input.taxIncluded,
  };

  return { isValid: true, errors, result };
}
