/**
 * Quiz Harris–Benedict — educational scoring (ADR-018).
 *
 * Reuses BEE/HB shared helpers for answer-key verification only:
 * - `ACTIVITY_FACTORS.light_sedentary` (1.2) for Q5 sedentary band
 * - `revisedHarrisBenedictBeeKcalPerDay` sex-specific equations for Q4
 * Does not re-implement Harris–Benedict coefficients.
 */
import {
  ACTIVITY_FACTORS,
  revisedHarrisBenedictBeeKcalPerDay,
} from '../bee-calculator/calculation';
import { QUIZ_MAX_SCORE, QUIZ_QUESTIONS } from './questions';
import type {
  QuizAnswerId,
  QuizAnswers,
  QuizHarrisBenedictInput,
  QuizHarrisBenedictResult,
  QuizQuestionId,
} from './types';

/** Shared BEE light-sedentary multiplier — quiz Q5 key. */
export const SEDENTARY_ACTIVITY_FACTOR = ACTIVITY_FACTORS.light_sedentary;

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
  input: QuizHarrisBenedictInput,
): QuizHarrisBenedictResult {
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

/**
 * Teaching check: male vs female revised HB BEE differ for identical
 * anthropometrics (quiz Q4 — sex-specific equations).
 */
export function sexSpecificBeeDiffer(
  ageYears: number,
  heightCm: number,
  weightKg: number,
): boolean {
  const male = revisedHarrisBenedictBeeKcalPerDay(
    'male',
    ageYears,
    heightCm,
    weightKg,
  );
  const female = revisedHarrisBenedictBeeKcalPerDay(
    'female',
    ageYears,
    heightCm,
    weightKg,
  );
  return male !== female;
}
