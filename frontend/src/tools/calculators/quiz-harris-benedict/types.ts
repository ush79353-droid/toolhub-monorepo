export type QuizAnswerId = 'A' | 'B' | 'C' | 'D';

export type QuizQuestionId =
  | 'q1'
  | 'q2'
  | 'q3'
  | 'q4'
  | 'q5'
  | 'q6'
  | 'q7';

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
  q6: QuizAnswerId | null;
  q7: QuizAnswerId | null;
};

export interface QuizHarrisBenedictInput {
  answers: QuizAnswers;
}

export interface QuizHarrisBenedictResult {
  complete: boolean;
  score: number | null;
  maxScore: number;
  formattedScore: string;
}

export function createDefaultInput(): QuizHarrisBenedictInput {
  return {
    answers: {
      q1: null,
      q2: null,
      q3: null,
      q4: null,
      q5: null,
      q6: null,
      q7: null,
    },
  };
}

export function createEmptyInput(): QuizHarrisBenedictInput {
  return createDefaultInput();
}

export function hasQuizChanges(input: QuizHarrisBenedictInput): boolean {
  const { answers } = input;
  return (
    answers.q1 !== null ||
    answers.q2 !== null ||
    answers.q3 !== null ||
    answers.q4 !== null ||
    answers.q5 !== null ||
    answers.q6 !== null ||
    answers.q7 !== null
  );
}
