export type QuizAnswerId = 'A' | 'B' | 'C';

export type QuizQuestionId = 'q1' | 'q2' | 'q3' | 'q4' | 'q5';

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
  explanation: string;
}

export type QuizAnswers = Record<QuizQuestionId, QuizAnswerId | null>;

export interface QuizLoanBalanceInput {
  answers: QuizAnswers;
  showExplanations: boolean;
}

export interface QuizLoanBalanceResult {
  complete: boolean;
  score: number | null;
  maxScore: number;
  formattedScore: string;
}

export function createDefaultInput(): QuizLoanBalanceInput {
  return {
    answers: {
      q1: null,
      q2: null,
      q3: null,
      q4: null,
      q5: null,
    },
    showExplanations: false,
  };
}

export function hasQuizChanges(input: QuizLoanBalanceInput): boolean {
  return (
    input.showExplanations ||
    Object.values(input.answers).some((answer) => answer !== null)
  );
}
