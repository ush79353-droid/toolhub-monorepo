import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CPA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-cpa', label: 'What CPA Means' },
  { id: 'cpa-formulas', label: 'Formulas' },
  { id: 'cpa-example', label: 'Example' },
  { id: 'cpa-faq', label: 'Frequently Asked Questions' },
];

export const CPA_FAQS: readonly FAQItem[] = [
  {
    question: 'What is cost per acquisition (CPA)?',
    answer:
      'CPA is how much you spend in ads for each attributed conversion: total ad spend divided by total attributed conversions.',
  },
  {
    question: 'How is total ad spend calculated?',
    answer: 'Total ad spend = number of clicks × average cost per click (CPC).',
  },
  {
    question: 'Can conversions be zero?',
    answer:
      'No. CPA needs a positive conversion count so the calculator never divides by zero.',
  },
  {
    question: 'Does changing currency convert my numbers?',
    answer:
      'No. The selector only changes the currency label and formatting. Amounts stay in the denomination you entered.',
  },
];
