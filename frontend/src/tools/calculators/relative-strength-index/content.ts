import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RSI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is the Relative Strength Index?' },
  { id: 'interpret', label: 'How Do You Interpret RSI?' },
  { id: 'formula', label: 'What Is the RSI Formula?' },
  { id: 'step-by-step', label: 'How to Calculate RSI Step by Step' },
  { id: 'wilder', label: "Wilder's RSI Smoothing" },
  { id: 'divergence', label: 'RSI Divergence' },
  { id: 'markets', label: 'RSI in Trending and Ranging Markets' },
  { id: 'limitations', label: 'Limitations of RSI' },
  { id: 'how-to-use', label: 'How to Use the RSI Calculator' },
  { id: 'rsi-faq', label: 'Frequently Asked Questions' },
];

export const RSI_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the Relative Strength Index?',
    answer:
      'RSI is a momentum oscillator developed by J. Welles Wilder Jr. It compares recent average gains with recent average losses and scales the result from 0 to 100. It is not a comparison of one security versus another.',
  },
  {
    question: 'Is RSI above 70 good or bad?',
    answer:
      'Readings above 70 are commonly labeled overbought, meaning recent gains have been strong relative to losses. That is a momentum description, not a guaranteed sell signal — strong trends can keep RSI elevated.',
  },
  {
    question: 'Is RSI below 30 good or bad?',
    answer:
      'Readings below 30 are commonly labeled oversold. Recent losses have been relatively strong. That does not guarantee a rebound; downtrends can keep RSI depressed.',
  },
  {
    question: 'How do I calculate RSI?',
    answer:
      'Compute price changes, separate gains and losses, average them over the period (with Wilder smoothing after the first window), form RS = average gain ÷ average loss, then RSI = 100 − 100/(1+RS).',
  },
  {
    question: 'What is a 14-period RSI?',
    answer:
      'A 14-period RSI uses 14 consecutive price changes. You need at least 15 closing prices for the first reading. Fourteen is Wilder’s original default lookback.',
  },
  {
    question: 'How many prices are needed to calculate RSI?',
    answer:
      'For period n you need at least n+1 closing prices. For n = 14 that is 15 prices.',
  },
  {
    question: "What is Wilder's RSI?",
    answer:
      "Wilder's method initializes average gain/loss with a simple average of the first n changes, then updates recursively: Avg_t = (Avg_{t−1}×(n−1) + value_t) / n.",
  },
  {
    question: 'What happens if every closing price is identical?',
    answer:
      'Average gain and loss are both zero, so RS is indeterminate. This calculator uses RSI = 50 as a documented neutral convention.',
  },
  {
    question: 'Can RSI reach 100?',
    answer:
      'Yes, when average loss is zero and average gain is positive (all non-down moves in the relevant window/smoothing state).',
  },
  {
    question: 'Can RSI reach zero?',
    answer:
      'Yes, when average gain is zero and average loss is positive (no up moves in the relevant state).',
  },
  {
    question: 'What is RSI divergence?',
    answer:
      'Divergence occurs when price makes a new extreme but RSI does not confirm it (bullish or bearish). It can hint at momentum shifts but produces false signals and is not a reliable standalone predictor.',
  },
  {
    question: 'Can RSI predict stock prices?',
    answer:
      'No. RSI summarizes recent momentum. It does not forecast future prices with certainty and should be combined with broader analysis.',
  },
];
