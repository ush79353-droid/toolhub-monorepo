import { QUIZ_MAX_SCORE, QUIZ_QUESTIONS } from './questions';
import type {
  QuizAnswers,
  QuizDividendInput,
  QuizDividendResult,
  QuizQuestion,
  QuizQuestionId,
} from './types';

export function parseNumericAnswer(raw: string): number | null {
  const trimmed = raw.trim().replace(/[$,%\s,]/g, '');
  if (!trimmed) return null;
  const value = Number(trimmed);
  if (!Number.isFinite(value)) return null;
  return value;
}

export function isNumericAnswerCorrect(
  raw: string,
  correctValue: number,
  tolerance: number
): boolean {
  const value = parseNumericAnswer(raw);
  if (value === null) return false;
  return Math.abs(value - correctValue) <= tolerance;
}

export function isAnswerProvided(
  question: QuizQuestion,
  answers: QuizAnswers
): boolean {
  if (question.kind === 'choice') {
    return answers[question.id] !== null;
  }
  const raw = question.id === 'q4' ? answers.q4 : answers.q6;
  return parseNumericAnswer(raw) !== null;
}

export function isQuizComplete(answers: QuizAnswers): boolean {
  return QUIZ_QUESTIONS.every((question) => isAnswerProvided(question, answers));
}

export function isQuestionCorrect(
  answers: QuizAnswers,
  questionId: QuizQuestionId
): boolean {
  const question = QUIZ_QUESTIONS.find((item) => item.id === questionId);
  if (!question) return false;

  if (question.kind === 'choice') {
    return answers[question.id] === question.correctAnswer;
  }

  const raw = question.id === 'q4' ? answers.q4 : answers.q6;
  return isNumericAnswerCorrect(raw, question.correctValue, question.tolerance);
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
  input: QuizDividendInput
): QuizDividendResult {
  const complete = isQuizComplete(input.answers);
  if (!complete) {
    return {
      complete: false,
      score: null,
      maxScore: QUIZ_MAX_SCORE,
      percent: null,
      formattedScore: `/${QUIZ_MAX_SCORE}`,
      formattedPercent: '',
    };
  }

  const score = scoreQuizAnswers(input.answers);
  const percent = (score / QUIZ_MAX_SCORE) * 100;
  const percentLabel =
    Number.isInteger(percent) ? `${percent}%` : `${percent.toFixed(1)}%`;

  return {
    complete: true,
    score,
    maxScore: QUIZ_MAX_SCORE,
    percent,
    formattedScore: `${score}/${QUIZ_MAX_SCORE}`,
    formattedPercent: percentLabel,
  };
}

export function shouldRevealAnswers(input: QuizDividendInput): boolean {
  return input.showExplanations && isQuizComplete(input.answers);
}
