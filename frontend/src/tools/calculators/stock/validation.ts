import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateStockTrade,
  formatStockMoney,
  formatStockPercent,
} from './calculation';
import type { StockFieldErrors, StockInput, StockResult } from './types';

export interface StockValidation {
  isValid: boolean;
  errors: StockFieldErrors;
  result: StockResult | null;
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
 * Validates share count / prices / commissions, normalizes selling price into
 * buying-price currency, runs trade math at full precision, then FX-converts
 * each money result into its independent display currency. Shares, commission
 * percents, and ROI % never convert.
 */
export function validateStockInput(
  input: StockInput,
  rates?: CurrencyRatesSnapshot | null
): StockValidation {
  const errors: StockFieldErrors = {};

  const shares = parseNumber(input.numberOfShares);
  const buy = parseNumber(input.buyingPrice);
  const buyComm = parseNumber(input.buyingCommissionPercent);
  const sell = parseNumber(input.sellingPrice);
  const sellComm = parseNumber(input.sellingCommissionPercent);

  if (!shares.blank && (shares.invalid || shares.value === null)) {
    errors.numberOfShares = 'Enter a valid number of shares.';
  } else if (shares.value !== null && !(shares.value > 0)) {
    errors.numberOfShares = 'Number of shares must be greater than zero.';
  }

  if (!buy.blank && (buy.invalid || buy.value === null)) {
    errors.buyingPrice = 'Enter a valid buying price per share.';
  } else if (buy.value !== null && buy.value < 0) {
    errors.buyingPrice = 'Buying price must be zero or greater.';
  }

  if (!buyComm.blank && (buyComm.invalid || buyComm.value === null)) {
    errors.buyingCommissionPercent = 'Enter a valid buying commission percent.';
  } else if (
    buyComm.value !== null &&
    (buyComm.value < 0 || buyComm.value > 100)
  ) {
    errors.buyingCommissionPercent =
      'Buying commission must be between 0% and 100%.';
  }

  if (!sell.blank && (sell.invalid || sell.value === null)) {
    errors.sellingPrice = 'Enter a valid selling price per share.';
  } else if (sell.value !== null && sell.value < 0) {
    errors.sellingPrice = 'Selling price must be zero or greater.';
  }

  if (!sellComm.blank && (sellComm.invalid || sellComm.value === null)) {
    errors.sellingCommissionPercent =
      'Enter a valid selling commission percent.';
  } else if (
    sellComm.value !== null &&
    (sellComm.value < 0 || sellComm.value > 100)
  ) {
    errors.sellingCommissionPercent =
      'Selling commission must be between 0% and 100%.';
  }

  const incomplete =
    shares.blank ||
    buy.blank ||
    buyComm.blank ||
    sell.blank ||
    sellComm.blank ||
    Boolean(errors.numberOfShares) ||
    Boolean(errors.buyingPrice) ||
    Boolean(errors.buyingCommissionPercent) ||
    Boolean(errors.sellingPrice) ||
    Boolean(errors.sellingCommissionPercent);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const buyCurrency = input.buyingPriceCurrency;

  // Normalize selling price into buying-price currency before trade math.
  const sellNormalized = convertMoney(
    sell.value!,
    input.sellingPriceCurrency,
    buyCurrency,
    rates
  );
  if (!sellNormalized.ok) {
    errors.form = sellNormalized.message;
    return { isValid: false, errors, result: null };
  }

  if (sellComm.value === 100) {
    errors.sellingCommissionPercent =
      'Break-even selling price is undefined when selling commission is 100%.';
    return { isValid: false, errors, result: null };
  }

  const computed = calculateStockTrade({
    numberOfShares: shares.value!,
    buyingPrice: buy.value!,
    buyingCommissionPercent: buyComm.value!,
    sellingPrice: sellNormalized.amount,
    sellingCommissionPercent: sellComm.value!,
  });

  if (computed === null) {
    errors.form =
      'This combination does not produce a finite trade result. Check that net buying cost is greater than zero and commissions are valid.';
    return { isValid: false, errors, result: null };
  }

  const buyCommFx = convertMoney(
    computed.buyingCommissionAmount,
    buyCurrency,
    input.buyingCommissionAmountCurrency,
    rates
  );
  if (!buyCommFx.ok) {
    errors.form = buyCommFx.message;
    return { isValid: false, errors, result: null };
  }

  const netBuyFx = convertMoney(
    computed.netBuyingCost,
    buyCurrency,
    input.netBuyingPriceCurrency,
    rates
  );
  if (!netBuyFx.ok) {
    errors.form = netBuyFx.message;
    return { isValid: false, errors, result: null };
  }

  const sellCommFx = convertMoney(
    computed.sellingCommissionAmount,
    buyCurrency,
    input.sellingCommissionAmountCurrency,
    rates
  );
  if (!sellCommFx.ok) {
    errors.form = sellCommFx.message;
    return { isValid: false, errors, result: null };
  }

  const netSellFx = convertMoney(
    computed.netSellingProceeds,
    buyCurrency,
    input.netSellingPriceCurrency,
    rates
  );
  if (!netSellFx.ok) {
    errors.form = netSellFx.message;
    return { isValid: false, errors, result: null };
  }

  const profitFx = convertMoney(
    computed.profit,
    buyCurrency,
    input.profitCurrency,
    rates
  );
  if (!profitFx.ok) {
    errors.form = profitFx.message;
    return { isValid: false, errors, result: null };
  }

  const breakEvenFx = convertMoney(
    computed.breakEvenSellingPrice,
    buyCurrency,
    input.breakEvenSellingPriceCurrency,
    rates
  );
  if (!breakEvenFx.ok) {
    errors.form = breakEvenFx.message;
    return { isValid: false, errors, result: null };
  }

  const result: StockResult = {
    grossPurchaseCostCanonical: computed.grossPurchaseCost,
    buyingCommissionAmountCanonical: computed.buyingCommissionAmount,
    netBuyingCostCanonical: computed.netBuyingCost,
    grossSaleProceedsCanonical: computed.grossSaleProceeds,
    sellingCommissionAmountCanonical: computed.sellingCommissionAmount,
    netSellingProceedsCanonical: computed.netSellingProceeds,
    profitCanonical: computed.profit,
    roiPercent: computed.roiPercent,
    breakEvenSellingPriceCanonical: computed.breakEvenSellingPrice,
    buyingCommissionAmount: buyCommFx.amount,
    netBuyingCost: netBuyFx.amount,
    sellingCommissionAmount: sellCommFx.amount,
    netSellingProceeds: netSellFx.amount,
    profit: profitFx.amount,
    breakEvenSellingPrice: breakEvenFx.amount,
    buyingPriceCurrency: buyCurrency,
    buyingCommissionAmountCurrency: input.buyingCommissionAmountCurrency,
    netBuyingPriceCurrency: input.netBuyingPriceCurrency,
    sellingPriceCurrency: input.sellingPriceCurrency,
    sellingCommissionAmountCurrency: input.sellingCommissionAmountCurrency,
    netSellingPriceCurrency: input.netSellingPriceCurrency,
    profitCurrency: input.profitCurrency,
    breakEvenSellingPriceCurrency: input.breakEvenSellingPriceCurrency,
    formattedBuyingCommissionAmount: formatStockMoney(
      buyCommFx.amount,
      input.buyingCommissionAmountCurrency
    ),
    formattedNetBuyingCost: formatStockMoney(
      netBuyFx.amount,
      input.netBuyingPriceCurrency
    ),
    formattedSellingCommissionAmount: formatStockMoney(
      sellCommFx.amount,
      input.sellingCommissionAmountCurrency
    ),
    formattedNetSellingProceeds: formatStockMoney(
      netSellFx.amount,
      input.netSellingPriceCurrency
    ),
    formattedProfit: formatStockMoney(profitFx.amount, input.profitCurrency),
    formattedRoiPercent: formatStockPercent(computed.roiPercent),
    formattedBreakEvenSellingPrice: formatStockMoney(
      breakEvenFx.amount,
      input.breakEvenSellingPriceCurrency
    ),
  };

  return { isValid: true, errors, result };
}
