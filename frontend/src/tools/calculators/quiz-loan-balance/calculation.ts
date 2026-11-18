import { QUIZ_MAX_SCORE, QUIZ_QUESTIONS } from './questions';
import type {
  QuizAnswerId,
  QuizAnswers,
  QuizLoanBalanceInput,
  QuizLoanBalanceResult,
  QuizQuestionId,
} from './types';

export function isQuizComplete(answers: QuizAnswers): boolean {
  return QUIZ_QUESTIONS.every((question) => answers[question.id] !== null);
}

export function scoreQuizAnswers(answers: QuizAnswers): number {
  let score = 0;
  for (const question of QUIZ_QUESTIONS) {
    if (answers[question.id] === question.correctAnswer) {
      score += 1;
    }
  }
  return score;
}

export function calculateQuizResult(
  input: QuizLoanBalanceInput
): QuizLoanBalanceResult {
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

export function shouldRevealAnswers(input: QuizLoanBalanceInput): boolean {
  return input.showExplanations && isQuizComplete(input.answers);
}

export function isCorrectAnswer(
  questionId: QuizQuestionId,
  answer: QuizAnswerId | null
): boolean {
  if (answer === null) return false;
  const question = QUIZ_QUESTIONS.find((item) => item.id === questionId);
  return question ? question.correctAnswer === answer : false;
}
