import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CAGR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-cagr', label: 'What CAGR Means' },
  { id: 'cagr-formulas', label: 'Formulas' },
  { id: 'cagr-example', label: 'Example' },
  { id: 'cagr-faq', label: 'Frequently Asked Questions' },
];

export const CAGR_FAQS: readonly FAQItem[] = [
  {
    question: 'What is CAGR?',
    answer:
      'Compound Annual Growth Rate is the constant yearly rate that would take an initial value to a final value over a number of periods with annual compounding.',
  },
  {
    question: 'Can I leave one field blank?',
    answer:
      'Yes. Enter any three of CAGR, periods, initial value, and final value; the calculator solves the fourth. Values you type are never overwritten.',
  },
  {
    question: 'Why won’t periods solve sometimes?',
    answer:
      'If CAGR is 0% and initial equals final, every period count works, so the inverse is ambiguous. If CAGR is nonzero but the values are equal, there is no positive period solution.',
  },
  {
    question: 'Does currency convert amounts?',
    answer:
      'No. Currency only changes the symbol and grouping for initial and final values.',
  },
];
