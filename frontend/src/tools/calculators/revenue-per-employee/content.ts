import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RPE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-rpe', label: 'What Is Revenue Per Employee?' },
  { id: 'rpe-formula', label: 'Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'rpe-faq', label: 'Frequently Asked Questions' },
];

export const RPE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is revenue per employee?',
    answer:
      'Revenue per employee divides total revenue by headcount. It is a simple productivity ratio used to compare companies or periods.',
  },
  {
    question: 'How is it calculated?',
    answer:
      'Revenue Per Employee = total revenue ÷ number of employees. Example: PKR 5,000,000 ÷ 25 = PKR 200,000.',
  },
  {
    question: 'Can revenue be zero?',
    answer: 'Yes. If revenue is zero and employee count is positive, revenue per employee is zero.',
  },
  {
    question: 'Why must employee count be a whole number greater than zero?',
    answer:
      'Headcount is counted in whole people, and dividing by zero would make the ratio undefined.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the currency label and grouping. Enter revenue already in the selected currency.',
  },
];
