import type { SellThroughRateFieldErrors, SellThroughRateInput } from './types';

export function validateSellThroughRateInput(input: SellThroughRateInput): {
  isValid: boolean;
  errors: SellThroughRateFieldErrors;
  parsedValues: { unitsSold: number; unitsReceived: number } | null;
} {
  const errors: SellThroughRateFieldErrors = {};

  const parseField = (val: string): number | null => {
    const trimmed = val.trim();
    if (!trimmed) return null;
    const num = Number(trimmed);
    return Number.isFinite(num) ? num : Number.NaN;
  };

  const unitsSold = parseField(input.unitsSold);
  const unitsReceived = parseField(input.unitsReceived);

  if (unitsSold === null || unitsReceived === null) {
    return { isValid: false, errors, parsedValues: null };
  }

  if (Number.isNaN(unitsSold) || unitsSold < 0) {
    errors.unitsSold = 'Enter a valid non-negative number of units sold';
  }

  if (Number.isNaN(unitsReceived) || unitsReceived < 0) {
    errors.unitsReceived = 'Enter a valid non-negative number of units received';
  } else if (unitsReceived === 0) {
    errors.unitsReceived = 'Number of units received must be greater than zero';
  }

  if (Object.keys(errors).length === 0 && unitsSold > unitsReceived) {
    errors.unitsSold = 'Units sold cannot exceed units received';
  }

  const isValid = Object.keys(errors).length === 0;
  return {
    isValid,
    errors,
    parsedValues: isValid ? { unitsSold, unitsReceived } : null,
  };
}
