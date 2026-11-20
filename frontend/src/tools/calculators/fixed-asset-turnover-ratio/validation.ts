import {
  calculateAverageFixedAssets,
  calculateFixedAssetIntensity,
  calculateFixedAssetTurnover,
  formatFat,
  formatFatMoney,
  interpretFixedAssetTurnover,
} from './calculation';
import type {
  FixedAssetTurnoverRatioFieldErrors,
  FixedAssetTurnoverRatioInput,
  FixedAssetTurnoverRatioResult,
  FixedAssetTurnoverStatus,
} from './types';

export interface FixedAssetTurnoverRatioValidation {
  isValid: boolean;
  errors: FixedAssetTurnoverRatioFieldErrors;
  result: FixedAssetTurnoverRatioResult | null;
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

export function validateFixedAssetTurnoverRatioInput(
  input: FixedAssetTurnoverRatioInput
): FixedAssetTurnoverRatioValidation {
  const errors: FixedAssetTurnoverRatioFieldErrors = {};
  const currency = input.currency;

  const starting = parseNumber(input.startingFixedAssets);
  const final = parseNumber(input.finalFixedAssets);
  const revenue = parseNumber(input.revenue);

  if (!starting.blank) {
    if (starting.invalid || starting.value === null) {
      errors.startingFixedAssets = 'Enter a valid starting fixed assets amount.';
    } else if (starting.value < 0) {
      errors.startingFixedAssets =
        'Starting fixed assets cannot be negative.';
    }
  }
  if (!final.blank) {
    if (final.invalid || final.value === null) {
      errors.finalFixedAssets = 'Enter a valid final fixed assets amount.';
    } else if (final.value < 0) {
      errors.finalFixedAssets = 'Final fixed assets cannot be negative.';
    }
  }
  if (!revenue.blank) {
    if (revenue.invalid || revenue.value === null) {
      errors.revenue = 'Enter a valid revenue amount.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    starting.blank ||
    final.blank ||
    revenue.blank ||
    starting.value === null ||
    final.value === null ||
    revenue.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const averageFixedAssets = calculateAverageFixedAssets(
    starting.value,
    final.value
  );
  if (averageFixedAssets === null) {
    return { isValid: false, errors, result: null };
  }

  let status: FixedAssetTurnoverStatus = 'valid';
  let warningMessage: string | null =
    'FAT uses net revenue ÷ average net fixed assets for matching periods. Amounts share one currency label (no FX conversion).';
  let fat: number | null = null;
  let isValid = true;

  if (averageFixedAssets === 0) {
    status = 'zeroAverageFixedAssets';
    isValid = false;
    warningMessage =
      'Fixed asset turnover cannot be calculated because average fixed assets are zero.';
    errors.form = warningMessage;
  } else {
    fat = calculateFixedAssetTurnover(revenue.value, averageFixedAssets);
    if (fat === null) {
      return { isValid: false, errors, result: null };
    }
    if (revenue.value < 0) {
      status = 'negativeRevenue';
      warningMessage =
        'Negative revenue produces a signed fixed asset turnover. Conventional efficiency interpretation may not apply — review returns, allowances, or corrections.';
    }
  }

  const intensity = calculateFixedAssetIntensity(
    averageFixedAssets,
    revenue.value
  );

  const result: FixedAssetTurnoverRatioResult = {
    startingFixedAssets: starting.value,
    finalFixedAssets: final.value,
    averageFixedAssets,
    revenue: revenue.value,
    fixedAssetTurnover: fat,
    fixedAssetIntensity: intensity,
    status,
    interpretation: interpretFixedAssetTurnover(
      fat,
      averageFixedAssets,
      revenue.value,
      status
    ),
    warningMessage,
    currency,
    formattedStartingFixedAssets: formatFatMoney(starting.value, currency),
    formattedFinalFixedAssets: formatFatMoney(final.value, currency),
    formattedAverageFixedAssets: formatFatMoney(averageFixedAssets, currency),
    formattedRevenue: formatFatMoney(revenue.value, currency),
    formattedFixedAssetTurnover: fat === null ? null : formatFat(fat),
    formattedFixedAssetIntensity:
      intensity === null ? null : formatFat(intensity),
  };

  if (status === 'zeroAverageFixedAssets') {
    return { isValid: false, errors, result };
  }

  return { isValid, errors, result };
}
