import type { QuizQuestion } from './types';

export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: 'q1',
    number: 1,
    prompt: 'What does the remaining loan balance represent?',
    options: [
      { id: 'A', label: 'The amount you still owe on the loan today' },
      { id: 'B', label: 'The total amount you originally borrowed' },
      { id: 'C', label: 'The total interest you will pay over the loan' },
    ],
    correctAnswer: 'A',
    explanation:
      'The remaining loan balance is the outstanding principal that has not yet been repaid. It is not the original loan amount or the total interest payable over the loan\'s lifetime.',
  },
  {
    id: 'q2',
    number: 2,
    prompt: 'Which factors are required to calculate a remaining loan balance?',
    options: [
      { id: 'A', label: 'Credit score and income' },
      {
        id: 'B',
        label: 'Loan amount, interest rate, loan term, and time elapsed',
      },
      { id: 'C', label: 'Monthly expenses only' },
    ],
    correctAnswer: 'B',
    explanation:
      'For a standard fixed-rate amortizing loan, the original principal, interest rate, repayment term, and elapsed repayment period determine the remaining balance, assuming scheduled payments are made as agreed.',
  },
  {
    id: 'q3',
    number: 3,
    prompt:
      'What happens to your remaining loan balance when you make extra payments toward the principal?',
    options: [
      { id: 'A', label: 'It increases due to higher interest' },
      { id: 'B', label: 'The interest rate automatically changes' },
      { id: 'C', label: 'It decreases faster' },
    ],
    correctAnswer: 'C',
    explanation:
      'Extra principal payments reduce the outstanding loan principal more quickly. This may also reduce future interest charges and shorten the payoff period, depending on the loan terms.',
  },
  {
    id: 'q4',
    number: 4,
    prompt:
      'If your annual interest rate is 6%, what is the approximate monthly interest rate?',
    options: [
      { id: 'A', label: '0.06%' },
      { id: 'B', label: '0.5%' },
      { id: 'C', label: '1.2%' },
    ],
    correctAnswer: 'B',
    explanation:
      'For a nominal annual interest rate with monthly periods: Monthly Rate = Annual Rate / 12. 6% / 12 = 0.5%. This is the monthly periodic rate under the standard nominal annual rate convention.',
  },
  {
    id: 'q5',
    number: 5,
    prompt: 'Which of the following can increase your total loan balance over time?',
    options: [
      { id: 'A', label: 'Accrued interest and late fees' },
      { id: 'B', label: 'Shortening the loan term' },
      { id: 'C', label: 'Paying extra toward the principal' },
    ],
    correctAnswer: 'A',
    explanation:
      'Unpaid accrued interest and applicable late fees can increase the total amount owed, depending on loan terms. Extra principal payments generally reduce the outstanding principal.',
  },
] as const;

export const QUIZ_MAX_SCORE = QUIZ_QUESTIONS.length;

export const INTEREST_RATE_CALCULATOR_HREF = '/tools/interest-rate-calculator';
