import { buildCostOfGoodsSoldResult } from './calculation';
import type {
  CostOfGoodsSoldFieldErrors,
  CostOfGoodsSoldInput,
  CostOfGoodsSoldResult,
} from './types';

export function validateCostOfGoodsSold(input: CostOfGoodsSoldInput): {
  isValid: boolean;
  incomplete: boolean;
  errors: CostOfGoodsSoldFieldErrors;
  result: CostOfGoodsSoldResult | null;
} {
  const errors: CostOfGoodsSoldFieldErrors = {};
  const { beginningInventory, purchases, endingInventory, currency } = input;

  const missing =
    !Number.isFinite(beginningInventory) ||
    !Number.isFinite(purchases) ||
    !Number.isFinite(endingInventory);

  if (missing) {
    return { isValid: false, incomplete: true, errors, result: null };
  }

  if (beginningInventory < 0) {
    errors.beginningInventory = 'Beginning inventory cannot be negative';
  }
  if (purchases < 0) {
    errors.purchases = 'Purchases cannot be negative';
  }
  if (endingInventory < 0) {
    errors.endingInventory = 'Ending inventory cannot be negative';
  }

  if (Object.keys(errors).length === 0 && endingInventory > beginningInventory + purchases) {
    errors.endingInventory =
      'Ending inventory cannot exceed beginning inventory plus purchases';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, incomplete: false, errors, result: null };
  }

  return {
    isValid: true,
    incomplete: false,
    errors: {},
    result: buildCostOfGoodsSoldResult(
      beginningInventory,
      purchases,
      endingInventory,
      currency
    ),
  };
}
