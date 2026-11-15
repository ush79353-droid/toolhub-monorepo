import { buildDirectMaterialPriceVarianceResult } from './calculation';
import type {
  DirectMaterialPriceVarianceFieldErrors,
  DirectMaterialPriceVarianceInput,
  DirectMaterialPriceVarianceResult,
} from './types';

export function validateDirectMaterialPriceVariance(
  input: DirectMaterialPriceVarianceInput
): {
  isValid: boolean;
  incomplete: boolean;
  errors: DirectMaterialPriceVarianceFieldErrors;
  result: DirectMaterialPriceVarianceResult | null;
} {
  const errors: DirectMaterialPriceVarianceFieldErrors = {};
  const { standardRate, actualRate, quantity, currency } = input;

  const missing =
    !Number.isFinite(standardRate) ||
    !Number.isFinite(actualRate) ||
    !Number.isFinite(quantity);

  if (missing) {
    return { isValid: false, incomplete: true, errors, result: null };
  }

  if (standardRate < 0) errors.standardRate = 'Standard rate cannot be negative';
  if (actualRate < 0) errors.actualRate = 'Actual rate cannot be negative';
  if (quantity < 0) errors.quantity = 'Quantity cannot be negative';

  if (Object.keys(errors).length > 0) {
    return { isValid: false, incomplete: false, errors, result: null };
  }

  const result = buildDirectMaterialPriceVarianceResult(
    standardRate,
    actualRate,
    quantity,
    currency
  );

  return {
    isValid: result !== null,
    incomplete: false,
    errors: result ? {} : { form: 'Unable to calculate variance with the current inputs' },
    result,
  };
}
