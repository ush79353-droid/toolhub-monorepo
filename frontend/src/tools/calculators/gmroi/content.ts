import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GMROI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-gmroi', label: 'What GMROI Means' },
  { id: 'gmroi-formulas', label: 'Formulas' },
  { id: 'gmroi-example', label: 'Example' },
  { id: 'gmroi-faq', label: 'Frequently Asked Questions' },
];

export const GMROI_FAQS: readonly FAQItem[] = [
  {
    question: 'What is GMROI?',
    answer:
      'Gross margin return on investment measures how much gross profit you earn for each unit of average inventory investment: gross profit ÷ average inventory cost.',
  },
  {
    question: 'How is average inventory calculated?',
    answer:
      'By default it is (starting inventory + final inventory) ÷ 2. You can type a different average; clearing the field restores the auto value.',
  },
  {
    question: 'Can gross profit be negative?',
    answer: 'Yes. A negative gross profit yields a negative GMROI.',
  },
  {
    question: 'Does changing currency convert my numbers?',
    answer:
      'No. The selector only changes the currency label and formatting. Amounts stay in the denomination you entered.',
  },
];
