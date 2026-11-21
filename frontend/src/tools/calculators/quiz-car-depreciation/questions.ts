import type { QuizQuestion } from './types';

/**
 * Screenshot-first “Quiz: The Downward Drive” questions.
 * Options and copy match the reference UI. Percent/year figures are
 * illustrative model assumptions, not universal guarantees.
 */
export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: 'q1',
    number: 1,
    prompt:
      'How much of its initial market value does a car lose the very minute you drive it away from the dealership?',
    options: [
      { id: 'A', label: '1%' },
      { id: 'B', label: '5%' },
      { id: 'C', label: '9%' },
    ],
    correctAnswer: 'C',
    explanation:
      'A common illustrative rule of thumb is an immediate ~9% drop once a new car becomes a used car. Exact first-day loss varies by brand, demand, and market—this quiz uses 9% as the model assumption among the given choices.',
  },
  {
    id: 'q2',
    number: 2,
    prompt:
      "After how many years does a car's value typically drop to approximately 40% (nearly half) of what you paid?",
    options: [
      { id: 'A', label: '4 years' },
      { id: 'B', label: '5 years' },
      { id: 'C', label: '6 years' },
    ],
    correctAnswer: 'B',
    explanation:
      'Under the same simplified teaching model used later in this quiz, residual value is about 40% of purchase price after 5 years. Real schedules differ by vehicle and region.',
  },
  {
    id: 'q3',
    number: 3,
    prompt:
      'True or False: Selling your car to a car dealer usually gets you a higher price than selling it to an individual buyer.',
    options: [
      { id: 'A', label: 'True' },
      { id: 'B', label: 'False' },
    ],
    correctAnswer: 'B',
    explanation:
      'False. Dealers typically pay wholesale/trade-in prices so they can resell at a margin. A private sale to an individual buyer usually nets more, though it takes more effort and risk.',
  },
  {
    id: 'q4',
    number: 4,
    prompt:
      'What is considered the most significant component of the true yearly cost of car ownership?',
    options: [
      { id: 'A', label: 'Fuel costs' },
      { id: 'B', label: 'Maintenance' },
      { id: 'C', label: 'Depreciation' },
    ],
    correctAnswer: 'C',
    explanation:
      'Depreciation—the loss of market value over time—is usually the largest single piece of total ownership cost for a new or late-model car, often outweighing fuel or routine maintenance.',
  },
  {
    id: 'q5',
    number: 5,
    prompt:
      'If you buy a car for $30,000, roughly how much will it be worth after 5 years according to the standard model?',
    options: [
      { id: 'A', label: '$12,000 (40%)' },
      { id: 'B', label: '$18,000 (60%)' },
      { id: 'C', label: '$9,000 (30%)' },
    ],
    correctAnswer: 'A',
    explanation:
      'Using the quiz’s 5-year ≈ 40% residual assumption: $30,000 × 0.40 = $12,000. This is an illustrative fixed-USD example, not a guarantee for every vehicle.',
  },
] as const;

export const QUIZ_MAX_SCORE = QUIZ_QUESTIONS.length;

/** Optional sibling for learners who want the numeric depreciation tool. */
export const CAR_DEPRECIATION_CALCULATOR_HREF =
  '/tools/car-depreciation-calculator';
