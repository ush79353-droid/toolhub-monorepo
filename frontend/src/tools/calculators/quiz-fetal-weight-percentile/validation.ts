import { calculateQuizResult } from './calculation';
import type {
  QuizFetalWeightPercentileInput,
  QuizFetalWeightPercentileResult,
} from './types';

export function validateQuizFetalWeightPercentileInput(
  input: QuizFetalWeightPercentileInput,
): {
  isValid: boolean;
  result: QuizFetalWeightPercentileResult;
} {
  const result = calculateQuizResult(input);
  return { isValid: result.complete, result };
}
