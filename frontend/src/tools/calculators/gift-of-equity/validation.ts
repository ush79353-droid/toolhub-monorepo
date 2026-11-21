import {
  calculateGiftOfEquity,
  calculateMarketValueFromGift,
  calculateSalesPriceFromGift,
  formatGiftOfEquityMoney,
} from './calculation';
import type {
  GiftOfEquityFieldErrors,
  GiftOfEquityInput,
  GiftOfEquityResult,
} from './types';

export interface GiftOfEquityValidation {
  isValid: boolean;
  errors: GiftOfEquityFieldErrors;
  result: GiftOfEquityResult | null;
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

/**
 * Validates inputs for the active mode and computes the dependent field.
 * Modes stay one-directional (no circular updates).
 */
export function validateGiftOfEquityInput(
  input: GiftOfEquityInput
): GiftOfEquityValidation {
  const errors: GiftOfEquityFieldErrors = {};
  const market = parseNumber(input.marketValue);
  const sales = parseNumber(input.salesPrice);
  const gift = parseNumber(input.giftOfEquity);

  if (!market.blank && (market.invalid || market.value === null)) {
    errors.marketValue = 'Enter a valid market value.';
  } else if (market.value !== null && market.value < 0) {
    errors.marketValue = 'Market value must be zero or greater.';
  }

  if (!sales.blank && (sales.invalid || sales.value === null)) {
    errors.salesPrice = 'Enter a valid sales price.';
  } else if (sales.value !== null && sales.value < 0) {
    errors.salesPrice = 'Sales price must be zero or greater.';
  }

  if (!gift.blank && (gift.invalid || gift.value === null)) {
    errors.giftOfEquity = 'Enter a valid gift of equity amount.';
  }

  const currency = input.currency;
  let marketValue = 0;
  let salesPrice = 0;
  let giftOfEquity = 0;
  let ready = false;

  if (input.mode === 'gift') {
    if (
      !market.blank &&
      !sales.blank &&
      !errors.marketValue &&
      !errors.salesPrice &&
      market.value !== null &&
      sales.value !== null
    ) {
      const goe = calculateGiftOfEquity(market.value, sales.value);
      if (goe !== null) {
        marketValue = market.value;
        salesPrice = sales.value;
        giftOfEquity = goe;
        ready = true;
      }
    }
  } else if (input.mode === 'salesPrice') {
    if (
      !market.blank &&
      !gift.blank &&
      !errors.marketValue &&
      !errors.giftOfEquity &&
      market.value !== null &&
      gift.value !== null
    ) {
      const sp = calculateSalesPriceFromGift(market.value, gift.value);
      if (sp !== null) {
        if (sp < 0) {
          errors.giftOfEquity =
            'Gift of equity cannot exceed market value for a valid sales price.';
        } else {
          marketValue = market.value;
          giftOfEquity = gift.value;
          salesPrice = sp;
          ready = true;
        }
      }
    }
  } else {
    // marketValue mode
    if (
      !sales.blank &&
      !gift.blank &&
      !errors.salesPrice &&
      !errors.giftOfEquity &&
      sales.value !== null &&
      gift.value !== null
    ) {
      const mv = calculateMarketValueFromGift(sales.value, gift.value);
      if (mv !== null) {
        if (mv < 0) {
          errors.form = 'This combination does not produce a valid market value.';
        } else {
          salesPrice = sales.value;
          giftOfEquity = gift.value;
          marketValue = mv;
          ready = true;
        }
      }
    }
  }

  if (!ready) {
    return { isValid: false, errors, result: null };
  }

  const result: GiftOfEquityResult = {
    marketValue,
    salesPrice,
    giftOfEquity,
    isNegativeDifference: giftOfEquity < 0,
    currency,
    formattedMarketValue: formatGiftOfEquityMoney(marketValue, currency),
    formattedSalesPrice: formatGiftOfEquityMoney(salesPrice, currency),
    formattedGiftOfEquity: formatGiftOfEquityMoney(giftOfEquity, currency),
  };

  return { isValid: true, errors, result };
}
