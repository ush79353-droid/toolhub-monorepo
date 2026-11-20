import {
  calculateEarnestMoney,
  calculateEarnestMoneyPercentage,
  calculatePropertyPriceFromEarnestMoney,
  formatEarnestMoneyMoney,
  formatEarnestMoneyPercent,
} from './calculation';
import type {
  EarnestMoneyFieldErrors,
  EarnestMoneyInput,
  EarnestMoneyResult,
} from './types';

export interface EarnestMoneyValidation {
  isValid: boolean;
  errors: EarnestMoneyFieldErrors;
  result: EarnestMoneyResult | null;
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
 * Validates inputs for the active calculation mode and computes the
 * dependent field. Modes stay one-directional (no circular updates).
 */
export function validateEarnestMoneyInput(
  input: EarnestMoneyInput
): EarnestMoneyValidation {
  const errors: EarnestMoneyFieldErrors = {};
  const price = parseNumber(input.propertyPrice);
  const pct = parseNumber(input.earnestMoneyPercentage);
  const amount = parseNumber(input.earnestMoneyAmount);

  if (!price.blank && (price.invalid || price.value === null)) {
    errors.propertyPrice = 'Enter a valid property price.';
  } else if (price.value !== null && price.value < 0) {
    errors.propertyPrice = 'Property price must be zero or greater.';
  }

  if (!pct.blank && (pct.invalid || pct.value === null)) {
    errors.earnestMoneyPercentage = 'Enter a valid percentage.';
  } else if (pct.value !== null && pct.value < 0) {
    errors.earnestMoneyPercentage = 'Percentage must be zero or greater.';
  } else if (pct.value !== null && pct.value > 100) {
    errors.earnestMoneyPercentage = 'Percentage must be between 0% and 100%.';
  }

  if (!amount.blank && (amount.invalid || amount.value === null)) {
    errors.earnestMoneyAmount = 'Enter a valid earnest money amount.';
  } else if (amount.value !== null && amount.value < 0) {
    errors.earnestMoneyAmount = 'Earnest money must be zero or greater.';
  }

  const currency = input.currency;
  let propertyPrice = 0;
  let earnestMoneyPercentage = 0;
  let earnestMoneyAmount = 0;
  let ready = false;

  if (input.mode === 'deposit') {
    if (
      !price.blank &&
      !pct.blank &&
      !errors.propertyPrice &&
      !errors.earnestMoneyPercentage &&
      price.value !== null &&
      pct.value !== null
    ) {
      const em = calculateEarnestMoney(price.value, pct.value);
      if (em !== null) {
        propertyPrice = price.value;
        earnestMoneyPercentage = pct.value;
        earnestMoneyAmount = em;
        ready = true;
      }
    }
  } else if (input.mode === 'percentage') {
    if (
      !price.blank &&
      !amount.blank &&
      !errors.propertyPrice &&
      !errors.earnestMoneyAmount &&
      price.value !== null &&
      amount.value !== null
    ) {
      if (price.value === 0) {
        errors.propertyPrice =
          'Property price must be greater than zero to solve percentage.';
      } else {
        const p = calculateEarnestMoneyPercentage(amount.value, price.value);
        if (p !== null) {
          if (p > 100) {
            errors.earnestMoneyAmount =
              'Deposit exceeds 100% of the property price.';
          } else {
            propertyPrice = price.value;
            earnestMoneyAmount = amount.value;
            earnestMoneyPercentage = p;
            ready = true;
          }
        }
      }
    }
  } else {
    // propertyPrice mode
    if (
      !amount.blank &&
      !pct.blank &&
      !errors.earnestMoneyAmount &&
      !errors.earnestMoneyPercentage &&
      amount.value !== null &&
      pct.value !== null
    ) {
      if (pct.value === 0) {
        errors.earnestMoneyPercentage =
          'Percentage must be greater than zero to solve property price.';
      } else {
        const pp = calculatePropertyPriceFromEarnestMoney(
          amount.value,
          pct.value
        );
        if (pp !== null) {
          earnestMoneyAmount = amount.value;
          earnestMoneyPercentage = pct.value;
          propertyPrice = pp;
          ready = true;
        }
      }
    }
  }

  if (!ready) {
    return { isValid: false, errors, result: null };
  }

  const result: EarnestMoneyResult = {
    propertyPrice,
    earnestMoneyPercentage,
    earnestMoneyAmount,
    currency,
    formattedPropertyPrice: formatEarnestMoneyMoney(propertyPrice, currency),
    formattedEarnestMoneyPercentage: formatEarnestMoneyPercent(
      earnestMoneyPercentage
    ),
    formattedEarnestMoneyAmount: formatEarnestMoneyMoney(
      earnestMoneyAmount,
      currency
    ),
  };

  return { isValid: true, errors, result };
}
