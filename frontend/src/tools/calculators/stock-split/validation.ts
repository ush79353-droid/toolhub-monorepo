import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateStockSplit,
  formatShareCount,
  formatStockSplitMoney,
} from './calculation';
import type {
  StockSplitFieldErrors,
  StockSplitInput,
  StockSplitResult,
} from './types';

export interface StockSplitValidation {
  isValid: boolean;
  errors: StockSplitFieldErrors;
  result: StockSplitResult | null;
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
 * Validates positive share count, nonnegative share price, and positive A/B
 * ratio values. Computes the split in the before-price currency at full
 * precision, then FX-converts after-price and portfolio values into their
 * independent display currencies. Share counts and ratios never convert.
 */
export function validateStockSplitInput(
  input: StockSplitInput,
  rates?: CurrencyRatesSnapshot | null
): StockSplitValidation {
  const errors: StockSplitFieldErrors = {};

  const shares = parseNumber(input.sharesBefore);
  const price = parseNumber(input.sharePriceBefore);
  const ratioA = parseNumber(input.ratioA);
  const ratioB = parseNumber(input.ratioB);

  if (!shares.blank && (shares.invalid || shares.value === null)) {
    errors.sharesBefore = 'Enter a valid number of shares.';
  } else if (shares.value !== null && shares.value <= 0) {
    errors.sharesBefore = 'Number of shares must be greater than zero.';
  }

  if (!price.blank && (price.invalid || price.value === null)) {
    errors.sharePriceBefore = 'Enter a valid share price.';
  } else if (price.value !== null && price.value < 0) {
    errors.sharePriceBefore = 'Share price must be zero or greater.';
  }

  if (!ratioA.blank && (ratioA.invalid || ratioA.value === null)) {
    errors.ratioA = 'Enter a valid A value for the A-for-B ratio.';
  } else if (ratioA.value !== null && ratioA.value <= 0) {
    errors.ratioA = 'Ratio A must be greater than zero.';
  }

  if (!ratioB.blank && (ratioB.invalid || ratioB.value === null)) {
    errors.ratioB = 'Enter a valid B value for the A-for-B ratio.';
  } else if (ratioB.value !== null && ratioB.value <= 0) {
    errors.ratioB = 'Ratio B must be greater than zero.';
  }

  const incomplete =
    shares.blank ||
    price.blank ||
    ratioA.blank ||
    ratioB.blank ||
    Boolean(errors.sharesBefore) ||
    Boolean(errors.sharePriceBefore) ||
    Boolean(errors.ratioA) ||
    Boolean(errors.ratioB);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateStockSplit({
    sharesBefore: shares.value!,
    sharePriceBefore: price.value!,
    ratioA: ratioA.value!,
    ratioB: ratioB.value!,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const priceCurrency = input.sharePriceBeforeCurrency;

  const afterPriceFx = convertMoney(
    computed.sharePriceAfter,
    priceCurrency,
    input.sharePriceAfterCurrency,
    rates
  );
  if (!afterPriceFx.ok) {
    errors.form = afterPriceFx.message;
    return { isValid: false, errors, result: null };
  }

  const portfolioBeforeFx = convertMoney(
    computed.portfolioValueBefore,
    priceCurrency,
    input.portfolioValueCurrency,
    rates
  );
  if (!portfolioBeforeFx.ok) {
    errors.form = portfolioBeforeFx.message;
    return { isValid: false, errors, result: null };
  }

  const portfolioAfterFx = convertMoney(
    computed.portfolioValueAfter,
    priceCurrency,
    input.portfolioValueCurrency,
    rates
  );
  if (!portfolioAfterFx.ok) {
    errors.form = portfolioAfterFx.message;
    return { isValid: false, errors, result: null };
  }

  const result: StockSplitResult = {
    sharesAfter: computed.sharesAfter,
    sharePriceAfterCanonical: computed.sharePriceAfter,
    portfolioValueBeforeCanonical: computed.portfolioValueBefore,
    portfolioValueAfterCanonical: computed.portfolioValueAfter,
    sharePriceAfter: afterPriceFx.amount,
    portfolioValueBefore: portfolioBeforeFx.amount,
    portfolioValueAfter: portfolioAfterFx.amount,
    sharePriceBeforeCurrency: priceCurrency,
    sharePriceAfterCurrency: input.sharePriceAfterCurrency,
    portfolioValueCurrency: input.portfolioValueCurrency,
    isForwardSplit: computed.isForwardSplit,
    isReverseSplit: computed.isReverseSplit,
    formattedSharesAfter: formatShareCount(computed.sharesAfter),
    formattedSharePriceAfter: formatStockSplitMoney(
      afterPriceFx.amount,
      input.sharePriceAfterCurrency
    ),
    formattedPortfolioValueBefore: formatStockSplitMoney(
      portfolioBeforeFx.amount,
      input.portfolioValueCurrency
    ),
    formattedPortfolioValueAfter: formatStockSplitMoney(
      portfolioAfterFx.amount,
      input.portfolioValueCurrency
    ),
  };

  return { isValid: true, errors, result };
}
