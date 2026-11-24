import { calculateDietRiskScore } from './calculation';
import type {
  DietRiskScoreFieldErrors,
  DietRiskScoreInput,
  DietRiskScoreResult,
} from './types';

export interface DietRiskScoreValidation {
  isValid: boolean;
  errors: DietRiskScoreFieldErrors;
  result: DietRiskScoreResult | null;
}

export function validateDietRiskScoreInput(
  input: DietRiskScoreInput,
): DietRiskScoreValidation {
  const result = calculateDietRiskScore(input);
  const errors: DietRiskScoreFieldErrors = {};
  if (!result.complete) {
    errors.form = 'Answer every food-frequency question.';
  }
  return {
    isValid: result.complete,
    errors,
    result,
  };
}