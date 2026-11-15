import { calculateJensensAlpha } from './calculation';
import type {
  JensensAlphaFieldErrors,
  JensensAlphaInput,
  JensensAlphaResult,
} from './types';

function parseField(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function validateJensensAlphaInput(input: JensensAlphaInput): {
  isValid: boolean;
  errors: JensensAlphaFieldErrors;
  result: JensensAlphaResult | null;
} {
  const errors: JensensAlphaFieldErrors = {};

  const beginningValue = parseField(input.beginningValue);
  const endingValue = parseField(input.endingValue);
  const riskFreeRate = parseField(input.riskFreeRate);
  const beta = parseField(input.beta);
  const marketReturn = parseField(input.marketReturn);

  if (
    beginningValue === null ||
    endingValue === null ||
    riskFreeRate === null ||
    beta === null ||
    marketReturn === null
  ) {
    return { isValid: false, errors, result: null };
  }

  if (Number.isNaN(beginningValue) || beginningValue < 0) {
    errors.beginningValue = 'Enter a valid beginning value (≥ 0).';
  } else if (beginningValue === 0) {
    errors.beginningValue = 'Beginning portfolio value must be greater than zero.';
  }

  if (Number.isNaN(endingValue)) {
    errors.endingValue = 'Enter a valid ending portfolio value.';
  }

  if (Number.isNaN(riskFreeRate)) {
    errors.riskFreeRate = 'Enter a valid risk-free rate.';
  }

  if (Number.isNaN(beta)) {
    errors.beta = 'Enter a valid portfolio beta.';
  }

  if (Number.isNaN(marketReturn)) {
    errors.marketReturn = 'Enter a valid market rate of return.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateJensensAlpha({
    beginningValue,
    endingValue,
    riskFreeRatePercent: riskFreeRate,
    beta,
    marketReturnPercent: marketReturn,
  });

  if (!result) {
    errors.form = "Unable to calculate Jensen's alpha for these inputs.";
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
