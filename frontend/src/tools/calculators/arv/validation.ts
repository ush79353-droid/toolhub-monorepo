import {
  calculateArv,
  calculateCurrentPropertyValue,
  calculateMaximumBid,
  calculateRoi,
  calculateTargetPurchasePrice,
  formatArvMoney,
  formatArvPercent,
} from './calculation';
import type { ArvFieldErrors, ArvInput, ArvResult } from './types';

export interface ArvValidation {
  isValid: boolean;
  errors: ArvFieldErrors;
  result: ArvResult | null;
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
 * Validates ARV inputs and computes ARV, maximum bid, ROI, and optional
 * target-ROI purchase price. Incomplete required fields clear results
 * rather than inventing zeros.
 */
export function validateArvInput(input: ArvInput): ArvValidation {
  const errors: ArvFieldErrors = {};

  const propertyValue = parseNumber(input.propertyValue);
  const averagePrice = parseNumber(input.averagePrice);
  const propertyArea = parseNumber(input.propertyArea);
  const renovationValue = parseNumber(input.renovationValue);
  const renovationCost = parseNumber(input.renovationCost);
  const purchaseRule = parseNumber(input.purchaseRulePercent);
  const purchasePrice = parseNumber(input.purchasePrice);
  const targetRoi = parseNumber(input.targetRoiPercent);

  if (input.method === 'property-value') {
    if (
      !propertyValue.blank &&
      (propertyValue.invalid || propertyValue.value === null)
    ) {
      errors.propertyValue = 'Enter a valid property value.';
    } else if (propertyValue.value !== null && propertyValue.value < 0) {
      errors.propertyValue = 'Property value must be zero or greater.';
    }
  } else {
    if (
      !averagePrice.blank &&
      (averagePrice.invalid || averagePrice.value === null)
    ) {
      errors.averagePrice = 'Enter a valid average price.';
    } else if (averagePrice.value !== null && averagePrice.value < 0) {
      errors.averagePrice = 'Average price must be zero or greater.';
    }

    if (
      !propertyArea.blank &&
      (propertyArea.invalid || propertyArea.value === null)
    ) {
      errors.propertyArea = 'Enter a valid property area.';
    } else if (propertyArea.value !== null && propertyArea.value < 0) {
      errors.propertyArea = 'Property area must be zero or greater.';
    } else if (propertyArea.value === 0) {
      errors.propertyArea = 'Property area must be greater than zero.';
    }
  }

  if (
    !renovationValue.blank &&
    (renovationValue.invalid || renovationValue.value === null)
  ) {
    errors.renovationValue = 'Enter a valid renovation value.';
  } else if (renovationValue.value !== null && renovationValue.value < 0) {
    errors.renovationValue = 'Renovation value must be zero or greater.';
  }

  if (
    !renovationCost.blank &&
    (renovationCost.invalid || renovationCost.value === null)
  ) {
    errors.renovationCost = 'Enter a valid renovation cost.';
  } else if (renovationCost.value !== null && renovationCost.value < 0) {
    errors.renovationCost = 'Renovation cost must be zero or greater.';
  }

  if (
    !purchaseRule.blank &&
    (purchaseRule.invalid || purchaseRule.value === null)
  ) {
    errors.purchaseRulePercent = 'Enter a valid purchase rule percent.';
  } else if (
    purchaseRule.value !== null &&
    (purchaseRule.value < 0 || purchaseRule.value > 100)
  ) {
    errors.purchaseRulePercent = 'Purchase rule must be between 0% and 100%.';
  }

  if (
    !purchasePrice.blank &&
    (purchasePrice.invalid || purchasePrice.value === null)
  ) {
    errors.purchasePrice = 'Enter a valid purchase price.';
  } else if (purchasePrice.value !== null && purchasePrice.value < 0) {
    errors.purchasePrice = 'Purchase price must be zero or greater.';
  }

  if (
    !targetRoi.blank &&
    (targetRoi.invalid || targetRoi.value === null)
  ) {
    errors.targetRoiPercent = 'Enter a valid target ROI percent.';
  } else if (targetRoi.value !== null && targetRoi.value <= -100) {
    errors.targetRoiPercent = 'Target ROI must be greater than −100%.';
  }

  const coreBlocked =
    Boolean(errors.propertyValue) ||
    Boolean(errors.averagePrice) ||
    Boolean(errors.propertyArea) ||
    Boolean(errors.renovationValue);

  const pvReady =
    input.method === 'property-value'
      ? !propertyValue.blank && !errors.propertyValue
      : !averagePrice.blank &&
        !propertyArea.blank &&
        !errors.averagePrice &&
        !errors.propertyArea;

  const renovationValueReady =
    !renovationValue.blank && !errors.renovationValue;

  if (!pvReady || !renovationValueReady || coreBlocked) {
    // Still surface field errors; clear stale results.
    return { isValid: false, errors, result: null };
  }

  const pv = calculateCurrentPropertyValue({
    method: input.method,
    propertyValue: propertyValue.value ?? 0,
    averagePrice: averagePrice.value ?? 0,
    propertyArea: propertyArea.value ?? 0,
  });

  if (pv === null) {
    errors.form = 'Unable to calculate property value from these inputs.';
    return { isValid: false, errors, result: null };
  }

  const arv = calculateArv(pv, renovationValue.value!);
  if (arv === null) {
    errors.form = 'Unable to calculate after repair value.';
    return { isValid: false, errors, result: null };
  }

  const currency = input.currency;
  let maximumBid: number | null = null;
  let maximumBidNegative = false;

  const bidReady =
    !renovationCost.blank &&
    !purchaseRule.blank &&
    !errors.renovationCost &&
    !errors.purchaseRulePercent;

  if (bidReady) {
    maximumBid = calculateMaximumBid(
      arv,
      purchaseRule.value!,
      renovationCost.value!
    );
    if (maximumBid !== null && maximumBid < 0) {
      maximumBidNegative = true;
    }
  }

  let roiPercent: number | null = null;
  let roiUsedMaximumBid = false;
  let purchasePriceUsed = 0;
  let totalInvestment = 0;
  let estimatedGrossProfit: number | null = null;

  const customPurchaseReady =
    !purchasePrice.blank && !errors.purchasePrice && purchasePrice.value !== null;

  if (customPurchaseReady && bidReady && renovationCost.value !== null) {
    const roi = calculateRoi(arv, purchasePrice.value!, renovationCost.value!);
    if (roi) {
      roiPercent = roi.roiPercent;
      totalInvestment = roi.totalInvestment;
      estimatedGrossProfit = roi.estimatedGrossProfit;
      purchasePriceUsed = purchasePrice.value!;
    } else if (purchasePrice.value! + renovationCost.value! === 0) {
      // Investment zero → ROI unavailable (not 0 / Infinity).
      purchasePriceUsed = purchasePrice.value!;
      totalInvestment = 0;
      estimatedGrossProfit = null;
      roiPercent = null;
    }
  } else if (
    maximumBid !== null &&
    bidReady &&
    renovationCost.value !== null
  ) {
    const roi = calculateRoi(arv, maximumBid, renovationCost.value!);
    if (roi) {
      roiPercent = roi.roiPercent;
      totalInvestment = roi.totalInvestment;
      estimatedGrossProfit = roi.estimatedGrossProfit;
      purchasePriceUsed = maximumBid;
      roiUsedMaximumBid = true;
    } else if (maximumBid + renovationCost.value! === 0) {
      purchasePriceUsed = maximumBid;
      totalInvestment = 0;
      estimatedGrossProfit = null;
      roiPercent = null;
      roiUsedMaximumBid = true;
    }
  }

  let targetPurchasePrice: number | null = null;
  if (
    !targetRoi.blank &&
    !errors.targetRoiPercent &&
    targetRoi.value !== null &&
    bidReady &&
    renovationCost.value !== null
  ) {
    targetPurchasePrice = calculateTargetPurchasePrice(
      arv,
      targetRoi.value,
      renovationCost.value!
    );
  }

  const result: ArvResult = {
    propertyValue: pv,
    arv,
    maximumBid: maximumBid ?? Number.NaN,
    maximumBidNegative,
    roiPercent,
    roiUsedMaximumBid,
    purchasePriceUsed,
    totalInvestment,
    estimatedGrossProfit,
    targetPurchasePrice,
    currency,
    formattedPropertyValue: formatArvMoney(pv, currency),
    formattedArv: formatArvMoney(arv, currency),
    formattedMaximumBid:
      maximumBid !== null ? formatArvMoney(maximumBid, currency) : '',
    formattedRoi: roiPercent !== null ? formatArvPercent(roiPercent) : null,
    formattedPurchasePriceUsed: Number.isFinite(purchasePriceUsed)
      ? formatArvMoney(purchasePriceUsed, currency)
      : '',
    formattedTotalInvestment: Number.isFinite(totalInvestment)
      ? formatArvMoney(totalInvestment, currency)
      : '',
    formattedGrossProfit:
      estimatedGrossProfit !== null
        ? formatArvMoney(estimatedGrossProfit, currency)
        : null,
    formattedTargetPurchasePrice:
      targetPurchasePrice !== null
        ? formatArvMoney(targetPurchasePrice, currency)
        : null,
  };

  // ARV alone is enough for a partial valid result; bid/ROI may still be empty.
  return { isValid: true, errors, result };
}
