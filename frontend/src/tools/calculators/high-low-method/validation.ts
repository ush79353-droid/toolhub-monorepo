import { isSupportedCurrency } from '@/tools/shared/currency';
import { calculateHighLowMethod } from './calculation';
import type {
  HighLowMethodFieldErrors,
  HighLowMethodInput,
  HighLowMethodResult,
} from './types';

function finite(value: number): boolean {
  return Number.isFinite(value);
}

export function validateHighLowMethod(input: HighLowMethodInput): {
  isValid: boolean;
  incomplete: boolean;
  errors: HighLowMethodFieldErrors;
  result: HighLowMethodResult | null;
} {
  const errors: HighLowMethodFieldErrors = {};
  let anyBlank = false;

  if (!isSupportedCurrency(input.currency)) {
    errors.currency = 'Choose a supported currency';
  }

  const fields: { key: keyof HighLowMethodInput; label: string }[] = [
    { key: 'highCost', label: 'High cost' },
    { key: 'highVolume', label: 'High unit volume' },
    { key: 'lowCost', label: 'Low cost' },
    { key: 'lowVolume', label: 'Low unit volume' },
    { key: 'unitsX', label: 'Number of units' },
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
    finite(input.highVolume) &&
    finite(input.lowVolume) &&
    !errors.highVolume &&
    !errors.lowVolume &&
    input.highVolume <= input.lowVolume
  ) {
    errors.highVolume = 'High unit volume must be greater than low unit volume';
  }

  if (anyBlank || Object.keys(errors).length > 0) {
    return {
      isValid: false,
      incomplete: anyBlank && Object.keys(errors).length === 0,
      errors,
      result: null,
    };
  }

  const result = calculateHighLowMethod(input);
  if (!result) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, incomplete: false, errors, result: null };
  }

  return { isValid: true, incomplete: false, errors: {}, result };
}
