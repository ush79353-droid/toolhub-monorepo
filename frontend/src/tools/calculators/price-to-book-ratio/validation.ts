import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculatePriceToBook,
  formatPbMoney,
  formatRatio,
  interpretPbRatio,
} from './calculation';
import type {
  PriceToBookFieldErrors,
  PriceToBookInput,
  PriceToBookResult,
} from './types';

export interface PriceToBookValidation {
  isValid: boolean;
  errors: PriceToBookFieldErrors;
  result: PriceToBookResult | null;
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
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export function validatePriceToBookInput(
  input: PriceToBookInput
): PriceToBookValidation {
  const errors: PriceToBookFieldErrors = {};
  const currency = input.currency;
  const symbol = getCurrencySymbol(currency);
  let hasError = false;

  const equity = parseNumber(input.totalStockholderEquity);
  if (equity.blank) {
    errors.totalStockholderEquity = 'Enter total stockholder equity.';
    hasError = true;
  } else if (equity.invalid || equity.value === null) {
    errors.totalStockholderEquity = 'Enter a valid equity amount.';
    hasError = true;
  }

  const preferred = parseNumber(input.preferredEquity);
  if (preferred.blank) {
    errors.preferredEquity = 'Enter preferred equity (use 0 if none).';
    hasError = true;
  } else if (preferred.invalid || preferred.value === null) {
    errors.preferredEquity = 'Enter a valid preferred equity amount.';
    hasError = true;
  } else if (preferred.value < 0) {
    errors.preferredEquity = 'Preferred equity cannot be negative.';
    hasError = true;
  }

  const shares = parseNumber(input.commonSharesOutstanding);
  if (shares.blank) {
    errors.commonSharesOutstanding = 'Enter shares outstanding.';
    hasError = true;
  } else if (shares.invalid || shares.value === null) {
    errors.commonSharesOutstanding = 'Enter a valid share count.';
    hasError = true;
  } else if (shares.value <= 0) {
    errors.commonSharesOutstanding =
      'Shares outstanding must be greater than zero.';
    hasError = true;
  }

  const price = parseNumber(input.sharePrice);
  if (price.blank) {
    errors.sharePrice = 'Enter the share price.';
    hasError = true;
  } else if (price.invalid || price.value === null) {
    errors.sharePrice = 'Enter a valid share price.';
    hasError = true;
  } else if (price.value < 0) {
    errors.sharePrice = 'Share price cannot be negative.';
    hasError = true;
  }

  let goodwillValue = 0;
  let intangiblesValue = 0;
  if (input.showTangible) {
    const gw = parseNumber(input.goodwill);
    if (gw.blank) {
      errors.goodwill = 'Enter goodwill (use 0 if none).';
      hasError = true;
    } else if (gw.invalid || gw.value === null) {
      errors.goodwill = 'Enter a valid goodwill amount.';
      hasError = true;
    } else if (gw.value < 0) {
      errors.goodwill = 'Goodwill cannot be negative.';
      hasError = true;
    } else {
      goodwillValue = gw.value;
    }

    const oi = parseNumber(input.otherIntangibleAssets);
    if (oi.blank) {
      errors.otherIntangibleAssets =
        'Enter other intangible assets (use 0 if none).';
      hasError = true;
    } else if (oi.invalid || oi.value === null) {
      errors.otherIntangibleAssets =
        'Enter a valid intangible assets amount.';
      hasError = true;
    } else if (oi.value < 0) {
      errors.otherIntangibleAssets =
        'Other intangible assets cannot be negative.';
      hasError = true;
    } else {
      intangiblesValue = oi.value;
    }
  }

  if (
    hasError ||
    equity.value === null ||
    preferred.value === null ||
    shares.value === null ||
    price.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const math = calculatePriceToBook({
    totalStockholderEquity: equity.value,
    preferredEquity: preferred.value,
    commonSharesOutstanding: shares.value,
    sharePrice: price.value,
    goodwill: goodwillValue,
    otherIntangibleAssets: intangiblesValue,
    includeTangible: input.showTangible,
  });

  if (math === null) {
    errors.form = 'Unable to calculate price-to-book with these inputs.';
    return { isValid: false, errors, result: null };
  }

  let pbUnavailableReason: string | null = null;
  if (math.bookValuePerShare === 0) {
    pbUnavailableReason =
      'Price-to-book ratio is undefined because book value per share is zero.';
  } else if (math.bookValuePerShare < 0) {
    pbUnavailableReason =
      'Common book equity is negative. A conventional positive P/B valuation multiple is not meaningful.';
  }

  let ptbUnavailableReason: string | null = null;
  if (input.showTangible && math.tangibleBookValuePerShare !== null) {
    if (math.tangibleBookValuePerShare === 0) {
      ptbUnavailableReason =
        'Price-to-tangible-book is undefined because tangible book value per share is zero.';
    } else if (math.tangibleBookValuePerShare < 0) {
      ptbUnavailableReason =
        'Tangible common equity is negative. A conventional P/TBV multiple is not meaningful.';
    }
  }

  const money = (n: number) => `${symbol}${formatPbMoney(n, currency)}`;

  let interpretation: string | null = null;
  if (math.priceToBookRatio !== null) {
    interpretation = interpretPbRatio(math.priceToBookRatio);
  } else if (math.bookValuePerShare < 0) {
    interpretation = `Book value per share is ${money(math.bookValuePerShare)}. Common book equity is negative: a conventional price-to-book multiple is not meaningful.`;
  }

  const result: PriceToBookResult = {
    commonBookEquity: math.commonBookEquity,
    bookValuePerShare: math.bookValuePerShare,
    priceToBookRatio: math.priceToBookRatio,
    tangibleCommonEquity: math.tangibleCommonEquity,
    tangibleBookValuePerShare: math.tangibleBookValuePerShare,
    priceToTangibleBookRatio: math.priceToTangibleBookRatio,
    currency,
    formattedCommonBookEquity: money(math.commonBookEquity),
    formattedBvps: money(math.bookValuePerShare),
    formattedPb:
      math.priceToBookRatio === null
        ? null
        : `${formatRatio(math.priceToBookRatio)}×`,
    formattedTangibleEquity:
      math.tangibleCommonEquity === null
        ? null
        : money(math.tangibleCommonEquity),
    formattedTbvps:
      math.tangibleBookValuePerShare === null
        ? null
        : money(math.tangibleBookValuePerShare),
    formattedPtb:
      math.priceToTangibleBookRatio === null
        ? null
        : `${formatRatio(math.priceToTangibleBookRatio)}×`,
    pbUnavailableReason,
    ptbUnavailableReason,
    interpretation,
    warningMessage:
      'P/B compares market price with accounting book value per common share. Preferred equity is deducted so BVPS reflects common shareholders. Interpretation depends on industry and asset quality.',
  };

  return {
    isValid: math.priceToBookRatio !== null,
    errors,
    result,
  };
}
