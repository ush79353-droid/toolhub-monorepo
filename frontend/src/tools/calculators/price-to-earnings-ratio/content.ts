import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is the Price to Earnings Ratio?' },
  { id: 'formula', label: 'Price/Earnings Ratio Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate the P/E Ratio' },
  { id: 'interpreting', label: 'Interpreting P/E Ratio Results' },
  { id: 'trailing-vs-forward', label: 'Trailing P/E vs. Forward P/E' },
  { id: 'good-pe', label: 'What Is a Good P/E Ratio?' },
  { id: 'pe-vs-peg', label: 'P/E Ratio vs. PEG Ratio' },
  { id: 'limitations', label: 'Limitations of P/E' },
  { id: 'pe-faq', label: 'Frequently Asked Questions' },
];

export const PE_FAQS: readonly FAQItem[] = [
  {
    question: 'How can I calculate the P/E ratio?',
    answer:
      'Divide the current share price by earnings per share for the chosen period: P/E = price ÷ EPS. Example: price 120 and EPS 10 → P/E = 12.',
  },
  {
    question: 'Can the P/E ratio be negative?',
    answer:
      'A signed quotient can be computed when EPS is negative, but a conventional P/E valuation multiple is not meaningful with losses. This calculator reports N/M instead of presenting a standard multiple.',
  },
  {
    question: 'What does a low P/E ratio indicate?',
    answer:
      'A lower multiple can reflect cheaper valuation relative to current earnings, higher perceived risk, slower expected growth, or temporary earnings strength. It is not automatic undervaluation.',
  },
  {
    question: 'What is the P/E ratio for a stock priced at 120 with EPS of 10?',
    answer: '120 ÷ 10 = 12. Investors are paying 12 currency units per unit of reported EPS.',
  },
  {
    question: 'What does a P/E ratio of 20 mean?',
    answer:
      'Investors are paying about 20 times the company’s reported annual earnings per share at the selected price and EPS inputs.',
  },
  {
    question: 'What is a good P/E ratio?',
    answer:
      'There is no universal ideal. Compare with industry peers, the company’s own history, growth outlook, profitability, risk, interest rates, and accounting methods.',
  },
  {
    question: 'What is the difference between trailing P/E and forward P/E?',
    answer:
      'Trailing P/E uses completed historical earnings (often TTM). Forward P/E uses projected future earnings, which adds forecast uncertainty.',
  },
  {
    question: 'What happens when EPS is zero?',
    answer:
      'P/E is undefined because dividing by zero is not allowed. The calculator shows “Not defined” with an explanation.',
  },
  {
    question: 'What is the difference between P/E and P/B?',
    answer:
      'P/E relates price to earnings. Price-to-book (P/B) relates price to book equity per share. They answer different valuation questions.',
  },
  {
    question: 'How does earnings growth affect P/E?',
    answer:
      'Higher expected growth often supports higher P/E multiples, all else equal. Growth quality and risk still matter; PEG relates P/E to growth more explicitly.',
  },
  {
    question: 'Why can two companies have different P/E ratios?',
    answer:
      'Differences in growth expectations, risk, profitability, capital structure, industry norms, and accounting choices commonly produce different multiples.',
  },
  {
    question: 'Can P/E alone determine whether a stock is undervalued?',
    answer:
      'No. P/E is one screen. Combine it with growth, margins, balance-sheet strength, cash flow, competitive position, and other metrics before drawing valuation conclusions.',
  },
];
