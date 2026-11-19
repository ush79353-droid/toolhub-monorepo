import {
  calculateNetWorth,
  isNetWorthInputBlank,
  parseOptionalNumber,
} from './calculation';
import { getNetWorthBenchmark } from './benchmarks';
import type {
  NetWorthAssets,
  NetWorthFieldErrors,
  NetWorthInput,
  NetWorthLiabilities,
  NetWorthResult,
} from './types';
import { ASSET_FIELDS, LIABILITY_FIELDS } from './types';

export interface NetWorthValidation {
  isValid: boolean;
  incomplete: boolean;
  errors: NetWorthFieldErrors;
  result: NetWorthResult | null;
}

const MAX_AMOUNT = 1e15;

function parseNonNegativeField(
  raw: string,
  label: string,
): { value: number | null; error?: string } {
  const value = parseOptionalNumber(raw);
  if (value === null) {
    return { value: null, error: `Enter a valid amount for ${label}.` };
  }
  if (value < 0 || value > MAX_AMOUNT) {
    return {
      value: null,
      error: `${label} must be zero or a positive amount.`,
    };
  }
  return { value };
}

export function validateNetWorthInput(
  input: NetWorthInput,
): NetWorthValidation {
  const errors: NetWorthFieldErrors = {};

  if (isNetWorthInputBlank(input)) {
    return { isValid: false, incomplete: true, errors: {}, result: null };
  }

  const assets = {} as Record<keyof NetWorthAssets, number>;
  for (const field of ASSET_FIELDS) {
    const parsed = parseNonNegativeField(
      input.assets[field.key],
      field.label,
    );
    if (parsed.error || parsed.value === null) {
      errors.assets = parsed.error ?? 'Invalid asset value.';
      break;
    }
    assets[field.key] = parsed.value;
  }

  const liabilities = {} as Record<keyof NetWorthLiabilities, number>;
  for (const field of LIABILITY_FIELDS) {
    const parsed = parseNonNegativeField(
      input.liabilities[field.key],
      field.label,
    );
    if (parsed.error || parsed.value === null) {
      errors.liabilities = parsed.error ?? 'Invalid liability value.';
      break;
    }
    liabilities[field.key] = parsed.value;
  }

  if (!getNetWorthBenchmark(input.comparisonType, input.comparisonGroupId)) {
    errors.form = 'Select a valid comparison group.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, incomplete: false, errors, result: null };
  }

  const result = calculateNetWorth({
    assets,
    liabilities,
    currency: input.currency,
    comparisonType: input.comparisonType,
    comparisonGroupId: input.comparisonGroupId,
  });

  return { isValid: true, incomplete: false, errors: {}, result };
}
