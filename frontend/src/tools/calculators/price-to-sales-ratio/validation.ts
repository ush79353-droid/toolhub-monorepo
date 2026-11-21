import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculatePriceToSales,
  formatPriceSalesMoney,
  formatPriceToSalesRatio,
} from './calculation';
import type {
  PriceToSalesFieldErrors,
  PriceToSalesInput,
  PriceToSalesResult,
} from './types';

export interface PriceToSalesValidation {
  isValid: boolean;
  errors: PriceToSalesFieldErrors;
  result: PriceToSalesResult | null;
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
 * Validates inputs, normalizes price into the sales currency, computes SPS and
 * P/S at full precision, then converts SPS into its independent display
 * currency. Share counts and the dimensionless ratio are never FX-converted.
 * Zero SPS → ratio undefined (not Infinity). Zero price is valid (P/S = 0).
 */
export function validatePriceToSalesInput(
  input: PriceToSalesInput,
  rates?: CurrencyRatesSnapshot | null
): PriceToSalesValidation {
  const errors: PriceToSalesFieldErrors = {};

  const sales = parseNumber(input.sales);
  const shares = parseNumber(input.sharesOutstanding);
  const price = parseNumber(input.pricePerShare);

  if (!sales.blank && (sales.invalid || sales.value === null)) {
    errors.sales = 'Enter a valid sales amount.';
  } else if (!sales.blank && sales.value !== null && sales.value < 0) {
    errors.sales = 'Sales cannot be negative.';
  }

  if (!shares.blank && (shares.invalid || shares.value === null)) {
    errors.sharesOutstanding = 'Enter a valid number of shares.';
  } else if (!shares.blank && shares.value !== null && !(shares.value > 0)) {
    errors.sharesOutstanding = 'Shares outstanding must be greater than zero.';
  }

  if (!price.blank && (price.invalid || price.value === null)) {
    errors.pricePerShare = 'Enter a valid price per share.';
  } else if (!price.blank && price.value !== null && price.value < 0) {
    errors.pricePerShare = 'Price per share cannot be negative.';
  }

  const incomplete =
    sales.blank ||
    shares.blank ||
    Boolean(errors.sales) ||
    Boolean(errors.sharesOutstanding);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  let priceInSales: number | null = null;
  if (!price.blank && !errors.pricePerShare && price.value !== null) {
    const converted = convertMoney(
      price.value,
      input.pricePerShareCurrency,
      input.salesCurrency,
      rates
    );
    if (!converted.ok) {
      errors.form = converted.message;
      return { isValid: false, errors, result: null };
    }
    priceInSales = converted.amount;
  }

  const computed = calculatePriceToSales({
    sales: sales.value!,
    sharesOutstanding: shares.value!,
    pricePerShare: priceInSales,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const spsOut = convertMoney(
    computed.salesPerShare,
    input.salesCurrency,
    input.salesPerShareCurrency,
    rates
  );
  if (!spsOut.ok) {
    errors.form = spsOut.message;
    return { isValid: false, errors, result: null };
  }

  const negativeRatioNote =
    computed.priceToSalesRatio !== null && computed.priceToSalesRatio < 0
      ? 'Negative P/S ratios are generally unsuitable for conventional valuation comparison.'
      : null;

  const result: PriceToSalesResult = {
    salesPerShareInSalesCurrency: computed.salesPerShare,
    salesPerShare: spsOut.amount,
    priceToSalesRatio: computed.priceToSalesRatio,
    ratioUndefined: computed.ratioUndefined,
    salesCurrency: input.salesCurrency,
    salesPerShareCurrency: input.salesPerShareCurrency,
    pricePerShareCurrency: input.pricePerShareCurrency,
    formattedSalesPerShare: formatPriceSalesMoney(
      spsOut.amount,
      input.salesPerShareCurrency
    ),
    formattedPriceToSalesRatio:
      computed.priceToSalesRatio !== null
        ? formatPriceToSalesRatio(computed.priceToSalesRatio)
        : null,
    negativeRatioNote,
  };

  return { isValid: true, errors, result };
}
