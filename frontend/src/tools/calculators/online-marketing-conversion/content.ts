import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const OMC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-omc', label: 'What This Calculator Does' },
  { id: 'omc-formula', label: 'Formulas' },
  { id: 'omc-example', label: 'Example' },
  { id: 'omc-faq', label: 'Frequently Asked Questions' },
];

export const OMC_FAQS: readonly FAQItem[] = [
  {
    question: 'Do I need to fill every field?',
    answer:
      'No. Enter any mix of impressions, rates, costs, or revenue. Related blank fields fill automatically.',
  },
  {
    question: 'Will the calculator overwrite values I typed?',
    answer:
      'No. Fields you enter stay as typed. Only blank fields are filled when other inputs make them determinable.',
  },
  {
    question: 'What happens with zero visits or customers?',
    answer:
      'Unit costs and revenue-per metrics that would divide by zero stay blank instead of showing NaN or Infinity.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only labels monetary fields. Enter amounts already in the currency you select.',
  },
];
