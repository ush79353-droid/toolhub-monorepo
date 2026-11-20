import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PEG_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is PEG Ratio?' },
  { id: 'how-to-calculate', label: 'How Do We Calculate the PEG Ratio?' },
  { id: 'good-peg', label: 'What Is a Good PEG Ratio?' },
  { id: 'retention-roe', label: 'Retention Rate and Return on Equity' },
  { id: 'peg-vs-pe', label: 'PEG Ratio vs P/E Ratio' },
  { id: 'caveats', label: 'Things to Pay Attention To' },
  { id: 'peg-faq', label: 'Frequently Asked Questions' },
];

export const PEG_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the PEG ratio?',
    answer:
      'PEG (price/earnings-to-growth) divides a stock’s P/E ratio by an earnings growth rate expressed in percentage points, aiming to relate valuation to expected growth.',
  },
  {
    question: 'How do you calculate the PEG ratio?',
    answer:
      'Compute P/E = price ÷ EPS, estimate growth % (here retention % × ROE % ÷ 100), then PEG = P/E ÷ growth %. Example: P/E 16.13 and growth 4.8% → PEG ≈ 3.36.',
  },
  {
    question: 'What is a good PEG ratio?',
    answer:
      'Rules of thumb sometimes treat PEG below 1 as relatively inexpensive versus growth, near 1 as roughly aligned, and above 1 as richer. These are heuristics, not universal rules.',
  },
  {
    question: 'Is a PEG ratio below 1 good?',
    answer:
      'It can warrant further research, but it does not guarantee undervaluation. Growth quality, risk, industry norms, and accounting choices still matter.',
  },
  {
    question: 'Can the PEG ratio be negative?',
    answer:
      'A negative mathematical result can appear with negative growth or unusual inputs, but conventional PEG comparisons are generally not meaningful in those cases.',
  },
  {
    question: 'What happens when EPS is zero?',
    answer:
      'P/E and PEG are undefined with zero EPS because price cannot be divided by zero in the standard ratio.',
  },
  {
    question: 'What happens when earnings growth is zero?',
    answer:
      'PEG is undefined because dividing by zero growth percentage points is not allowed.',
  },
  {
    question: 'What is the difference between PEG and P/E?',
    answer:
      'P/E compares price with earnings only. PEG adjusts that multiple by an earnings growth rate so faster-growing and slower-growing firms can be compared more carefully.',
  },
  {
    question: 'How is earnings growth estimated?',
    answer:
      'Approaches include historical EPS growth, analyst forecasts, and sustainable-growth models such as retention rate × ROE. This calculator uses the sustainable-growth form.',
  },
  {
    question: 'Can PEG predict future stock performance?',
    answer:
      'No. PEG is a valuation indicator, not a reliable standalone predictor of future returns.',
  },
];
