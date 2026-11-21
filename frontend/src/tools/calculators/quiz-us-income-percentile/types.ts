export type QuizAnswerId = 'A' | 'B' | 'C' | 'D';

export type QuizQuestionId =
  | 'q1'
  | 'q2'
  | 'q3'
  | 'q4'
  | 'q5'
  | 'q6'
  | 'q7'
  | 'q8';

export interface QuizOption {
  id: QuizAnswerId;
  label: string;
}

export interface QuizQuestion {
  id: QuizQuestionId;
  number: number;
  prompt: string;
  options: readonly QuizOption[];
  correctAnswer: QuizAnswerId;
  /** Soft hint shown before submission (does not reveal the answer). */
  hint: string;
  explanation: string;
}

export type QuizAnswers = Record<QuizQuestionId, QuizAnswerId | null>;

export interface QuizUsIncomePercentileInput {
  answers: QuizAnswers;
  isSubmitted: boolean;
}

export interface QuizAnswerReview {
  questionId: QuizQuestionId;
  number: number;
  prompt: string;
  selectedAnswer: QuizAnswerId | null;
  selectedLabel: string | null;
  correctAnswer: QuizAnswerId;
  correctLabel: string;
  isCorrect: boolean;
  isUnanswered: boolean;
  explanation: string;
}

export interface QuizUsIncomePercentileResult {
  score: number;
  maxScore: number;
  percentage: number;
  formattedScore: string;
  formattedPercent: string;
  resultMessage: string;
  answeredCount: number;
  unansweredCount: number;
  reviews: QuizAnswerReview[];
}

export function createEmptyAnswers(): QuizAnswers {
  return {
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
    q6: null,
    q7: null,
    q8: null,
  };
}

export function createDefaultInput(): QuizUsIncomePercentileInput {
  return {
    answers: createEmptyAnswers(),
    isSubmitted: false,
  };
}

export function hasQuizChanges(input: QuizUsIncomePercentileInput): boolean {
  if (input.isSubmitted) return true;
  return Object.values(input.answers).some((value) => value !== null);
}
