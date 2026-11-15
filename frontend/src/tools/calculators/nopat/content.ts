import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NOPAT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-nopat', label: 'What Is NOPAT?' },
  { id: 'nopat-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'nopat-faq', label: 'Frequently Asked Questions' },
];

export const NOPAT_FAQS: readonly FAQItem[] = [
  {
    question: 'What is NOPAT?',
    answer:
      'Net operating profit after tax (NOPAT) is operating profit after estimated taxes. It excludes financing effects such as interest, so it reflects core operating performance.',
  },
  {
    question: 'How is the simple NOPAT formula calculated?',
    answer:
      'NOPAT = Operating Profit × (1 − Tax Rate / 100). Example: 500,000 × (1 − 0.30) = 350,000.',
  },
  {
    question: 'When should I use the precise NOPAT formula?',
    answer:
      'Use the precise formula when you have income-statement line items instead of operating profit directly. It reconstructs operating income from net income, non-operating items, interest expense, and tax, then applies the tax rate.',
  },
  {
    question: 'Can operating profit be negative?',
    answer:
      'Yes. A negative operating profit produces a negative NOPAT at the same after-tax rate (unless the tax rate is 100%).',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the currency label and grouping. Enter all money fields already in the selected currency.',
  },
];
