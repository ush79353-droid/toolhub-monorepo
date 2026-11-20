import {
  calculateDesiredDiscountAmount,
  calculateOfferAmount,
  calculateOfferToValueRatio,
  calculateTotalOfferDeductions,
  calculateTotalOfferReductionPercentage,
  formatOfferMoney,
  formatOfferPercent,
  validateOfferScenario,
} from './calculation';
import type {
  WhatToOfferFieldErrors,
  WhatToOfferInput,
  WhatToOfferResult,
} from './types';

export interface WhatToOfferValidation {
  isValid: boolean;
  errors: WhatToOfferFieldErrors;
  result: WhatToOfferResult | null;
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

/**
 * Optional adjustment fields: blank → 0 (explicit zero-cost assumption).
 * FMV is required and must be > 0.
 */
export function validateWhatToOfferInput(
  input: WhatToOfferInput
): WhatToOfferValidation {
  const errors: WhatToOfferFieldErrors = {};
  const currency = input.currency;

  const fmvParsed = parseNumber(input.fairMarketValue);
  let fairMarketValue: number | null = null;
  if (fmvParsed.blank) {
    // wait
  } else if (fmvParsed.invalid || fmvParsed.value === null) {
    errors.fairMarketValue = 'Enter a valid fair market value.';
  } else if (fmvParsed.value <= 0) {
    errors.fairMarketValue = 'Fair market value must be greater than zero.';
  } else {
    fairMarketValue = fmvParsed.value;
  }

  const renoParsed = parseNumber(input.renovationCost);
  let renovationCost: number | null = null;
  if (renoParsed.blank) {
    renovationCost = 0;
  } else if (renoParsed.invalid || renoParsed.value === null) {
    errors.renovationCost = 'Enter a valid renovation cost.';
  } else if (renoParsed.value < 0) {
    errors.renovationCost = 'Renovation cost cannot be negative.';
  } else {
    renovationCost = renoParsed.value;
  }

  const discountParsed = parseNumber(input.desiredDiscount);
  let desiredDiscountInput: number | null = null;
  if (discountParsed.blank) {
    desiredDiscountInput = 0;
  } else if (discountParsed.invalid || discountParsed.value === null) {
    errors.desiredDiscount = 'Enter a valid desired discount.';
  } else if (discountParsed.value < 0) {
    errors.desiredDiscount = 'Desired discount cannot be negative.';
  } else if (
    input.discountMode === 'percentage' &&
    discountParsed.value > 100
  ) {
    errors.desiredDiscount = 'Discount percentage cannot exceed 100%.';
  } else {
    desiredDiscountInput = discountParsed.value;
  }

  const profitParsed = parseNumber(input.desiredProfit);
  let desiredProfit: number | null = null;
  if (profitParsed.blank) {
    desiredProfit = 0;
  } else if (profitParsed.invalid || profitParsed.value === null) {
    errors.desiredProfit = 'Enter a valid desired profit.';
  } else if (profitParsed.value < 0) {
    errors.desiredProfit = 'Desired profit cannot be negative.';
  } else {
    desiredProfit = profitParsed.value;
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    fairMarketValue === null ||
    renovationCost === null ||
    desiredDiscountInput === null ||
    desiredProfit === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const discountAmount = calculateDesiredDiscountAmount(
    fairMarketValue,
    desiredDiscountInput,
    input.discountMode
  );
  if (discountAmount === null) {
    return { isValid: false, errors, result: null };
  }

  const totalDeductions = calculateTotalOfferDeductions(
    renovationCost,
    discountAmount,
    desiredProfit
  );
  if (totalDeductions === null) {
    return { isValid: false, errors, result: null };
  }

  const rawOfferAmount = calculateOfferAmount(
    fairMarketValue,
    renovationCost,
    discountAmount,
    desiredProfit
  );
  if (rawOfferAmount === null) {
    return { isValid: false, errors, result: null };
  }

  const scenario = validateOfferScenario(rawOfferAmount);
  const offerForRatios =
    scenario.actionableOfferAmount !== null
      ? scenario.actionableOfferAmount
      : rawOfferAmount;

  const offerToValuePercentage = calculateOfferToValueRatio(
    offerForRatios,
    fairMarketValue
  );
  const totalOfferReductionPercentage =
    calculateTotalOfferReductionPercentage(fairMarketValue, offerForRatios);

  const result: WhatToOfferResult = {
    fairMarketValue,
    renovationCost,
    discountAmount,
    desiredProfit,
    totalDeductions,
    rawOfferAmount,
    actionableOfferAmount: scenario.actionableOfferAmount,
    offerToValuePercentage,
    totalOfferReductionPercentage,
    status: scenario.status,
    warningMessage: scenario.warningMessage,
    currency,
    formattedFairMarketValue: formatOfferMoney(fairMarketValue, currency),
    formattedRenovationCost: formatOfferMoney(renovationCost, currency),
    formattedDiscountAmount: formatOfferMoney(discountAmount, currency),
    formattedDesiredProfit: formatOfferMoney(desiredProfit, currency),
    formattedTotalDeductions: formatOfferMoney(totalDeductions, currency),
    formattedRawOfferAmount: formatOfferMoney(rawOfferAmount, currency),
    formattedActionableOfferAmount:
      scenario.actionableOfferAmount === null
        ? null
        : formatOfferMoney(scenario.actionableOfferAmount, currency),
    formattedOfferToValue:
      offerToValuePercentage === null
        ? null
        : formatOfferPercent(offerToValuePercentage),
    formattedTotalOfferReduction:
      totalOfferReductionPercentage === null
        ? null
        : formatOfferPercent(totalOfferReductionPercentage),
  };

  return { isValid: true, errors, result };
}
