import {
  calculateAverageAssets,
  calculateTotalAssetTurnover,
  formatTat,
  formatTatMoney,
  interpretTotalAssetTurnover,
} from './calculation';
import type {
  TotalAssetTurnoverFieldErrors,
  TotalAssetTurnoverInput,
  TotalAssetTurnoverResult,
  TotalAssetTurnoverStatus,
} from './types';

export interface TotalAssetTurnoverValidation {
  isValid: boolean;
  errors: TotalAssetTurnoverFieldErrors;
  result: TotalAssetTurnoverResult | null;
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

export function validateTotalAssetTurnoverInput(
  input: TotalAssetTurnoverInput
): TotalAssetTurnoverValidation {
  const errors: TotalAssetTurnoverFieldErrors = {};
  const currency = input.currency;

  const beginning = parseNumber(input.beginningAssets);
  const ending = parseNumber(input.endingAssets);
  const revenue = parseNumber(input.revenue);

  if (!beginning.blank) {
    if (beginning.invalid || beginning.value === null) {
      errors.beginningAssets = 'Enter a valid beginning asset amount.';
    } else if (beginning.value < 0) {
      errors.beginningAssets = 'Beginning assets cannot be negative.';
    }
  }
  if (!ending.blank) {
    if (ending.invalid || ending.value === null) {
      errors.endingAssets = 'Enter a valid ending asset amount.';
    } else if (ending.value < 0) {
      errors.endingAssets = 'Ending assets cannot be negative.';
    }
  }
  if (!revenue.blank) {
    if (revenue.invalid || revenue.value === null) {
      errors.revenue = 'Enter a valid revenue amount.';
    } else if (revenue.value < 0) {
      errors.revenue = 'Revenue cannot be negative.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const beginningReady = !beginning.blank && beginning.value !== null;
  const endingReady = !ending.blank && ending.value !== null;

  if (!beginningReady || !endingReady) {
    return { isValid: false, errors, result: null };
  }

  const averageAssets = calculateAverageAssets(
    beginning.value!,
    ending.value!
  );
  if (averageAssets === null) {
    return { isValid: false, errors, result: null };
  }

  const revenueReady = !revenue.blank && revenue.value !== null;
  let totalAssetTurnover: number | null = null;
  let revenueValue: number | null = null;

  if (revenueReady) {
    revenueValue = revenue.value;
    totalAssetTurnover = calculateTotalAssetTurnover(
      revenueValue!,
      averageAssets
    );
  }

  let status: TotalAssetTurnoverStatus = revenueReady ? 'valid' : 'partial';
  let warningMessage: string | null =
    'TAT = Revenue ÷ Average Total Assets. Use total assets (not current assets alone) and revenue from the same reporting period. Amounts share one currency label (no FX).';

  if (averageAssets === 0) {
    status = 'zeroAverageAssets';
    warningMessage =
      'Total asset turnover is unavailable because average assets must be greater than zero.';
    errors.form = warningMessage;
  } else if (!revenueReady) {
    warningMessage =
      'Average assets calculated. Enter revenue to compute total asset turnover.';
  }

  const result: TotalAssetTurnoverResult = {
    beginningAssets: beginning.value!,
    endingAssets: ending.value!,
    averageAssets,
    revenue: revenueValue,
    totalAssetTurnover,
    status,
    interpretation: interpretTotalAssetTurnover(
      totalAssetTurnover,
      averageAssets,
      revenueValue,
      status
    ),
    warningMessage,
    currency,
    formattedBeginningAssets: formatTatMoney(beginning.value!, currency),
    formattedEndingAssets: formatTatMoney(ending.value!, currency),
    formattedAverageAssets: formatTatMoney(averageAssets, currency),
    formattedRevenue:
      revenueValue === null
        ? null
        : formatTatMoney(revenueValue, currency),
    formattedTotalAssetTurnover:
      totalAssetTurnover === null ? null : formatTat(totalAssetTurnover),
  };

  if (status === 'zeroAverageAssets') {
    return { isValid: false, errors, result };
  }

  return { isValid: true, errors, result };
}
