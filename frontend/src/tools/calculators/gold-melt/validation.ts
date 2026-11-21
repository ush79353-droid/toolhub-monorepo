import {
  calculateGoldMeltPlan,
  isGoldMeltInputBlank,
  parseOptionalNumber,
} from './calculation';
import type { GoldMeltFieldErrors, GoldMeltInput, GoldMeltResult } from './types';

export interface GoldMeltValidation {
  isValid: boolean;
  incomplete: boolean;
  errors: GoldMeltFieldErrors;
  result: GoldMeltResult | null;
}

export function validateGoldMeltInput(input: GoldMeltInput): GoldMeltValidation {
  const errors: GoldMeltFieldErrors = {};

  if (isGoldMeltInputBlank(input)) {
    return { isValid: false, incomplete: true, errors: {}, result: null };
  }

  const purity = parseOptionalNumber(input.purity);
  const weight = parseOptionalNumber(input.weight);
  const marketPrice = parseOptionalNumber(input.marketPrice);
  const spread = parseOptionalNumber(input.spread);
  const bidOverride = input.bidPriceManuallySet
    ? parseOptionalNumber(input.bidPrice)
    : null;
  const askOverride = input.askPriceManuallySet
    ? parseOptionalNumber(input.askPrice)
    : null;

  if (purity === null || !(purity > 0) || purity > 100) {
    errors.purity = 'Enter a purity greater than 0% and at most 100%.';
  }
  if (weight === null || !(weight > 0)) {
    errors.weight = 'Enter a gold weight greater than zero.';
  }
  if (marketPrice === null || marketPrice < 0) {
    errors.marketPrice = 'Enter a valid market price of zero or more.';
  }
  if (spread === null || spread < 0 || spread >= 100) {
    errors.spread = 'Enter a spread from 0% up to (but not including) 100%.';
  }
  if (input.bidPriceManuallySet && (bidOverride === null || bidOverride < 0)) {
    errors.bidPrice = 'Enter a valid bid price.';
  }
  if (input.askPriceManuallySet && (askOverride === null || askOverride < 0)) {
    errors.askPrice = 'Enter a valid ask price.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, incomplete: false, errors, result: null };
  }

  const result = calculateGoldMeltPlan({
    karat: input.karat,
    purityPercent: purity!,
    weight: weight!,
    weightUnit: input.weightUnit,
    marketPrice: marketPrice!,
    marketPriceUnit: input.marketPriceUnit,
    spreadPercent: spread!,
    currency: input.currency,
    bidPriceOverride: bidOverride,
    askPriceOverride: askOverride,
  });

  if (!result) {
    return {
      isValid: false,
      incomplete: false,
      errors: { form: 'Unable to calculate with the provided values.' },
      result: null,
    };
  }

  return { isValid: true, incomplete: false, errors: {}, result };
}
