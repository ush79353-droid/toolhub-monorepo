import { calculateQuizResult } from './calculation';
import type {
  QuizHarrisBenedictInput,
  QuizHarrisBenedictResult,
} from './types';

export interface QuizHarrisBenedictValidation {
  isValid: boolean;
  result: QuizHarrisBenedictResult;
}

/** Quiz scoring always produces a result; incomplete quizzes hide the numeric score. */
export function validateQuizHarrisBenedictInput(
  input: QuizHarrisBenedictInput,
): QuizHarrisBenedictValidation {
  const result = calculateQuizResult(input);
  return {
    isValid: result.complete,
    result,
  };
}
