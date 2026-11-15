import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BASIS_POINT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-are-basis-points', label: 'What Are Basis Points?' },
  { id: 'basis-point-formulas', label: 'Basis Point Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'basis-point-faq', label: 'Frequently Asked Questions' },
];

export const BASIS_POINT_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a basis point?',
    answer:
      'A basis point (bps) is one hundredth of a percent: 1 bps = 0.01% = 0.0001 as a decimal = 0.1‰.',
  },
  {
    question: 'How do you convert between decimal, percent, permille, and bps?',
    answer:
      'Basis points = decimal × 10,000. Percent = bps ÷ 100. Permille = bps ÷ 10. Editing any linked field updates the other three.',
  },
  {
    question: 'How do you calculate x bps of an amount?',
    answer:
      'Amount = (basis points ÷ 10,000) × monetary value. Example: 1.5 bps of 65,000 = 9.75.',
  },
  {
    question: 'Does the currency selector convert exchange rates?',
    answer:
      'No. It only changes the denomination label and formatting for the monetary fields.',
  },
];
