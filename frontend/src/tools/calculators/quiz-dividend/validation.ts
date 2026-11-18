import { calculateQuizResult } from './calculation';
import type { QuizDividendInput, QuizDividendResult } from './types';

export interface QuizDividendValidation {
  isValid: boolean;
  result: QuizDividendResult;
}

/** Quiz scoring always produces a result; incomplete quizzes simply hide the numeric score. */
export function validateQuizDividendInput(
  input: QuizDividendInput
): QuizDividendValidation {
  const result = calculateQuizResult(input);
  return {
    isValid: result.complete,
    result,
  };
}
