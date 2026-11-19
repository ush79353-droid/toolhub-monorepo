import {
  calculateSilverMeltResults,
  convertWeightToGrams,
  parseOptionalNumber,
} from './calculation';
import type {
  SilverMeltFieldErrors,
  SilverMeltInput,
  SilverMeltResult,
} from './types';

export function isSilverMeltInputBlank(input: SilverMeltInput): boolean {
  return !input.weight.trim() && !input.pricePerUnit.trim();
}

export function validateSilverMeltInput(input: SilverMeltInput): {
  isValid: boolean;
  incomplete: boolean;
  errors: SilverMeltFieldErrors;
  result: SilverMeltResult | null;
} {
  const errors: SilverMeltFieldErrors = {};

  if (isSilverMeltInputBlank(input)) {
    return { isValid: false, incomplete: true, errors: {}, result: null };
  }

  const weight = parseOptionalNumber(input.weight);
  const purityPercent = parseOptionalNumber(input.purityPercent);
  const pricePerUnit = parseOptionalNumber(input.pricePerUnit);

  if (weight === null || weight < 0) {
    errors.weight = 'Enter a silver item weight of zero or more.';
  }
  if (purityPercent === null || !(purityPercent > 0) || purityPercent > 100) {
    errors.purityPercent = 'Enter a purity greater than 0% and at most 100%.';
  }
  if (pricePerUnit === null || pricePerUnit < 0) {
    errors.pricePerUnit = 'Enter a market price of zero or more.';
  }

  let otherMetalWeight: number | null = null;
  let otherMetalPrice: number | null = null;

  if (input.alloyOpen) {
    if (!input.deriveOtherFromRemainder) {
      otherMetalWeight = parseOptionalNumber(input.otherMetalWeight);
      if (otherMetalWeight === null || otherMetalWeight < 0) {
        errors.otherMetalWeight =
          'Enter an other-metal weight of zero or more, or enable remainder derivation.';
      } else if (weight !== null && weight >= 0 && purityPercent !== null) {
        const totalGrams = convertWeightToGrams(weight, input.weightUnit);
        const otherGrams = convertWeightToGrams(
          otherMetalWeight,
          input.otherMetalWeightUnit,
        );
        if (otherGrams > totalGrams + 1e-9) {
          errors.otherMetalWeight =
            'Other metal weight cannot exceed the total item weight.';
        }
      }
    }

    // Price optional until entered — if blank, alloy value omitted but silver still ok
    if (input.otherMetalPrice.trim()) {
      otherMetalPrice = parseOptionalNumber(input.otherMetalPrice);
      if (otherMetalPrice === null || otherMetalPrice < 0) {
        errors.otherMetalPrice = 'Other metal price cannot be negative.';
      }
    } else {
      otherMetalPrice = null;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, incomplete: false, errors, result: null };
  }

  const result = calculateSilverMeltResults({
    weight: weight!,
    weightUnit: input.weightUnit,
    purityPreset: input.purityPreset,
    purityPercent: purityPercent!,
    pureSilverUnit: input.pureSilverUnit,
    pricePerUnit: pricePerUnit!,
    priceUnit: input.priceUnit,
    currency: input.currency,
    alloyOpen: input.alloyOpen,
    otherMetalType: input.otherMetalType,
    otherMetalLabel: input.otherMetalLabel,
    deriveOtherFromRemainder: input.deriveOtherFromRemainder,
    otherMetalWeight: input.deriveOtherFromRemainder
      ? null
      : otherMetalWeight,
    otherMetalWeightUnit: input.otherMetalWeightUnit,
    otherMetalPrice,
    otherMetalPriceUnit: input.otherMetalPriceUnit,
  });

  if (!result) {
    return {
      isValid: false,
      incomplete: false,
      errors: { form: 'Unable to calculate silver melt value with these inputs.' },
      result: null,
    };
  }

  return { isValid: true, incomplete: false, errors: {}, result };
}
