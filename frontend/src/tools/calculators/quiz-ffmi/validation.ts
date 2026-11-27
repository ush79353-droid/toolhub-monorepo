import { calculateQuizResult } from './calculation';
import type { QuizFfmiInput, QuizFfmiResult } from './types';

export interface QuizFfmiValidation {
  isValid: boolean;
  result: QuizFfmiResult;
}

/** Score unlocks only when all eight answers are present. */
export function validateQuizFfmiInput(input: QuizFfmiInput): QuizFfmiValidation {
  const result = calculateQuizResult(input);
  return {
    isValid: result.complete,
    result,
  };
}
