import { calculateQuizResult } from './calculation';
import type { QuizLoanBalanceInput, QuizLoanBalanceResult } from './types';

export interface QuizLoanBalanceValidation {
  isValid: boolean;
  result: QuizLoanBalanceResult;
}

/** Quiz scoring always produces a result; incomplete quizzes simply hide the numeric score. */
export function validateQuizLoanBalanceInput(
  input: QuizLoanBalanceInput
): QuizLoanBalanceValidation {
  const result = calculateQuizResult(input);
  return {
    isValid: result.complete,
    result,
  };
}
