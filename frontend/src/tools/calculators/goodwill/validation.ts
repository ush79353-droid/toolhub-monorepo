import {
  calculateAcquisitionResidual,
  calculateBargainPurchaseDifference,
  calculateGoodwill,
  calculateNetIdentifiableAssets,
  formatGwMoney,
  interpretGoodwill,
} from './calculation';
import type {
  GoodwillFieldErrors,
  GoodwillInput,
  GoodwillResult,
  GoodwillStatus,
} from './types';

export interface GoodwillValidation {
  isValid: boolean;
  errors: GoodwillFieldErrors;
  result: GoodwillResult | null;
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

export function validateGoodwillInput(input: GoodwillInput): GoodwillValidation {
  const errors: GoodwillFieldErrors = {};
  const currency = input.currency;

  const purchase = parseNumber(input.purchasePrice);
  const assets = parseNumber(input.fairValueOfAssets);
  const liabilities = parseNumber(input.fairValueOfLiabilities);

  if (!purchase.blank) {
    if (purchase.invalid || purchase.value === null) {
      errors.purchasePrice = 'Enter a valid purchase price.';
    } else if (purchase.value < 0) {
      errors.purchasePrice = 'Purchase price cannot be negative.';
    }
  }
  if (!assets.blank) {
    if (assets.invalid || assets.value === null) {
      errors.fairValueOfAssets = 'Enter a valid fair value of assets.';
    } else if (assets.value < 0) {
      errors.fairValueOfAssets = 'Fair value of assets cannot be negative.';
    }
  }
  if (!liabilities.blank) {
    if (liabilities.invalid || liabilities.value === null) {
      errors.fairValueOfLiabilities =
        'Enter a valid fair value of liabilities.';
    } else if (liabilities.value < 0) {
      errors.fairValueOfLiabilities =
        'Fair value of liabilities cannot be negative.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    purchase.blank ||
    assets.blank ||
    liabilities.blank ||
    purchase.value === null ||
    assets.value === null ||
    liabilities.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const netIdentifiableAssets = calculateNetIdentifiableAssets(
    assets.value,
    liabilities.value
  );
  if (netIdentifiableAssets === null) {
    return { isValid: false, errors, result: null };
  }

  const residual = calculateAcquisitionResidual(
    purchase.value,
    netIdentifiableAssets
  );
  if (residual === null) {
    return { isValid: false, errors, result: null };
  }

  const goodwill = calculateGoodwill(residual);
  const bargainPurchaseDifference =
    calculateBargainPurchaseDifference(residual);
  if (goodwill === null || bargainPurchaseDifference === null) {
    return { isValid: false, errors, result: null };
  }

  let status: GoodwillStatus = 'valid';
  let warningMessage: string | null =
    'Simplified acquisition model: Goodwill = Purchase Price − (Assets − Liabilities). Amounts share one currency label (no FX conversion).';

  if (residual < 0) {
    status = 'potentialBargainPurchase';
    warningMessage =
      'Negative residual indicates a potential bargain purchase. Reassess fair values and consideration before recognizing any bargain purchase gain — this calculator does not record income.';
  } else if (residual === 0) {
    status = 'zeroGoodwill';
    warningMessage =
      'Zero residual — consideration equals identifiable net assets under this simplified model.';
  } else if (
    purchase.value === 0 &&
    assets.value === 0 &&
    liabilities.value === 0
  ) {
    warningMessage =
      'All inputs are zero. Arithmetic is valid, but a zero-value scenario does not by itself establish a qualifying business combination.';
  }

  const result: GoodwillResult = {
    purchasePrice: purchase.value,
    fairValueOfAssets: assets.value,
    fairValueOfLiabilities: liabilities.value,
    netIdentifiableAssets,
    acquisitionResidual: residual,
    goodwill,
    bargainPurchaseDifference,
    status,
    interpretation: interpretGoodwill(
      residual,
      goodwill,
      bargainPurchaseDifference,
      status
    ),
    warningMessage,
    currency,
    formattedPurchasePrice: formatGwMoney(purchase.value, currency),
    formattedFairValueOfAssets: formatGwMoney(assets.value, currency),
    formattedFairValueOfLiabilities: formatGwMoney(
      liabilities.value,
      currency
    ),
    formattedNetIdentifiableAssets: formatGwMoney(
      netIdentifiableAssets,
      currency
    ),
    formattedGoodwill: formatGwMoney(goodwill, currency),
    formattedBargainPurchaseDifference:
      residual < 0
        ? formatGwMoney(bargainPurchaseDifference, currency)
        : null,
  };

  return { isValid: true, errors, result };
}
