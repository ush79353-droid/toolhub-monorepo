import { calculateQuizResult } from './calculation';
import type {
  QuizCarDepreciationInput,
  QuizCarDepreciationResult,
} from './types';

export interface QuizCarDepreciationValidation {
  isValid: boolean;
  result: QuizCarDepreciationResult;
}

/** Quiz scoring always produces a result; incomplete quizzes hide the numeric score. */
export function validateQuizCarDepreciationInput(
  input: QuizCarDepreciationInput
): QuizCarDepreciationValidation {
  const result = calculateQuizResult(input);
  return {
    isValid: result.complete,
    result,
  };
}
