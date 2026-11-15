import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FTE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-fte', label: 'What Is FTE?' },
  { id: 'fte-formula', label: 'Formula' },
  { id: 'fte-example', label: 'Example' },
  { id: 'fte-faq', label: 'Frequently Asked Questions' },
];

export const FTE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is full-time equivalent (FTE)?',
    answer:
      'FTE converts a mix of full-time and part-time staff into a single full-time headcount figure for planning, budgeting, and capacity comparisons.',
  },
  {
    question: 'How are working hours used?',
    answer:
      'Hours are per employee over the same period (hrs/week here). Part-time hours are compared with the full-time standard so both groups stay on one scale.',
  },
  {
    question: 'Can employee counts be zero?',
    answer:
      'Yes. Enter 0 when a group has no staff. Full-time working hours must still be greater than zero so the part-time conversion is defined.',
  },
  {
    question: 'Why must employee counts be whole numbers?',
    answer:
      'Headcount is counted in whole people. Fractional hours are allowed; fractional people are not.',
  },
];
