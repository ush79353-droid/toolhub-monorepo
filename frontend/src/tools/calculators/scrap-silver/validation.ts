import {
  calculateScrapSilverResults,
  parseOptionalNumber,
} from './calculation';
import type {
  ScrapSilverFieldErrors,
  ScrapSilverInput,
  ScrapSilverResult,
} from './types';

export function isScrapSilverInputBlank(input: ScrapSilverInput): boolean {
  return !input.weight.trim() && !input.pricePerUnit.trim();
}

export function validateScrapSilverInput(input: ScrapSilverInput): {
  isValid: boolean;
  incomplete: boolean;
  errors: ScrapSilverFieldErrors;
  result: ScrapSilverResult | null;
} {
  const errors: ScrapSilverFieldErrors = {};

  if (isScrapSilverInputBlank(input)) {
    return { isValid: false, incomplete: true, errors: {}, result: null };
  }

  const weight = parseOptionalNumber(input.weight);
  const purityPercent = parseOptionalNumber(input.purityPercent);
  const pricePerUnit = parseOptionalNumber(input.pricePerUnit);
  const dealerDiscountPercent = parseOptionalNumber(
    input.dealerDiscountPercent.trim() === '' ? '0' : input.dealerDiscountPercent,
  );
  const refiningFee = parseOptionalNumber(
    input.refiningFee.trim() === '' ? '0' : input.refiningFee,
  );
  const transactionFee = parseOptionalNumber(
    input.transactionFee.trim() === '' ? '0' : input.transactionFee,
  );

  if (weight === null || weight < 0) {
    errors.weight = 'Enter a scrap silver weight of zero or more.';
  }
  if (purityPercent === null || !(purityPercent > 0) || purityPercent > 100) {
    errors.purityPercent = 'Enter a purity greater than 0% and at most 100%.';
  }
  if (pricePerUnit === null || pricePerUnit < 0) {
    errors.pricePerUnit = 'Enter a market price of zero or more.';
  }
  if (
    dealerDiscountPercent === null ||
    dealerDiscountPercent < 0 ||
    dealerDiscountPercent > 100
  ) {
    errors.dealerDiscountPercent =
      'Dealer discount must be between 0% and 100%.';
  }
  if (refiningFee === null || refiningFee < 0) {
    errors.refiningFee = 'Refining fee cannot be negative.';
  }
  if (transactionFee === null || transactionFee < 0) {
    errors.transactionFee = 'Transaction fee cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, incomplete: false, errors, result: null };
  }

  const result = calculateScrapSilverResults({
    weight: weight!,
    weightUnit: input.weightUnit,
    purityPreset: input.purityPreset,
    purityPercent: purityPercent!,
    pureSilverUnit: input.pureSilverUnit,
    pricePerUnit: pricePerUnit!,
    priceUnit: input.priceUnit,
    dealerDiscountPercent: dealerDiscountPercent!,
    refiningFee: refiningFee!,
    transactionFee: transactionFee!,
    currency: input.currency,
  });

  if (!result) {
    return {
      isValid: false,
      incomplete: false,
      errors: {
        form: 'Unable to calculate scrap silver value with these inputs.',
      },
      result: null,
    };
  }

  return { isValid: true, incomplete: false, errors: {}, result };
}
