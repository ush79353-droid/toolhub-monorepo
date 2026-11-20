import type { QuizQuestion } from './types';

/**
 * Authorized 7-question bank recovered from the Omni Calculator
 * “Quiz: Annual Income Calculator” reference
 * (https://www.omnicalculator.com/finance/annual-income-quiz),
 * which matches the task screenshot for title, intro, Q1, and scoring UI.
 * Correct answers are keyed by option id, not display order.
 */
export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: 'q1',
    number: 1,
    prompt: 'What does annual income mean?',
    options: [
      { id: 'A', label: 'Money earned in one month' },
      { id: 'B', label: 'The amount of money earned in one year' },
      { id: 'C', label: 'The money saved after expenses' },
    ],
    correctAnswer: 'B',
    explanation:
      'Annual income is the amount of money earned over one year — not a single month’s pay, and not savings after expenses.',
  },
  {
    id: 'q2',
    number: 2,
    prompt: 'Which formula is used to calculate annual income?',
    options: [
      {
        id: 'A',
        label: 'annual income = hourly wage × hours per week × days per year',
      },
      {
        id: 'B',
        label: 'annual income = hourly wage × weeks per year',
      },
      {
        id: 'C',
        label:
          'annual income = hourly wage × hours per week × weeks per year',
      },
    ],
    correctAnswer: 'C',
    explanation:
      'Convert an hourly wage by multiplying hours per week and weeks per year. Using days per year or omitting hours per week produces the wrong units.',
  },
  {
    id: 'q3',
    number: 3,
    prompt: 'What is gross annual income?',
    options: [
      { id: 'A', label: 'Income before taxes are deducted' },
      { id: 'B', label: 'Income after taxes are deducted' },
      { id: 'C', label: 'Income after expenses' },
    ],
    correctAnswer: 'A',
    explanation:
      'Gross annual income is income before taxes (and typically before other payroll deductions) are taken out.',
  },
  {
    id: 'q4',
    number: 4,
    prompt: 'What is net annual income?',
    options: [
      { id: 'A', label: 'Income before taxes' },
      { id: 'B', label: 'Income after taxes are deducted' },
      { id: 'C', label: 'Income before insurance payments' },
    ],
    correctAnswer: 'B',
    explanation:
      'Net annual income is what remains after taxes are deducted — take-home pay for the year in simplified teaching terms.',
  },
  {
    id: 'q5',
    number: 5,
    prompt:
      'Suzy earns $15 per hour and works 40 hours per week for 52 weeks. What is her annual income?',
    options: [
      { id: 'A', label: '$30,000' },
      { id: 'B', label: '$31,200' },
      { id: 'C', label: '$33,000' },
    ],
    correctAnswer: 'B',
    explanation:
      '15 × 40 × 52 = 31,200. Fixed USD teaching example — not a tax estimate.',
  },
  {
    id: 'q6',
    number: 6,
    prompt:
      'Jeff earns $500 per week and works 50 weeks per year. What is his annual income?',
    options: [
      { id: 'A', label: '$25,000' },
      { id: 'B', label: '$26,000' },
      { id: 'C', label: '$27,000' },
    ],
    correctAnswer: 'A',
    explanation:
      '500 × 50 = 25,000. Use the stated paid weeks (50), not an assumed 52.',
  },
  {
    id: 'q7',
    number: 7,
    prompt:
      'If someone takes unpaid leave during the year, how does it affect their annual income?',
    options: [
      { id: 'A', label: 'Annual income decreases' },
      { id: 'B', label: 'Annual income increases' },
      { id: 'C', label: 'Annual income stays the same' },
    ],
    correctAnswer: 'A',
    explanation:
      'Unpaid leave removes paid weeks or hours, so annual income decreases under the usual hourly/weekly model.',
  },
] as const;

export const QUIZ_MAX_SCORE = QUIZ_QUESTIONS.length;

export const ANNUAL_INCOME_CALCULATOR_HREF = '/tools/annual-income-calculator';
