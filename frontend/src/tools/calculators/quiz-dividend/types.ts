export type QuizAnswerId = 'A' | 'B' | 'C';

export type QuizQuestionId = 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6';

export type QuizQuestionKind = 'choice' | 'percent' | 'money';

export interface QuizOption {
  id: QuizAnswerId;
  label: string;
}

interface QuizQuestionBase {
  id: QuizQuestionId;
  number: number;
  prompt: string;
  explanation: string;
}

export interface ChoiceQuizQuestion extends QuizQuestionBase {
  kind: 'choice';
  options: readonly QuizOption[];
  correctAnswer: QuizAnswerId;
}

export interface NumericQuizQuestion extends QuizQuestionBase {
  kind: 'percent' | 'money';
  correctValue: number;
  tolerance: number;
  correctLabel: string;
}

export type QuizQuestion = ChoiceQuizQuestion | NumericQuizQuestion;

export type QuizAnswers = {
  q1: QuizAnswerId | null;
  q2: QuizAnswerId | null;
  q3: QuizAnswerId | null;
  q4: string;
  q5: QuizAnswerId | null;
  q6: string;
};

export interface QuizDividendInput {
  answers: QuizAnswers;
  showExplanations: boolean;
}

export interface QuizDividendResult {
  complete: boolean;
  score: number | null;
  maxScore: number;
  percent: number | null;
  formattedScore: string;
  formattedPercent: string;
}

export function createDefaultInput(): QuizDividendInput {
  return {
    answers: {
      q1: null,
      q2: null,
      q3: null,
      q4: '',
      q5: null,
      q6: '',
    },
    showExplanations: false,
  };
}

export function hasQuizChanges(input: QuizDividendInput): boolean {
  const { answers, showExplanations } = input;
  return (
    showExplanations ||
    answers.q1 !== null ||
    answers.q2 !== null ||
    answers.q3 !== null ||
    answers.q4.trim() !== '' ||
    answers.q5 !== null ||
    answers.q6.trim() !== ''
  );
}
