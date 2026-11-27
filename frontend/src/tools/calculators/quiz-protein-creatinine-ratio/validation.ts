import { calculateQuizResult } from './calculation';
import type {
  QuizProteinCreatinineRatioInput,
  QuizProteinCreatinineRatioResult,
} from './types';

export interface QuizProteinCreatinineRatioValidation {
  isValid: boolean;
  result: QuizProteinCreatinineRatioResult;
}

/** Score unlocks only when all five answers are present. */
export function validateQuizProteinCreatinineRatioInput(
  input: QuizProteinCreatinineRatioInput,
): QuizProteinCreatinineRatioValidation {
  const result = calculateQuizResult(input);
  return {
    isValid: result.complete,
    result,
  };
}
