import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateStockAverage,
  formatStockAverageMoney,
  formatStockAveragePercent,
  formatStockAverageShares,
} from './calculation';
import type {
  StockAverageFieldErrors,
  StockAverageInput,
  StockAverageResult,
} from './types';

export interface StockAverageValidation {
  isValid: boolean;
  errors: StockAverageFieldErrors;
  result: StockAverageResult | null;
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
 * Requires both purchases complete. Share counts > 0; prices ≥ 0.
 * Normalizes 2nd buy price and optional current price into 1st buy currency.
 * Share quantities and return % never FX-convert.
 */
export function validateStockAverageInput(
  input: StockAverageInput,
  rates?: CurrencyRatesSnapshot | null
): StockAverageValidation {
  const errors: StockAverageFieldErrors = {};

  const current = parseNumber(input.currentPrice);
  const q1 = parseNumber(input.firstBuyShares);
  const p1 = parseNumber(input.firstBuyPrice);
  const q2 = parseNumber(input.secondBuyShares);
  const p2 = parseNumber(input.secondBuyPrice);

  if (!current.blank && (current.invalid || current.value === null)) {
    errors.currentPrice = 'Enter a valid current stock price.';
  } else if (current.value !== null && current.value < 0) {
    errors.currentPrice = 'Current stock price must be zero or greater.';
  }

  if (!q1.blank && (q1.invalid || q1.value === null)) {
    errors.firstBuyShares = 'Enter a valid 1st buy share count.';
  } else if (q1.value !== null && q1.value <= 0) {
    errors.firstBuyShares = '1st buy shares must be greater than zero.';
  }

  if (!p1.blank && (p1.invalid || p1.value === null)) {
    errors.firstBuyPrice = 'Enter a valid 1st buy price.';
  } else if (p1.value !== null && p1.value < 0) {
    errors.firstBuyPrice = '1st buy price must be zero or greater.';
  }

  if (!q2.blank && (q2.invalid || q2.value === null)) {
    errors.secondBuyShares = 'Enter a valid 2nd buy share count.';
  } else if (q2.value !== null && q2.value <= 0) {
    errors.secondBuyShares = '2nd buy shares must be greater than zero.';
  }

  if (!p2.blank && (p2.invalid || p2.value === null)) {
    errors.secondBuyPrice = 'Enter a valid 2nd buy price.';
  } else if (p2.value !== null && p2.value < 0) {
    errors.secondBuyPrice = '2nd buy price must be zero or greater.';
  }

  const incomplete =
    q1.blank ||
    p1.blank ||
    q2.blank ||
    p2.blank ||
    Boolean(errors.currentPrice) ||
    Boolean(errors.firstBuyShares) ||
    Boolean(errors.firstBuyPrice) ||
    Boolean(errors.secondBuyShares) ||
    Boolean(errors.secondBuyPrice);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const resultCurrency = input.firstBuyPriceCurrency;

  const p2Fx = convertMoney(
    p2.value!,
    input.secondBuyPriceCurrency,
    resultCurrency,
    rates
  );
  if (!p2Fx.ok) {
    errors.form = p2Fx.message;
    return { isValid: false, errors, result: null };
  }

  let currentCanonical: number | null = null;
  if (!current.blank && current.value !== null) {
    const mFx = convertMoney(
      current.value,
      input.currentPriceCurrency,
      resultCurrency,
      rates
    );
    if (!mFx.ok) {
      errors.form = mFx.message;
      return { isValid: false, errors, result: null };
    }
    currentCanonical = mFx.amount;
  }

  const computed = calculateStockAverage({
    firstBuyShares: q1.value!,
    firstBuyPrice: p1.value!,
    secondBuyShares: q2.value!,
    secondBuyPrice: p2Fx.amount,
    currentPrice: currentCanonical,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const result: StockAverageResult = {
    totalShares: computed.totalShares,
    totalCostCanonical: computed.totalCost,
    averagePriceCanonical: computed.averagePrice,
    marketValueCanonical: computed.marketValue,
    profitLossCanonical: computed.profitLoss,
    returnPercent: computed.returnPercent,
    resultCurrency,
    formattedTotalShares: formatStockAverageShares(computed.totalShares),
    formattedTotalCost: formatStockAverageMoney(
      computed.totalCost,
      resultCurrency
    ),
    formattedAveragePrice: formatStockAverageMoney(
      computed.averagePrice,
      resultCurrency
    ),
    formattedMarketValue:
      computed.marketValue === null
        ? null
        : formatStockAverageMoney(computed.marketValue, resultCurrency),
    formattedProfitLoss:
      computed.profitLoss === null
        ? null
        : formatStockAverageMoney(computed.profitLoss, resultCurrency),
    formattedReturnPercent:
      computed.returnPercent === null
        ? null
        : formatStockAveragePercent(computed.returnPercent),
  };

  return { isValid: true, errors, result };
}
