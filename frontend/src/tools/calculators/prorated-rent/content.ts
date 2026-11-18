import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PRORATED_RENT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-prorated-rent', label: 'What Is Prorated Rent?' },
  { id: 'prorated-rent-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'prorated-rent-faq', label: 'Frequently Asked Questions' },
];

export const PRORATED_RENT_FAQS: readonly FAQItem[] = [
  {
    question: 'How many days are in the month?',
    answer:
      'This calculator uses the actual calendar length of the move month, including 28, 29, 30, or 31 days. February leap years are handled correctly. It never assumes a flat 30-day month.',
  },
  {
    question: 'Is the moving date included?',
    answer:
      'Yes. Moving in charges from the move day through the last day of the month (days in month − day + 1). Moving out charges from the 1st through the move day (equal to the day number).',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Changing basic monthly rent currency converts that amount with stored MongoDB FX rates. The prorated-rent currency only re-expresses the calculated result. Currency changes never alter chargeable days. Missing rates block cross-currency switches; stale rates show a warning.',
  },
];
