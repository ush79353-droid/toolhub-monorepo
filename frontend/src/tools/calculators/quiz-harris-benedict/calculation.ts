/**
 * Quiz Harris–Benedict — UI stub (engine commit wires scoring + BEE/HB reuse).
 */
import { QUIZ_MAX_SCORE } from './questions';
import type {
  QuizHarrisBenedictInput,
  QuizHarrisBenedictResult,
} from './types';

export function calculateQuizResult(
  _input: QuizHarrisBenedictInput,
): QuizHarrisBenedictResult {
  return {
    complete: false,
    score: null,
    maxScore: QUIZ_MAX_SCORE,
    formattedScore: `/${QUIZ_MAX_SCORE}`,
  };
}
