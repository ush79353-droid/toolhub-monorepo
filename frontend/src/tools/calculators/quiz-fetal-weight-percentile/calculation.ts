import { QUIZ_MAX_SCORE, QUIZ_QUESTIONS } from './questions';
import type {
  QuizAnswers,
  QuizFetalWeightPercentileInput,
  QuizFetalWeightPercentileResult,
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
  input: QuizFetalWeightPercentileInput,
): QuizFetalWeightPercentileResult {
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
