import { QUIZ_MAX_SCORE } from './questions';
import type { QuizDividendInput, QuizDividendResult } from './types';

/** UI shell stub — scoring lands in the engine commit. */
export function calculateQuizResult(
  _input: QuizDividendInput
): QuizDividendResult {
  return {
    complete: false,
    score: null,
    maxScore: QUIZ_MAX_SCORE,
    percent: null,
    formattedScore: `/${QUIZ_MAX_SCORE}`,
    formattedPercent: '',
  };
}

export function shouldRevealAnswers(_input: QuizDividendInput): boolean {
  return false;
}

export function isQuestionCorrect(
  _input: QuizDividendInput,
  _questionId: QuizDividendInput['answers'] extends infer _A ? keyof QuizDividendInput['answers'] : never
): boolean {
  return false;
}
