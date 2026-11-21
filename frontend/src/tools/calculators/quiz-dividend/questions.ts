import type { QuizQuestion } from './types';

/** Exact final balance for $1,000 at 10% compounded annually for 10 years. */
export const Q6_CORRECT_BALANCE = 1000 * Math.pow(1.1, 10);

export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: 'q1',
    number: 1,
    kind: 'choice',
    prompt: 'What is a dividend?',
    options: [
      { id: 'A', label: 'A fee paid by investors to a company' },
      { id: 'B', label: 'A payment made by a company to its shareholders' },
      { id: 'C', label: 'The market price of a stock' },
    ],
    correctAnswer: 'B',
    explanation:
      'A dividend is a distribution of company earnings paid to shareholders, usually in cash or additional shares, not a fee investors pay, and not the stock’s market price.',
  },
  {
    id: 'q2',
    number: 2,
    kind: 'choice',
    prompt: 'Why do investors use dividend yield?',
    options: [
      { id: 'A', label: 'To predict future stock prices' },
      { id: 'B', label: 'To calculate total profit in dollars' },
      { id: 'C', label: 'To compare returns between stocks with different prices' },
    ],
    correctAnswer: 'C',
    explanation:
      'Dividend yield expresses the annual dividend as a percent of price, which makes income returns comparable across stocks that trade at different prices.',
  },
  {
    id: 'q3',
    number: 3,
    kind: 'choice',
    prompt: 'What is the correct dividend yield formula?',
    options: [
      { id: 'A', label: 'Annual dividend / stock price * 100' },
      { id: 'B', label: 'Stock price / annual dividend * 100' },
      { id: 'C', label: 'Annual dividend * stock price' },
    ],
    correctAnswer: 'A',
    explanation:
      'Dividend yield (%) = (annual dividend ÷ stock price) × 100. Dividing price by the dividend inverts the ratio; multiplying them does not produce a yield.',
  },
  {
    id: 'q4',
    number: 4,
    kind: 'percent',
    prompt:
      'A stock pays $35 annually and costs $3,500. What is its dividend yield?',
    correctValue: 1,
    tolerance: 0.05,
    correctLabel: '1%',
    explanation:
      'Yield = (35 ÷ 3,500) × 100 = 1%. Enter the percent value (1), not the decimal fraction 0.01.',
  },
  {
    id: 'q5',
    number: 5,
    kind: 'choice',
    prompt: 'What happens when dividends are reinvested?',
    options: [
      { id: 'A', label: 'They are saved as cash and stop growing' },
      {
        id: 'B',
        label: 'They are used to buy more shares, increasing future dividends',
      },
      { id: 'C', label: 'They reduce the original investment value' },
    ],
    correctAnswer: 'B',
    explanation:
      'Reinvested dividends purchase additional shares. Those extra shares can pay more dividends later, which supports compounding over time (ignoring taxes and fees).',
  },
  {
    id: 'q6',
    number: 6,
    kind: 'money',
    prompt:
      'You invest $1,000 with a 10% annual yield compounded once per year for 10 years. What is the final balance?',
    correctValue: Q6_CORRECT_BALANCE,
    tolerance: 1,
    correctLabel: '≈ $2,593.74',
    explanation:
      'With annual compounding and full reinvestment (no taxes or fees): Final = 1,000 × (1.1)^10 ≈ $2,593.74.',
  },
] as const;

export const QUIZ_MAX_SCORE = QUIZ_QUESTIONS.length;

export const DIVIDEND_YIELD_CALCULATOR_HREF = '/tools/dividend-yield-calculator';
