import { calculateTreynorRatio } from './calculation';
import type {
  TreynorRatioFieldErrors,
  TreynorRatioInput,
  TreynorRatioResult,
} from './types';

function parseField(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function validateTreynorRatioInput(input: TreynorRatioInput): {
  isValid: boolean;
  errors: TreynorRatioFieldErrors;
  result: TreynorRatioResult | null;
} {
  const errors: TreynorRatioFieldErrors = {};

  const beginningValue = parseField(input.beginningValue);
  const endingValue = parseField(input.endingValue);
  const riskFreeRate = parseField(input.riskFreeRate);
  const beta = parseField(input.beta);

  if (
    beginningValue === null ||
    endingValue === null ||
    riskFreeRate === null ||
    beta === null
  ) {
    return { isValid: false, errors, result: null };
  }

  if (Number.isNaN(beginningValue)) {
    errors.beginningValue = 'Enter a valid beginning portfolio value.';
  } else if (!(beginningValue > 0)) {
    errors.beginningValue = 'Beginning portfolio value must be greater than zero.';
  }

  if (Number.isNaN(endingValue)) {
    errors.endingValue = 'Enter a valid ending portfolio value.';
  } else if (endingValue < 0) {
    errors.endingValue = 'Ending portfolio value cannot be negative.';
  }

  if (Number.isNaN(riskFreeRate)) {
    errors.riskFreeRate = 'Enter a valid risk-free rate.';
  }

  if (Number.isNaN(beta)) {
    errors.beta = 'Enter a valid portfolio beta.';
  } else if (!(beta > 0)) {
    errors.beta = 'Portfolio beta must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateTreynorRatio({
    beginningValue,
    endingValue,
    riskFreeRatePercent: riskFreeRate,
    beta,
  });

  if (!result) {
    errors.form = 'Unable to calculate Treynor ratio for these inputs.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
