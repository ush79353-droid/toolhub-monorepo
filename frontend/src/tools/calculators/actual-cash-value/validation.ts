import {
  calculateAccumulatedDepreciation,
  calculateActualCashValue,
  calculateAnnualDepreciation,
  calculateDepreciationPercentage,
  calculateMonthlyDepreciation,
  calculateRemainingUsefulLife,
  calculateRemainingValuePercentage,
  convertMonthsToYears,
  formatAcvMoney,
  formatAcvPercent,
  formatRemainingLifeLabel,
  toMonths,
} from './calculation';
import type {
  ActualCashValueFieldErrors,
  ActualCashValueInput,
  ActualCashValueResult,
} from './types';

export interface ActualCashValueValidation {
  isValid: boolean;
  errors: ActualCashValueFieldErrors;
  result: ActualCashValueResult | null;
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

export function validateActualCashValueInput(
  input: ActualCashValueInput
): ActualCashValueValidation {
  const errors: ActualCashValueFieldErrors = {};
  const currency = input.currency;

  const priceParsed = parseNumber(input.purchasePrice);
  let purchasePrice: number | null = null;
  if (priceParsed.blank) {
    // wait
  } else if (priceParsed.invalid || priceParsed.value === null) {
    errors.purchasePrice = 'Enter a valid purchase price.';
  } else if (priceParsed.value < 0) {
    errors.purchasePrice = 'Purchase price cannot be negative.';
  } else {
    purchasePrice = priceParsed.value;
  }

  const lifeParsed = parseNumber(input.expectedLife);
  let expectedLifeMonths: number | null = null;
  if (lifeParsed.blank) {
    // wait
  } else if (lifeParsed.invalid || lifeParsed.value === null) {
    errors.expectedLife = 'Enter a valid expected life.';
  } else if (lifeParsed.value <= 0) {
    errors.expectedLife = 'Expected life must be greater than zero.';
  } else {
    expectedLifeMonths = toMonths(lifeParsed.value, input.expectedLifeUnit);
    if (expectedLifeMonths === null || expectedLifeMonths <= 0) {
      errors.expectedLife = 'Enter a valid expected life.';
      expectedLifeMonths = null;
    }
  }

  const ageParsed = parseNumber(input.currentAge);
  let currentAgeMonths: number | null = null;
  if (ageParsed.blank) {
    // wait
  } else if (ageParsed.invalid || ageParsed.value === null) {
    errors.currentAge = 'Enter a valid current age.';
  } else if (ageParsed.value < 0) {
    errors.currentAge = 'Current age cannot be negative.';
  } else {
    currentAgeMonths = toMonths(ageParsed.value, input.currentAgeUnit);
    if (currentAgeMonths === null || currentAgeMonths < 0) {
      errors.currentAge = 'Enter a valid current age.';
      currentAgeMonths = null;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    purchasePrice === null ||
    expectedLifeMonths === null ||
    currentAgeMonths === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const actualCashValue = calculateActualCashValue(
    purchasePrice,
    expectedLifeMonths,
    currentAgeMonths
  );
  if (actualCashValue === null) {
    return { isValid: false, errors, result: null };
  }

  const expectedLifeYears = convertMonthsToYears(expectedLifeMonths);
  const annualDepreciation = calculateAnnualDepreciation(
    purchasePrice,
    expectedLifeYears
  );
  const monthlyDepreciation = calculateMonthlyDepreciation(
    purchasePrice,
    expectedLifeMonths
  );
  const accumulatedDepreciation = calculateAccumulatedDepreciation(
    purchasePrice,
    actualCashValue
  );
  const depreciationPercentage = calculateDepreciationPercentage(
    currentAgeMonths,
    expectedLifeMonths
  );
  if (
    annualDepreciation === null ||
    monthlyDepreciation === null ||
    accumulatedDepreciation === null ||
    depreciationPercentage === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const remainingValuePercentage = calculateRemainingValuePercentage(
    depreciationPercentage
  );
  const remainingUsefulLifeMonths = calculateRemainingUsefulLife(
    expectedLifeMonths,
    currentAgeMonths
  );
  if (
    remainingValuePercentage === null ||
    remainingUsefulLifeMonths === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const result: ActualCashValueResult = {
    purchasePrice,
    expectedLifeMonths,
    currentAgeMonths,
    actualCashValue,
    annualDepreciation,
    monthlyDepreciation,
    accumulatedDepreciation,
    depreciationPercentage,
    remainingValuePercentage,
    remainingUsefulLifeMonths,
    beyondUsefulLife: currentAgeMonths > expectedLifeMonths,
    currency,
    formattedPurchasePrice: formatAcvMoney(purchasePrice, currency),
    formattedActualCashValue: formatAcvMoney(actualCashValue, currency),
    formattedAnnualDepreciation: formatAcvMoney(annualDepreciation, currency),
    formattedMonthlyDepreciation: formatAcvMoney(monthlyDepreciation, currency),
    formattedAccumulatedDepreciation: formatAcvMoney(
      accumulatedDepreciation,
      currency
    ),
    formattedDepreciationPercentage: formatAcvPercent(depreciationPercentage),
    formattedRemainingValuePercentage: formatAcvPercent(
      remainingValuePercentage
    ),
    formattedRemainingUsefulLife: formatRemainingLifeLabel(
      remainingUsefulLifeMonths
    ),
  };

  return { isValid: true, errors, result };
}
