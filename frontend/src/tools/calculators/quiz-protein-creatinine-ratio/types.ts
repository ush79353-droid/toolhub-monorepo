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
  provenance: 'screenshot';
}

export type QuizAnswers = {
  q1: QuizAnswerId | null;
  q2: QuizAnswerId | null;
  q3: QuizAnswerId | null;
  q4: QuizAnswerId | null;
  q5: QuizAnswerId | null;
};

export interface QuizProteinCreatinineRatioInput {
  answers: QuizAnswers;
}

export interface QuizProteinCreatinineRatioResult {
  complete: boolean;
  score: number | null;
  maxScore: number;
  formattedScore: string;
}

export function createDefaultInput(): QuizProteinCreatinineRatioInput {
  return {
    answers: {
      q1: null,
      q2: null,
      q3: null,
      q4: null,
      q5: null,
    },
  };
}

export function createEmptyInput(): QuizProteinCreatinineRatioInput {
  return createDefaultInput();
}

export function hasQuizChanges(input: QuizProteinCreatinineRatioInput): boolean {
  const { answers } = input;
  return (
    answers.q1 !== null ||
    answers.q2 !== null ||
    answers.q3 !== null ||
    answers.q4 !== null ||
    answers.q5 !== null
  );
}
