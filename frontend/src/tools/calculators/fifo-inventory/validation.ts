import { isSupportedCurrency } from '@/tools/shared/currency';
import { calculateFifoInventory } from './calculation';
import type {
  FifoInventoryFieldErrors,
  FifoInventoryInput,
  FifoInventoryResult,
} from './types';

function finite(value: number): boolean {
  return Number.isFinite(value);
}

export function validateFifoInventory(input: FifoInventoryInput): {
  isValid: boolean;
  incomplete: boolean;
  errors: FifoInventoryFieldErrors;
  result: FifoInventoryResult | null;
} {
  const errors: FifoInventoryFieldErrors = {};
  let anyBlank = false;

  if (!isSupportedCurrency(input.currency)) errors.currency = 'Choose a supported currency';

  const fields: { key: keyof FifoInventoryInput; label: string }[] = [
    { key: 'batch1Price', label: '1st units purchased price' },
    { key: 'batch1Qty', label: 'Number of units purchased 1st time' },
    { key: 'batch2Price', label: '2nd units purchased price' },
    { key: 'batch2Qty', label: 'Number of units purchased 2nd time' },
    { key: 'unitsSold', label: 'Total units sold' },
    { key: 'sellingPrice', label: 'Selling price' },
  ];

  for (const { key, label } of fields) {
    const value = input[key];
    if (typeof value !== 'number') continue;
    if (!finite(value)) {
      anyBlank = true;
      continue;
    }
    if (value < 0) {
      errors[key] = `${label} cannot be negative`;
    }
  }

  if (
    !anyBlank &&
    finite(input.unitsSold) &&
    finite(input.batch1Qty) &&
    finite(input.batch2Qty) &&
    !errors.unitsSold &&
    !errors.batch1Qty &&
    !errors.batch2Qty &&
    input.unitsSold > input.batch1Qty + input.batch2Qty
  ) {
    errors.unitsSold = 'Units sold cannot exceed total units purchased';
  }

  if (anyBlank || Object.keys(errors).length > 0) {
    return {
      isValid: false,
      incomplete: anyBlank && Object.keys(errors).length === 0,
      errors,
      result: null,
    };
  }

  const result = calculateFifoInventory(input);
  if (!result) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, incomplete: false, errors, result: null };
  }

  return { isValid: true, incomplete: false, errors: {}, result };
}
