import { calculateEffectiveInterestRate } from './calculation';
import {
  COMPOUNDING_OPTIONS,
  type CompoundingFrequency,
  type EffectiveInterestRateFieldErrors,
  type EffectiveInterestRateInput,
  type EffectiveInterestRateResult,
} from './types';

function parseNumber(val: string): number | null {
  const trimmed = val.trim().replace(/,/g, '');
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

export function validateEffectiveInterestRateInput(input: EffectiveInterestRateInput): {
  isValid: boolean;
  errors: EffectiveInterestRateFieldErrors;
  result: EffectiveInterestRateResult | null;
} {
  const errors: EffectiveInterestRateFieldErrors = {};
  const rate = parseNumber(input.annualInterestRate);

  if (rate === null) {
    return { isValid: false, errors, result: null };
  }
  if (Number.isNaN(rate)) {
    errors.annualInterestRate = 'Enter a valid annual interest rate';
  }

  const freqOk = COMPOUNDING_OPTIONS.some((o) => o.value === input.compounding);
  if (!freqOk) {
    errors.compounding = 'Select a valid compounding frequency';
  }

  const isValid = Object.keys(errors).length === 0;
  if (!isValid) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateEffectiveInterestRate({
    annualInterestRatePercent: rate as number,
    compounding: input.compounding as CompoundingFrequency,
  });

  return { isValid: result !== null, errors, result };
}
