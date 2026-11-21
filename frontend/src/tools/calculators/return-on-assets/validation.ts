import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculateAverageAssets,
  calculateROA,
  explainProfitPerAsset,
  formatRoaMoney,
  formatRoaPercent,
  interpretROA,
} from './calculation';
import type {
  ReturnOnAssetsFieldErrors,
  ReturnOnAssetsInput,
  ReturnOnAssetsResult,
} from './types';

export interface ReturnOnAssetsValidation {
  isValid: boolean;
  errors: ReturnOnAssetsFieldErrors;
  result: ReturnOnAssetsResult | null;
}

function parseFinite(raw: string): {
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

export function validateReturnOnAssetsInput(
  input: ReturnOnAssetsInput
): ReturnOnAssetsValidation {
  const errors: ReturnOnAssetsFieldErrors = {};
  const currency = input.currency;
  const symbol = getCurrencySymbol(currency);
  let hasError = false;

  const ni = parseFinite(input.netIncome);
  if (ni.blank) {
    errors.netIncome = 'Enter net income.';
    hasError = true;
  } else if (ni.invalid || ni.value === null) {
    errors.netIncome = 'Enter a valid net income.';
    hasError = true;
  }

  let assetBase: number | null = null;

  if (input.useAverageAssets) {
    const begin = parseFinite(input.beginningAssets);
    if (begin.blank) {
      errors.beginningAssets = 'Enter beginning total assets.';
      hasError = true;
    } else if (begin.invalid || begin.value === null) {
      errors.beginningAssets = 'Enter a valid beginning assets amount.';
      hasError = true;
    } else if (begin.value <= 0) {
      errors.beginningAssets = 'Beginning assets must be greater than zero.';
      hasError = true;
    }

    const end = parseFinite(input.endingAssets);
    if (end.blank) {
      errors.endingAssets = 'Enter ending total assets.';
      hasError = true;
    } else if (end.invalid || end.value === null) {
      errors.endingAssets = 'Enter a valid ending assets amount.';
      hasError = true;
    } else if (end.value <= 0) {
      errors.endingAssets = 'Ending assets must be greater than zero.';
      hasError = true;
    }

    if (
      begin.value !== null &&
      begin.value > 0 &&
      !begin.invalid &&
      end.value !== null &&
      end.value > 0 &&
      !end.invalid
    ) {
      assetBase = calculateAverageAssets(begin.value, end.value);
      if (assetBase === null) {
        errors.form = 'Unable to calculate average total assets.';
        hasError = true;
      }
    }
  } else {
    const assets = parseFinite(input.totalAssets);
    if (assets.blank) {
      errors.totalAssets = 'Enter total assets.';
      hasError = true;
    } else if (assets.invalid || assets.value === null) {
      errors.totalAssets = 'Enter a valid total assets amount.';
      hasError = true;
    } else if (assets.value <= 0) {
      errors.totalAssets =
        'Total assets must be greater than zero to calculate ROA.';
      hasError = true;
    } else {
      assetBase = assets.value;
    }
  }

  if (hasError || ni.value === null || assetBase === null) {
    return { isValid: false, errors, result: null };
  }

  const math = calculateROA(ni.value, assetBase);
  if (!math) {
    errors.form = 'Unable to calculate return on assets.';
    return { isValid: false, errors, result: null };
  }

  const result: ReturnOnAssetsResult = {
    roaPercentage: math.roaPercentage,
    profitPerAssetUnit: math.profitPerAssetUnit,
    assetBase,
    usedAverageAssets: input.useAverageAssets,
    currency,
    formattedRoa: formatRoaPercent(math.roaPercentage),
    formattedAssetBase: `${symbol}${formatRoaMoney(assetBase, currency)}`,
    interpretation: interpretROA(math.roaPercentage),
    explanation: explainProfitPerAsset(math.profitPerAssetUnit, currency),
    warningMessage: input.useAverageAssets
      ? 'ROA uses average total assets = (beginning + ending) ÷ 2 as the denominator. Industry context still matters.'
      : 'ROA uses the total assets amount entered as the denominator. Average assets may be more representative for period analysis.',
  };

  return { isValid: true, errors, result };
}
