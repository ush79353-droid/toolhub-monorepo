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

export type QuizAnswers = {
  q1: QuizAnswerId | null;
  q2: QuizAnswerId | null;
  q3: QuizAnswerId | null;
  q4: QuizAnswerId | null;
  q5: QuizAnswerId | null;
};

export interface QuizCarDepreciationInput {
  answers: QuizAnswers;
  /** When true, reveal feedback for each answered question as the user goes. */
  showExplanationsAsIGo: boolean;
}

export interface QuizCarDepreciationResult {
  complete: boolean;
  score: number | null;
  maxScore: number;
  formattedScore: string;
}

export function createDefaultInput(): QuizCarDepreciationInput {
  return {
    answers: {
      q1: null,
      q2: null,
      q3: null,
      q4: null,
      q5: null,
    },
    showExplanationsAsIGo: false,
  };
}

export function hasQuizChanges(input: QuizCarDepreciationInput): boolean {
  const { answers, showExplanationsAsIGo } = input;
  return (
    showExplanationsAsIGo ||
    answers.q1 !== null ||
    answers.q2 !== null ||
    answers.q3 !== null ||
    answers.q4 !== null ||
    answers.q5 !== null
  );
}
