import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const YEAR_OVER_YEAR_GROWTH_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-yoy-growth', label: 'What Is Year-over-Year Growth?' },
  { id: 'yoy-growth-formula', label: 'YoY Growth Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'yoy-growth-faq', label: 'Frequently Asked Questions' },
];

export const YEAR_OVER_YEAR_GROWTH_FAQS: readonly FAQItem[] = [
  {
    question: 'What is year-over-year growth?',
    answer:
      'Year-over-year (YoY) growth measures the percent change from an initial-year value to a final-year value over a one-year comparison.',
  },
  {
    question: 'How is YoY growth calculated?',
    answer:
      'YoY Growth (%) = ((Final Year Value − Initial Year Value) ÷ Initial Year Value) × 100.',
  },
  {
    question: 'How does the optional CAGR section work?',
    answer:
      'CAGR uses the same initial and final values with a number of years: ((Final ÷ Initial)^(1 ÷ years) − 1) × 100, via the existing CAGR engine.',
  },
  {
    question: 'Can growth be negative or zero?',
    answer:
      'Yes. Declines produce a negative percent; unchanged values produce 0%. Initial value must be greater than zero.',
  },
];
