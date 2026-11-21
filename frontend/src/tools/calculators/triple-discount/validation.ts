import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateTripleDiscount,
  formatEffectiveDiscountPercent,
  formatTripleDiscountMoney,
} from './calculation';
import type {
  TripleDiscountFieldErrors,
  TripleDiscountInput,
  TripleDiscountResult,
} from './types';

export interface TripleDiscountValidation {
  isValid: boolean;
  errors: TripleDiscountFieldErrors;
  result: TripleDiscountResult | null;
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
 * Validates original price (≥ 0) and three discount percents (0–100), computes
 * sequential triple-discount results in the original-price currency at full
 * precision, then FX-converts final price and price difference into their
 * independent display currencies. Discount percents and effective % never convert.
 */
export function validateTripleDiscountInput(
  input: TripleDiscountInput,
  rates?: CurrencyRatesSnapshot | null
): TripleDiscountValidation {
  const errors: TripleDiscountFieldErrors = {};

  const price = parseNumber(input.originalPrice);
  const d1 = parseNumber(input.firstDiscountPercent);
  const d2 = parseNumber(input.secondDiscountPercent);
  const d3 = parseNumber(input.thirdDiscountPercent);

  if (!price.blank && (price.invalid || price.value === null)) {
    errors.originalPrice = 'Enter a valid original price.';
  } else if (price.value !== null && price.value < 0) {
    errors.originalPrice = 'Original price must be zero or greater.';
  }

  if (!d1.blank && (d1.invalid || d1.value === null)) {
    errors.firstDiscountPercent = 'Enter a valid 1st discount percent.';
  } else if (d1.value !== null && (d1.value < 0 || d1.value > 100)) {
    errors.firstDiscountPercent = '1st discount must be between 0% and 100%.';
  }

  if (!d2.blank && (d2.invalid || d2.value === null)) {
    errors.secondDiscountPercent = 'Enter a valid 2nd discount percent.';
  } else if (d2.value !== null && (d2.value < 0 || d2.value > 100)) {
    errors.secondDiscountPercent = '2nd discount must be between 0% and 100%.';
  }

  if (!d3.blank && (d3.invalid || d3.value === null)) {
    errors.thirdDiscountPercent = 'Enter a valid 3rd discount percent.';
  } else if (d3.value !== null && (d3.value < 0 || d3.value > 100)) {
    errors.thirdDiscountPercent = '3rd discount must be between 0% and 100%.';
  }

  const incomplete =
    price.blank ||
    d1.blank ||
    d2.blank ||
    d3.blank ||
    Boolean(errors.originalPrice) ||
    Boolean(errors.firstDiscountPercent) ||
    Boolean(errors.secondDiscountPercent) ||
    Boolean(errors.thirdDiscountPercent);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateTripleDiscount({
    originalPrice: price.value!,
    firstDiscountPercent: d1.value!,
    secondDiscountPercent: d2.value!,
    thirdDiscountPercent: d3.value!,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const priceCurrency = input.originalPriceCurrency;

  const finalFx = convertMoney(
    computed.finalPrice,
    priceCurrency,
    input.finalPriceCurrency,
    rates
  );
  if (!finalFx.ok) {
    errors.form = finalFx.message;
    return { isValid: false, errors, result: null };
  }

  const diffFx = convertMoney(
    computed.priceDifference,
    priceCurrency,
    input.priceDifferenceCurrency,
    rates
  );
  if (!diffFx.ok) {
    errors.form = diffFx.message;
    return { isValid: false, errors, result: null };
  }

  const result: TripleDiscountResult = {
    finalPriceCanonical: computed.finalPrice,
    priceDifferenceCanonical: computed.priceDifference,
    effectiveDiscountPercent: computed.effectiveDiscountPercent,
    finalPrice: finalFx.amount,
    priceDifference: diffFx.amount,
    originalPriceCurrency: priceCurrency,
    finalPriceCurrency: input.finalPriceCurrency,
    priceDifferenceCurrency: input.priceDifferenceCurrency,
    formattedFinalPrice: formatTripleDiscountMoney(
      finalFx.amount,
      input.finalPriceCurrency
    ),
    formattedPriceDifference: formatTripleDiscountMoney(
      diffFx.amount,
      input.priceDifferenceCurrency
    ),
    formattedEffectiveDiscountPercent: formatEffectiveDiscountPercent(
      computed.effectiveDiscountPercent
    ),
  };

  return { isValid: true, errors, result };
}
