import { calculateQuizResult } from './calculation';
import type {
  QuizAnnualIncomeInput,
  QuizAnnualIncomeResult,
} from './types';

export interface QuizAnnualIncomeValidation {
  isValid: boolean;
  result: QuizAnnualIncomeResult;
}

/** Quiz scoring always produces a result; incomplete quizzes hide the numeric score. */
export function validateQuizAnnualIncomeInput(
  input: QuizAnnualIncomeInput
): QuizAnnualIncomeValidation {
  const result = calculateQuizResult(input);
  return {
    isValid: result.complete,
    result,
  };
}
