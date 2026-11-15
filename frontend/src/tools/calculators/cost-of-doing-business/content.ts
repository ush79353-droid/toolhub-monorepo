import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const COST_OF_DOING_BUSINESS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-codb', label: 'What Cost of Doing Business Means' },
  { id: 'codb-formula', label: 'Formula' },
  { id: 'codb-example', label: 'Example' },
  { id: 'codb-faq', label: 'Frequently Asked Questions' },
];

export const COST_OF_DOING_BUSINESS_FAQS: readonly FAQItem[] = [
  {
    question: 'What is cost of doing business?',
    answer:
      'Here it means cost per billable day: total annual cost divided by the number of billable days in the year.',
  },
  {
    question: 'What counts as billable days?',
    answer:
      'Days you can charge clients or produce billable work—typically after weekends, holidays, and planned non-billable time.',
  },
  {
    question: 'Can billable days be zero?',
    answer: 'No. Division by zero is blocked; enter a positive day count.',
  },
  {
    question: 'Does changing currency convert my numbers?',
    answer:
      'No. The selector only changes the currency label and formatting. Amounts stay in the denomination you entered.',
  },
];
