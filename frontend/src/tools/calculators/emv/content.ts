import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EMV_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-emv', label: 'What EMV Means' },
  { id: 'emv-formulas', label: 'Formulas' },
  { id: 'emv-sign', label: 'Loss vs Gain' },
  { id: 'emv-example', label: 'Example' },
  { id: 'emv-faq', label: 'Frequently Asked Questions' },
];

export const EMV_FAQS: readonly FAQItem[] = [
  {
    question: 'What is expected monetary value (EMV)?',
    answer:
      'EMV is the probability-weighted impact of one or more risks: each risk contributes impact × (probability ÷ 100), and total EMV sums those contributions.',
  },
  {
    question: 'Does a positive EMV mean profit?',
    answer:
      'In this calculator, a positive impact is treated as expected loss (threat exposure). Enter a negative impact for an opportunity so a negative EMV reads as expected gain.',
  },
  {
    question: 'What probability range is allowed?',
    answer: 'Each probability must be between 0% and 100%, inclusive.',
  },
  {
    question: 'Does changing currency convert my numbers?',
    answer:
      'No. The selector only changes the currency label and formatting. Amounts stay in the denomination you entered.',
  },
];
