import {
  calculateScrapGoldResults,
  parseOptionalNumber,
} from './calculation';
import type {
  ScrapGoldFieldErrors,
  ScrapGoldInput,
  ScrapGoldResult,
} from './types';

export function isScrapGoldInputBlank(input: ScrapGoldInput): boolean {
  return !input.weight.trim() && !input.pricePerUnit.trim();
}

export function validateScrapGoldInput(input: ScrapGoldInput): {
  isValid: boolean;
  incomplete: boolean;
  errors: ScrapGoldFieldErrors;
  result: ScrapGoldResult | null;
} {
  const errors: ScrapGoldFieldErrors = {};

  if (isScrapGoldInputBlank(input)) {
    return { isValid: false, incomplete: true, errors: {}, result: null };
  }

  const weight = parseOptionalNumber(input.weight);
  const karat = parseOptionalNumber(input.karat);
  const purityPercent = parseOptionalNumber(input.purityPercent);
  const pricePerUnit = parseOptionalNumber(input.pricePerUnit);

  if (weight === null || weight < 0) {
    errors.weight = 'Enter a scrap gold weight of zero or more.';
  }
  if (karat === null || karat < 0 || karat > 24) {
    errors.karat = 'Enter a karat between 0 and 24.';
  }
  if (purityPercent === null || purityPercent < 0 || purityPercent > 100) {
    errors.purityPercent = 'Enter a purity between 0% and 100%.';
  }
  if (pricePerUnit === null || pricePerUnit < 0) {
    errors.pricePerUnit = 'Enter a market price of zero or more.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, incomplete: false, errors, result: null };
  }

  const result = calculateScrapGoldResults({
    weight: weight!,
    weightUnit: input.weightUnit,
    karat: karat!,
    purityPercent: purityPercent!,
    pureGoldUnit: input.pureGoldUnit,
    pricePerUnit: pricePerUnit!,
    priceUnit: input.priceUnit,
    currency: input.currency,
  });

  if (!result) {
    return {
      isValid: false,
      incomplete: false,
      errors: { form: 'Unable to calculate scrap gold value with these inputs.' },
      result: null,
    };
  }

  return { isValid: true, incomplete: false, errors: {}, result };
}
