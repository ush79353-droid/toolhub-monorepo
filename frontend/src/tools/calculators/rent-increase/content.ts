import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RENT_INCREASE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-rent-increase', label: 'What Is Rent Increase?' },
  { id: 'rent-increase-formula', label: 'Rent Increase Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'rent-increase-faq', label: 'Frequently Asked Questions' },
];

export const RENT_INCREASE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is expected future annual rent calculated?',
    answer:
      'Future annual rent = current annual rent × (1 + average rent change / 100)^years. The change compounds once per year. Zero years leaves future rent equal to current rent. Negative growth (≥ −100%) models rent decreases.',
  },
  {
    question: 'Can the average rent change be zero or negative?',
    answer:
      'Yes. Zero change keeps rent flat. Negative change compounds a decrease, as long as the rate is not below −100%.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Current rent and expected future rent each have their own currency. Math runs in the current-rent currency at full precision; the result selector re-expresses that amount. Changing current rent currency converts that amount. Percent and years are never currency-converted. Missing rates block cross-currency switching.',
  },
];
