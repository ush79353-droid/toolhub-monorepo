import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MOVING_AVERAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-moving-average', label: 'What Is a Moving Average?' },
  { id: 'moving-average-formula', label: 'Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'moving-average-faq', label: 'Frequently Asked Questions' },
];

export const MOVING_AVERAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a simple moving average (SMA)?',
    answer:
      'A simple moving average is the arithmetic mean of the latest N prices in a series. It smooths short-term fluctuations.',
  },
  {
    question: 'How is the moving average calculated?',
    answer:
      'SMA = sum of the latest N prices ÷ N. Example: prices 100, 120, 140 with length 3 → (100 + 120 + 140) ÷ 3 = 120.',
  },
  {
    question: 'What happens when I enter more prices than the length?',
    answer:
      'Only the latest N prices are used. Example: prices 100, 120, 140, 160 with length 3 → (120 + 140 + 160) ÷ 3 = 140.',
  },
  {
    question: 'Can prices be zero?',
    answer: 'Yes. Zero is allowed. Negative prices are rejected.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the currency label and grouping. Enter all prices already in the selected currency.',
  },
];
