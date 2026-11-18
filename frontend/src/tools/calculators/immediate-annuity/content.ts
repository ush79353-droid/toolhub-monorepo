import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const IMMEDIATE_ANNUITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-immediate-annuity', label: 'What Is an Immediate Annuity?' },
  { id: 'immediate-annuity-formula', label: 'How the Calculator Works' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'immediate-annuity-faq', label: 'Frequently Asked Questions' },
];

export const IMMEDIATE_ANNUITY_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a single-premium immediate annuity?',
    answer:
      'A lump-sum premium is converted into a stream of periodic withdrawals that can begin immediately. This calculator models fixed-term systematic withdrawals with optional growth and a target remaining balance.',
  },
  {
    question: 'What does beginning of periods mean?',
    answer:
      'Beginning of periods is an annuity due: each withdrawal is taken at the start of the payment period before that period’s interest accrues. End of periods is an ordinary annuity.',
  },
  {
    question: 'Which amounts convert when I change currency?',
    answer:
      'Amount to invest, withdrawal amount, and optional remaining balance each have independent currencies and convert with stored MongoDB exchange rates. Values normalize into the invest currency before solving. Rates, lengths, growth percents, and dates never convert.',
  },
];
