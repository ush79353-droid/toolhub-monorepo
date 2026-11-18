import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { moneyAmountToInputString } from '@/tools/shared/money-value';
import {
  calculateMarginWithDiscount,
  formatMoneyAmount,
  formatPercentValue,
} from './calculation';
import type {
  MarginWithDiscountFieldErrors,
  MarginWithDiscountInput,
  MarginWithDiscountResult,
} from './types';

export interface MarginWithDiscountValidation {
  isValid: boolean;
  errors: MarginWithDiscountFieldErrors;
  result: MarginWithDiscountResult | null;
  /** Derived field strings to write back (margin ↔ markup ↔ revenue sync). */
  synced: Partial<MarginWithDiscountInput> | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '').replace(/%/g, '');
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
 * Validates cost (≥ 0), discount (0–100), and margin/markup/revenue driver,
 * solves in the cost currency at full precision, then FX-converts money results
 * into their independent display currencies. Percents never convert.
 *
 * When both margin and markup are filled, `input.driver` (last-edited among
 * margin | markup | revenue) is authoritative.
 */
export function validateMarginWithDiscountInput(
  input: MarginWithDiscountInput,
  rates?: CurrencyRatesSnapshot | null
): MarginWithDiscountValidation {
  const errors: MarginWithDiscountFieldErrors = {};

  const cost = parseNumber(input.cost);
  const margin = parseNumber(input.baseMargin);
  const markup = parseNumber(input.baseMarkup);
  const revenue = parseNumber(input.baseRevenue);
  const discount = parseNumber(input.discountPercent);

  if (!cost.blank && (cost.invalid || cost.value === null)) {
    errors.cost = 'Enter a valid cost.';
  } else if (cost.value !== null && cost.value < 0) {
    errors.cost = 'Cost must be zero or greater.';
  }

  if (!margin.blank && (margin.invalid || margin.value === null)) {
    errors.baseMargin = 'Enter a valid base margin percent.';
  } else if (margin.value !== null && margin.value >= 100) {
    errors.baseMargin = 'Base margin must be less than 100% to derive revenue.';
  }

  if (!markup.blank && (markup.invalid || markup.value === null)) {
    errors.baseMarkup = 'Enter a valid base markup percent.';
  }

  if (!revenue.blank && (revenue.invalid || revenue.value === null)) {
    errors.baseRevenue = 'Enter a valid base revenue.';
  }

  if (!discount.blank && (discount.invalid || discount.value === null)) {
    errors.discountPercent = 'Enter a valid discount percent.';
  } else if (
    discount.value !== null &&
    (discount.value < 0 || discount.value > 100)
  ) {
    errors.discountPercent = 'Discount must be between 0% and 100%.';
  }

  // Normalize revenue into cost currency when provided as a driver input
  let revenueInCost: number | null = null;
  if (!revenue.blank && revenue.value !== null && !errors.baseRevenue) {
    const fx = convertMoney(
      revenue.value,
      input.baseRevenueCurrency,
      input.costCurrency,
      rates
    );
    if (!fx.ok) {
      errors.form = fx.message;
      return { isValid: false, errors, result: null, synced: null };
    }
    revenueInCost = fx.amount;
  }

  const hasDriverValue =
    (input.driver === 'margin' && !margin.blank && !errors.baseMargin) ||
    (input.driver === 'markup' && !markup.blank && !errors.baseMarkup) ||
    (input.driver === 'revenue' &&
      !revenue.blank &&
      !errors.baseRevenue &&
      revenueInCost !== null);

  const incomplete =
    cost.blank ||
    discount.blank ||
    !hasDriverValue ||
    Boolean(errors.cost) ||
    Boolean(errors.baseMargin) ||
    Boolean(errors.baseMarkup) ||
    Boolean(errors.baseRevenue) ||
    Boolean(errors.discountPercent) ||
    Boolean(errors.form);

  if (incomplete) {
    return { isValid: false, errors, result: null, synced: null };
  }

  const computed = calculateMarginWithDiscount({
    cost: cost.value!,
    baseMarginPercent: margin.value,
    baseMarkupPercent: markup.value,
    baseRevenue: revenueInCost,
    driver: input.driver,
    discountPercent: discount.value!,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null, synced: null };
  }

  const costCurrency = input.costCurrency;

  const revenueFx = convertMoney(
    computed.baseRevenue,
    costCurrency,
    input.baseRevenueCurrency,
    rates
  );
  if (!revenueFx.ok) {
    errors.form = revenueFx.message;
    return { isValid: false, errors, result: null, synced: null };
  }

  const priceFx = convertMoney(
    computed.priceAfterDiscount,
    costCurrency,
    input.priceAfterDiscountCurrency,
    rates
  );
  if (!priceFx.ok) {
    errors.form = priceFx.message;
    return { isValid: false, errors, result: null, synced: null };
  }

  const profitFx = convertMoney(
    computed.profit,
    costCurrency,
    input.profitCurrency,
    rates
  );
  if (!profitFx.ok) {
    errors.form = profitFx.message;
    return { isValid: false, errors, result: null, synced: null };
  }

  const result: MarginWithDiscountResult = {
    baseRevenueCanonical: computed.baseRevenue,
    baseMarginPercent: computed.baseMarginPercent,
    baseMarkupPercent: computed.baseMarkupPercent,
    priceAfterDiscountCanonical: computed.priceAfterDiscount,
    trueMarginPercent: computed.trueMarginPercent,
    trueMarkupPercent: computed.trueMarkupPercent,
    profitCanonical: computed.profit,
    baseRevenue: revenueFx.amount,
    priceAfterDiscount: priceFx.amount,
    profit: profitFx.amount,
    costCurrency,
    baseRevenueCurrency: input.baseRevenueCurrency,
    priceAfterDiscountCurrency: input.priceAfterDiscountCurrency,
    profitCurrency: input.profitCurrency,
    formattedBaseRevenue: formatMoneyAmount(
      revenueFx.amount,
      input.baseRevenueCurrency
    ),
    formattedBaseMargin: formatPercentValue(computed.baseMarginPercent),
    formattedBaseMarkup: formatPercentValue(computed.baseMarkupPercent),
    formattedPriceAfterDiscount: formatMoneyAmount(
      priceFx.amount,
      input.priceAfterDiscountCurrency
    ),
    formattedTrueMargin: formatPercentValue(computed.trueMarginPercent),
    formattedTrueMarkup: formatPercentValue(computed.trueMarkupPercent),
    formattedProfit: formatMoneyAmount(profitFx.amount, input.profitCurrency),
  };

  const synced: Partial<MarginWithDiscountInput> = {
    baseMargin: result.formattedBaseMargin,
    baseMarkup: result.formattedBaseMarkup,
    baseRevenue: moneyAmountToInputString(revenueFx.amount),
  };

  return { isValid: true, errors, result, synced };
}
