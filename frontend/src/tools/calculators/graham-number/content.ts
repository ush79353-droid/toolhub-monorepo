import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GRAHAM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is the Graham Number?' },
  { id: 'benjamin-graham', label: 'Benjamin Graham and Value Investing' },
  { id: 'formula', label: 'Graham Number Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Graham Number' },
  { id: 'examples', label: 'Real-Life Graham Number Examples' },
  { id: 'intrinsic-value', label: 'Graham Number and Intrinsic Value' },
  { id: 'interpret', label: 'How to Interpret Graham Number' },
  { id: 'margin-of-safety', label: 'Graham Number and Margin of Safety' },
  { id: 'vs-market', label: 'Graham Number vs. Market Price' },
  { id: 'limitations', label: 'Limitations of Graham Number' },
  { id: 'when-not', label: 'When the Graham Number Is Not Appropriate' },
  { id: 'gn-faq', label: 'Frequently Asked Questions' },
];

export const GRAHAM_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I calculate the Graham Number?',
    answer:
      'Use GN = √(22.5 × EPS × BVPS) with positive earnings per share and book value per share.',
  },
  {
    question: 'What is a good Graham Number?',
    answer:
      'There is no universal “good” level. Compare it with the current market price and company fundamentals; it is only a screening heuristic.',
  },
  {
    question: 'What does a high Graham Number mean?',
    answer:
      'A higher Graham Number usually reflects higher EPS, higher BVPS, or both under the fixed 22.5 multiplier.',
  },
  {
    question: 'What does a low Graham Number mean?',
    answer:
      'Lower EPS or BVPS reduces the screening price. Low results are not automatic sell signals without further analysis.',
  },
  {
    question: 'Can the Graham Number be negative?',
    answer:
      'The standard positive formula uses a square root and does not produce a meaningful positive valuation when EPS or BVPS is zero or negative.',
  },
  {
    question: 'What is the Graham Number formula?',
    answer: 'GN = √(22.5 × EPS × BVPS), where 22.5 = 15 × 1.5.',
  },
  {
    question: 'What does 22.5 mean in the Graham Number formula?',
    answer:
      'It combines traditional benchmarks of a 15× P/E and a 1.5× P/B (15 × 1.5 = 22.5).',
  },
  {
    question: 'Is the Graham Number the same as intrinsic value?',
    answer:
      'No. It is one simplified valuation heuristic, not a full intrinsic-value model based on cash flows or competitive analysis.',
  },
  {
    question: 'Can I use Graham Number for growth stocks?',
    answer:
      'It is often a poor fit for high-growth or asset-light businesses where book value understates economic value.',
  },
  {
    question: 'Does Graham Number work for all industries?',
    answer:
      'Capital intensity and accounting practices differ. Industry-specific methods may be more appropriate.',
  },
  {
    question: 'Is Graham Number suitable for banks?',
    answer:
      'Financial institutions often need specialized capital and book-value frameworks; treat Graham Number cautiously there.',
  },
  {
    question: 'What is the difference between Graham Number and P/E ratio?',
    answer:
      'P/E uses price and earnings only. Graham Number combines earnings and book value under fixed historical multiples.',
  },
  {
    question: 'How do I know if a stock is undervalued?',
    answer:
      'Trading below the Graham Number is a screen, not proof of undervaluation. Broader fundamental analysis is required.',
  },
  {
    question: 'What happens if EPS is zero?',
    answer:
      'The standard formula is not applicable for a positive Graham Number when EPS is zero or negative.',
  },
  {
    question: 'What happens if book value is negative?',
    answer:
      'Negative BVPS also makes the standard positive Graham Number formula inapplicable.',
  },
];
