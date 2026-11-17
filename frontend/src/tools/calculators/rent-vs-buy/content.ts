import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RENT_VS_BUY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-rent-vs-buy', label: 'What Is Rent vs. Buy?' },
  { id: 'rent-vs-buy-formulas', label: 'How Costs Are Compared' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'rent-vs-buy-faq', label: 'Frequently Asked Questions' },
];

export const RENT_VS_BUY_FAQS: readonly FAQItem[] = [
  {
    question: 'What does a lower total cost mean?',
    answer:
      'Total rent cost and total buy cost are net costs over your staying period. The lower total is financially preferable under these assumptions. A negative total buy cost means selling proceeds after commissions and remaining mortgage exceed the cash you put in.',
  },
  {
    question: 'How is “money you have” used?',
    answer:
      'When renting, it sits in a deposit account earning the deposit interest rate; that interest reduces total rent cost. When buying, it is the down payment (loan = property cost − money you have). Buying commission and other fees are separate cash costs.',
  },
  {
    question: 'Do currency selectors convert amounts?',
    answer:
      'Yes. Money fields use independent currencies with real FX. Inputs normalize into the “money you have” currency before comparison; result currencies only re-express outputs. Percentages and durations are never currency-converted.',
  },
];
