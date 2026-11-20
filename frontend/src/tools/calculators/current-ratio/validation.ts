import {
  calculateCurrentAssets,
  calculateCurrentLiabilities,
  calculateCurrentRatio,
  calculateWorkingCapital,
  formatCrMoney,
  formatCurrentRatio,
  interpretCurrentRatio,
} from './calculation';
import type {
  CurrentRatioFieldErrors,
  CurrentRatioInput,
  CurrentRatioResult,
} from './types';

export interface CurrentRatioValidation {
  isValid: boolean;
  errors: CurrentRatioFieldErrors;
  result: CurrentRatioResult | null;
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

export function validateCurrentRatioInput(
  input: CurrentRatioInput
): CurrentRatioValidation {
  const errors: CurrentRatioFieldErrors = {};
  const currency = input.currency;

  const assetsParsed = parseNumber(input.currentAssets);
  const liabilitiesParsed = parseNumber(input.currentLiabilities);
  const ratioParsed = parseNumber(input.currentRatio);

  if (!assetsParsed.blank) {
    if (assetsParsed.invalid || assetsParsed.value === null) {
      errors.currentAssets = 'Enter a valid current assets amount.';
    } else if (assetsParsed.value < 0) {
      errors.currentAssets = 'Current assets cannot be negative.';
    }
  }

  if (!liabilitiesParsed.blank) {
    if (liabilitiesParsed.invalid || liabilitiesParsed.value === null) {
      errors.currentLiabilities = 'Enter a valid current liabilities amount.';
    } else if (liabilitiesParsed.value < 0) {
      errors.currentLiabilities = 'Current liabilities cannot be negative.';
    }
  }

  if (!ratioParsed.blank) {
    if (ratioParsed.invalid || ratioParsed.value === null) {
      errors.currentRatio = 'Enter a valid current ratio.';
    } else if (ratioParsed.value < 0) {
      errors.currentRatio = 'Current ratio cannot be negative.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  let currentAssets = 0;
  let currentLiabilities = 0;
  let currentRatio = 0;
  let ready = false;

  if (input.mode === 'currentRatio') {
    if (
      !assetsParsed.blank &&
      !liabilitiesParsed.blank &&
      assetsParsed.value !== null &&
      liabilitiesParsed.value !== null
    ) {
      if (liabilitiesParsed.value === 0) {
        return {
          isValid: false,
          errors: {
            currentLiabilities:
              'Current ratio is undefined when current liabilities are zero (division by zero). Working capital can still be computed as current assets alone.',
          },
          result: null,
        };
      }
      const ratio = calculateCurrentRatio(
        assetsParsed.value,
        liabilitiesParsed.value
      );
      if (ratio === null) {
        return { isValid: false, errors, result: null };
      }
      currentAssets = assetsParsed.value;
      currentLiabilities = liabilitiesParsed.value;
      currentRatio = ratio;
      ready = true;
    }
  } else if (input.mode === 'currentAssets') {
    if (
      !ratioParsed.blank &&
      !liabilitiesParsed.blank &&
      ratioParsed.value !== null &&
      liabilitiesParsed.value !== null
    ) {
      const assets = calculateCurrentAssets(
        ratioParsed.value,
        liabilitiesParsed.value
      );
      if (assets === null) {
        return { isValid: false, errors, result: null };
      }
      currentRatio = ratioParsed.value;
      currentLiabilities = liabilitiesParsed.value;
      currentAssets = assets;
      ready = true;
    }
  } else {
    // currentLiabilities mode
    if (
      !assetsParsed.blank &&
      !ratioParsed.blank &&
      assetsParsed.value !== null &&
      ratioParsed.value !== null
    ) {
      if (assetsParsed.value === 0 && ratioParsed.value === 0) {
        return {
          isValid: false,
          errors: {
            form:
              'When both current assets and the current ratio are zero, current liabilities are not uniquely determined.',
          },
          result: null,
        };
      }
      if (ratioParsed.value === 0) {
        return {
          isValid: false,
          errors: {
            currentRatio:
              'Current liabilities are undefined when the target current ratio is zero and assets are positive.',
          },
          result: null,
        };
      }
      const liabilities = calculateCurrentLiabilities(
        assetsParsed.value,
        ratioParsed.value
      );
      if (liabilities === null) {
        return { isValid: false, errors, result: null };
      }
      currentAssets = assetsParsed.value;
      currentRatio = ratioParsed.value;
      currentLiabilities = liabilities;
      ready = true;
    }
  }

  if (!ready) {
    return { isValid: false, errors, result: null };
  }

  const workingCapital = calculateWorkingCapital(
    currentAssets,
    currentLiabilities
  );
  if (workingCapital === null) {
    return { isValid: false, errors, result: null };
  }

  const formattedRatio = formatCurrentRatio(currentRatio);

  const result: CurrentRatioResult = {
    currentAssets,
    currentLiabilities,
    currentRatio,
    workingCapital,
    status: 'valid',
    interpretation: interpretCurrentRatio(currentRatio),
    currency,
    formattedCurrentAssets: formatCrMoney(currentAssets, currency),
    formattedCurrentLiabilities: formatCrMoney(currentLiabilities, currency),
    formattedCurrentRatio: formattedRatio,
    formattedCurrentRatioColon: `${formattedRatio}:1`,
    formattedWorkingCapital: formatCrMoney(workingCapital, currency),
  };

  return { isValid: true, errors, result };
}
