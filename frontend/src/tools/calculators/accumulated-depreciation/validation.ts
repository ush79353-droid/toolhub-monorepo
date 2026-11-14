import { isSupportedCurrency } from '@/tools/shared/currency';
import { calculateAccumulatedDepreciation } from './calculation';
import {
  DEPRECIATION_METHODS,
  methodUsesProduction,
  methodUsesYears,
  type AccumulatedDepreciationFieldErrors,
  type AccumulatedDepreciationInput,
} from './types';

function finite(value: number): boolean {
  return Number.isFinite(value);
}

function requirePositiveMoney(
  errors: AccumulatedDepreciationFieldErrors,
  key: string,
  value: number,
  label: string
): void {
  if (!finite(value)) {
    errors[key] = `Enter ${label}`;
    return;
  }
  if (value <= 0) {
    errors[key] = `${label} must be greater than zero`;
  }
}

function requireNonNegativeMoney(
  errors: AccumulatedDepreciationFieldErrors,
  key: string,
  value: number,
  label: string
): void {
  if (!finite(value)) {
    errors[key] = `Enter ${label}`;
    return;
  }
  if (value < 0) {
    errors[key] = `${label} cannot be negative`;
  }
}

/** Whole accounting periods only for year-based methods. */
function requireWholeYears(
  errors: AccumulatedDepreciationFieldErrors,
  key: string,
  value: number,
  label: string,
  { allowZero }: { allowZero: boolean }
): void {
  if (!finite(value)) {
    errors[key] = `Enter ${label}`;
    return;
  }
  if (allowZero ? value < 0 : value <= 0) {
    errors[key] = allowZero
      ? `${label} cannot be negative`
      : `${label} must be greater than zero`;
    return;
  }
  if (!Number.isInteger(value)) {
    errors[key] = `${label} must be a whole number of years`;
  }
}

export function validateAccumulatedDepreciation(
  input: AccumulatedDepreciationInput
): { isValid: boolean; errors: AccumulatedDepreciationFieldErrors } {
  const errors: AccumulatedDepreciationFieldErrors = {};

  if (!DEPRECIATION_METHODS.includes(input.method)) {
    errors.method = 'Choose a depreciation method';
  }
  if (!isSupportedCurrency(input.currency)) {
    errors.currency = 'Choose a supported currency';
  }

  requirePositiveMoney(errors, 'assetCost', input.assetCost, 'cost of the asset');
  requireNonNegativeMoney(errors, 'salvageValue', input.salvageValue, 'salvage value');

  if (
    finite(input.assetCost) &&
    finite(input.salvageValue) &&
    input.salvageValue > input.assetCost
  ) {
    errors.salvageValue = 'Salvage value cannot exceed the cost of the asset';
  }

  if (methodUsesYears(input.method)) {
    requireWholeYears(errors, 'usefulLifeYears', input.usefulLifeYears, 'useful life', {
      allowZero: false,
    });
    requireWholeYears(errors, 'yearsElapsed', input.yearsElapsed, 'number of years', {
      allowZero: true,
    });
    if (
      finite(input.usefulLifeYears) &&
      finite(input.yearsElapsed) &&
      Number.isInteger(input.usefulLifeYears) &&
      Number.isInteger(input.yearsElapsed) &&
      input.yearsElapsed > input.usefulLifeYears
    ) {
      errors.yearsElapsed = 'Number of years cannot exceed useful life';
    }
  }

  if (methodUsesProduction(input.method)) {
    if (!finite(input.estimatedLifetimeUnits)) {
      errors.estimatedLifetimeUnits = 'Enter estimated total lifetime production';
    } else if (input.estimatedLifetimeUnits <= 0) {
      errors.estimatedLifetimeUnits = 'Estimated lifetime production must be greater than zero';
    }

    if (!finite(input.unitsProduced)) {
      errors.unitsProduced = 'Enter cumulative units produced';
    } else if (input.unitsProduced < 0) {
      errors.unitsProduced = 'Units produced cannot be negative';
    } else if (
      finite(input.estimatedLifetimeUnits) &&
      input.estimatedLifetimeUnits > 0 &&
      input.unitsProduced > input.estimatedLifetimeUnits
    ) {
      errors.unitsProduced = 'Units produced cannot exceed estimated lifetime production';
    }
  }

  if (Object.keys(errors).length > 0) return { isValid: false, errors };

  const result = calculateAccumulatedDepreciation(input);
  if (!result.defined) {
    errors.form = result.explanation ?? 'This calculation is undefined.';
    return { isValid: false, errors };
  }

  return { isValid: true, errors };
}

export function parseOptionalNumber(raw: string): number {
  const text = raw.trim().replace(/,/g, '');
  if (text === '') return Number.NaN;
  return Number(text);
}
