import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PRESENT_VALUE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-present-value', label: 'What Is Present Value?' },
  { id: 'present-value-formula', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'present-value-faq', label: 'Frequently Asked Questions' },
];

export const PRESENT_VALUE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is present value?',
    answer:
      'Present value is the current worth of a future amount, discounted at a given interest rate over a number of periods.',
  },
  {
    question: 'How is present value calculated?',
    answer:
      'PV = FV ÷ (1 + r)^n, where r is the interest rate per period as a decimal and n is the number of periods.',
  },
  {
    question: 'How is total interest calculated?',
    answer: 'Total interest = Future value − Present value.',
  },
  {
    question: 'Does the interest rate have to be annual?',
    answer:
      'No. Use a rate that matches the period frequency. For monthly periods, enter a monthly rate; for annual periods, enter an annual rate.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the currency label and grouping. Enter money fields already in the selected currency.',
  },
];
