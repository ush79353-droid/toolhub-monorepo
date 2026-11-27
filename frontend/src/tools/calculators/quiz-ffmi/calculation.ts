/**
 * Quiz FFMI — educational scoring (ADR-018).
 * Sequential unlock: question n unlocks only after n−1 is answered.
 */
import { QUIZ_MAX_SCORE, QUIZ_QUESTIONS } from './questions';
import type {
  QuizAnswerId,
  QuizAnswers,
  QuizFfmiInput,
  QuizFfmiResult,
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

/**
 * 1-based index of the furthest question the learner may see.
 * Q1 always unlocked; each answered question unlocks the next.
 */
export function unlockedThrough(answers: QuizAnswers): number {
  let unlocked = 1;
  for (const question of QUIZ_QUESTIONS) {
    if (answers[question.id] === null) {
      return unlocked;
    }
    unlocked = Math.min(QUIZ_MAX_SCORE, question.number + 1);
  }
  return QUIZ_MAX_SCORE;
}

export function isQuestionUnlocked(
  answers: QuizAnswers,
  questionNumber: number,
): boolean {
  return questionNumber <= unlockedThrough(answers);
}

export function calculateQuizResult(input: QuizFfmiInput): QuizFfmiResult {
  const unlocked = unlockedThrough(input.answers);
  const complete = isQuizComplete(input.answers);
  if (!complete) {
    return {
      complete: false,
      score: null,
      maxScore: QUIZ_MAX_SCORE,
      formattedScore: `/${QUIZ_MAX_SCORE}`,
      unlockedThrough: unlocked,
    };
  }

  const score = scoreQuizAnswers(input.answers);
  return {
    complete: true,
    score,
    maxScore: QUIZ_MAX_SCORE,
    formattedScore: `${score}/${QUIZ_MAX_SCORE}`,
    unlockedThrough: unlocked,
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

/** Teaching check: FFM and FFMI for prompt fixture 80 kg · 25% · 2 m. */
export function fatFreeMassKg(weightKg: number, bodyFatPercent: number): number {
  return weightKg * (1 - bodyFatPercent / 100);
}

export function ffmiKgPerM2(ffmKg: number, heightM: number): number {
  return ffmKg / (heightM * heightM);
}

export function normalizedFfmi(
  ffmi: number,
  heightM: number,
  coefficient = 6.1,
  referenceHeightM = 1.8,
): number {
  return ffmi + coefficient * (referenceHeightM - heightM);
}
