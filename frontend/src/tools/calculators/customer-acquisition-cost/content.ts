import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CAC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-cac', label: 'What Is CAC?' },
  { id: 'cac-formula', label: 'Formula' },
  { id: 'cac-example', label: 'Example' },
  { id: 'cac-faq', label: 'Frequently Asked Questions' },
];

export const CAC_FAQS: readonly FAQItem[] = [
  {
    question: 'What is customer acquisition cost (CAC)?',
    answer:
      'CAC is the average cost to acquire one new customer: (marketing cost + sales cost) ÷ number of new customers.',
  },
  {
    question: 'What belongs in marketing vs sales cost?',
    answer:
      'Marketing usually covers ads, creative, and campaigns. Sales covers people, commissions, and tools used to close deals. Use the same period for both costs and the new-customer count.',
  },
  {
    question: 'Can costs be zero?',
    answer:
      'Yes. Zero marketing or sales cost is allowed. New customers must be greater than zero so the average is defined.',
  },
  {
    question: 'Does currency convert amounts?',
    answer:
      'No. Currency changes the symbol and grouping only. Enter both costs in the same currency.',
  },
];
