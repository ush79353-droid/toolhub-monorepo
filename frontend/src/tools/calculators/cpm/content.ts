import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CPM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-cpm', label: 'What CPM Means' },
  { id: 'cpm-formulas', label: 'Formulas' },
  { id: 'cpm-example', label: 'Example' },
  { id: 'cpm-faq', label: 'Frequently Asked Questions' },
];

export const CPM_FAQS: readonly FAQItem[] = [
  {
    question: 'What is CPM?',
    answer:
      'CPM (cost per mille) is the cost of 1,000 impressions: (total campaign cost ÷ impressions) × 1,000.',
  },
  {
    question: 'Do I need all three fields?',
    answer:
      'No. Enter any two of total cost, CPM, and impressions; the calculator fills the blank field and leaves your entries unchanged.',
  },
  {
    question: 'What is Second campaign for?',
    answer:
      'An optional, collapsed comparison section with the same three fields so you can check another campaign’s CPM and cost side by side.',
  },
  {
    question: 'Does changing currency convert my numbers?',
    answer:
      'No. The selector only changes the currency label and formatting. Amounts stay in the denomination you entered.',
  },
];
