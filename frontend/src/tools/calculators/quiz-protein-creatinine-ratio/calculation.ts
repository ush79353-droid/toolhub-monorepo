/**
 * Quiz Protein Creatinine Ratio — educational scoring (ADR-018).
 * All five questions visible; score only when complete.
 */
import { QUIZ_MAX_SCORE, QUIZ_QUESTIONS } from './questions';
import type {
  QuizAnswerId,
  QuizAnswers,
  QuizProteinCreatinineRatioInput,
  QuizProteinCreatinineRatioResult,
  QuizQuestionId,
} from './types';

export function isQuizComplete(answers: QuizAnswers): boolean {
  return QUIZ_QUESTIONS.every((question) => answers[question.id] !== null);
}

export function isQuestionCorrect(
  answers: QuizAnswers,
  questionId: QuizQuestionId,
): boolean {
  const question = QUIZ_QUESTIONS.find((item) => item.id === questionId);
  if (!question) return false;
  return answers[question.id] === question.correctAnswer;
}

export function scoreQuizAnswers(answers: QuizAnswers): number {
  let score = 0;
  for (const question of QUIZ_QUESTIONS) {
    if (isQuestionCorrect(answers, question.id)) {
      score += 1;
    }
  }
  return score;
}

export function calculateQuizResult(
  input: QuizProteinCreatinineRatioInput,
): QuizProteinCreatinineRatioResult {
  const complete = isQuizComplete(input.answers);
  if (!complete) {
    return {
      complete: false,
      score: null,
      maxScore: QUIZ_MAX_SCORE,
      formattedScore: `/${QUIZ_MAX_SCORE}`,
    };
  }

  const score = scoreQuizAnswers(input.answers);
  return {
    complete: true,
    score,
    maxScore: QUIZ_MAX_SCORE,
    formattedScore: `${score}/${QUIZ_MAX_SCORE}`,
  };
}

export function isCorrectAnswer(
  questionId: QuizQuestionId,
  answer: QuizAnswerId | null,
): boolean {
  if (answer === null) return false;
  const question = QUIZ_QUESTIONS.find((item) => item.id === questionId);
  return question ? question.correctAnswer === answer : false;
}
