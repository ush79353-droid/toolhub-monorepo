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
  explanation: string;
  /** Screenshot-verified vs original educational items (prompt §). */
  provenance: 'screenshot' | 'original_new';
}

export type QuizAnswers = {
  q1: QuizAnswerId | null;
  q2: QuizAnswerId | null;
  q3: QuizAnswerId | null;
  q4: QuizAnswerId | null;
  q5: QuizAnswerId | null;
  q6: QuizAnswerId | null;
  q7: QuizAnswerId | null;
  q8: QuizAnswerId | null;
};

export interface QuizFfmiInput {
  answers: QuizAnswers;
}

export interface QuizFfmiResult {
  complete: boolean;
  score: number | null;
  maxScore: number;
  formattedScore: string;
  /** Highest question index unlocked (1-based); next after last answered. */
  unlockedThrough: number;
}

export function createDefaultInput(): QuizFfmiInput {
  return {
    answers: {
      q1: null,
      q2: null,
      q3: null,
      q4: null,
      q5: null,
      q6: null,
      q7: null,
      q8: null,
    },
  };
}

export function createEmptyInput(): QuizFfmiInput {
  return createDefaultInput();
}

export function hasQuizChanges(input: QuizFfmiInput): boolean {
  const { answers } = input;
  return (
    answers.q1 !== null ||
    answers.q2 !== null ||
    answers.q3 !== null ||
    answers.q4 !== null ||
    answers.q5 !== null ||
    answers.q6 !== null ||
    answers.q7 !== null ||
    answers.q8 !== null
  );
}
