import { calculateQuizResult } from './calculation';
import type {
  QuizUsIncomePercentileInput,
  QuizUsIncomePercentileResult,
} from './types';

export interface QuizUsIncomePercentileValidation {
  isValid: boolean;
  result: QuizUsIncomePercentileResult | null;
}

/** Scoring runs only after submit; unanswered questions count as incorrect (0). */
export function validateQuizUsIncomePercentileInput(
  input: QuizUsIncomePercentileInput,
): QuizUsIncomePercentileValidation {
  const result = calculateQuizResult(input);
  return {
    isValid: result !== null,
    result,
  };
}
