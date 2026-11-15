import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MAN_HOURS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-are-man-hours', label: 'What Are Man-Hours?' },
  { id: 'man-hours-formula', label: 'Formulas' },
  { id: 'man-hours-example', label: 'Example' },
  { id: 'man-hours-faq', label: 'Frequently Asked Questions' },
];

export const MAN_HOURS_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a man-hour?',
    answer:
      'A man-hour is one hour of work by one person. Total man-hours equal people multiplied by hours each person works.',
  },
  {
    question: 'Can people or hours be zero?',
    answer:
      'Yes. Zero people or zero hours per person yields zero man-hours and zero labor cost for that estimate.',
  },
  {
    question: 'Why must people be a whole number?',
    answer:
      'Headcount is counted in whole people. Hours and pay may be fractional.',
  },
  {
    question: 'Does changing currency convert rates?',
    answer:
      'No. The currency selector only labels amounts. Enter hourly pay already in the currency you choose.',
  },
];
