import { calculateLightsCriteria, parseNumber } from './calculation';
import type {
  LightsCriteriaFieldErrors,
  LightsCriteriaInput,
  LightsCriteriaResult,
} from './types';

export interface LightsCriteriaValidation {
  isValid: boolean;
  errors: LightsCriteriaFieldErrors;
  result: LightsCriteriaResult;
}

function fieldError(
  raw: string,
  label: string,
): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `${label} must be a finite number.`;
  if (n < 0) return `${label} cannot be negative.`;
  return undefined;
}

export function validateLightsCriteriaInput(
  input: LightsCriteriaInput,
): LightsCriteriaValidation {
  const errors: LightsCriteriaFieldErrors = {};
  const e1 = fieldError(input.pleuralProteinText, 'Pleural fluid protein');
  const e2 = fieldError(input.serumProteinText, 'Serum protein');
  const e3 = fieldError(input.pleuralLdhText, 'Pleural fluid LDH');
  const e4 = fieldError(input.serumLdhText, 'Serum LDH');
  const e5 = fieldError(input.ldhUpperLimitText, 'LDH upper limit');
  if (e1) errors.pleuralProteinText = e1;
  if (e2) errors.serumProteinText = e2;
  if (e3) errors.pleuralLdhText = e3;
  if (e4) errors.serumLdhText = e4;
  if (e5) errors.ldhUpperLimitText = e5;

  const result = calculateLightsCriteria(input);
  const hasFieldErrors = Boolean(
    errors.pleuralProteinText ||
      errors.serumProteinText ||
      errors.pleuralLdhText ||
      errors.serumLdhText ||
      errors.ldhUpperLimitText,
  );

  // Incomplete blanks are allowed (partial Light's assessment). Invalid numbers block.
  return {
    isValid: !hasFieldErrors && result.classification !== 'invalid',
    errors,
    result,
  };
}
