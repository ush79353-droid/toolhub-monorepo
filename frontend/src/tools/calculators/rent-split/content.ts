import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RENT_SPLIT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-rent-split', label: 'What Is a Rent Split?' },
  { id: 'rent-split-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'rent-split-faq', label: 'Frequently Asked Questions' },
];

export const RENT_SPLIT_FAQS: readonly FAQItem[] = [
  {
    question: 'How is rent split between bedrooms?',
    answer:
      'Total rent is divided equally among every person living in the home. Each bedroom’s share is (people in that bedroom ÷ total people) × total rent. Empty bedrooms with zero people contribute nothing.',
  },
  {
    question: 'What if a bedroom has zero people?',
    answer:
      'That bedroom’s share is zero. The calculator still runs as long as at least one person lives in another bedroom. If every bedroom has zero people, no split is calculated.',
  },
  {
    question: 'Does changing currency convert the rent amount?',
    answer:
      'Yes. Changing the currency converts total rent with stored MongoDB FX rates. People counts are never converted. Missing rates block the switch; stale rates show a warning but still convert.',
  },
];
