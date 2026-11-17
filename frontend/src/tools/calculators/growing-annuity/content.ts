import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GROWING_ANNUITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-growing-annuity', label: 'What Is a Growing Annuity?' },
  { id: 'growing-annuity-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'growing-annuity-faq', label: 'Frequently Asked Questions' },
];

export const GROWING_ANNUITY_FAQS: readonly FAQItem[] = [
  {
    question: 'What can this growing annuity calculator solve for?',
    answer:
      'You can solve for initial deposit (present value), final balance (future value), or the starting annuity amount (cash flow). Ordinary annuity and annuity due timings are supported, as are deposit and withdrawal directions.',
  },
  {
    question: 'How are compounding and payment frequencies combined?',
    answer:
      'The nominal annual rate with compounding frequency m is converted to an equivalent rate per payment period q using i = (1 + r/m)^(m/q) − 1. The cash-flow schedule then advances one payment period at a time.',
  },
  {
    question: 'How do annual and periodic growth rates relate?',
    answer:
      'They are linked by the payment frequency: periodic growth g satisfies (1 + g)^q = 1 + G, where G is the annual growth rate and q is payments per year. Editing either field updates the other.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Initial deposit, annuity amount, and target final balance each have an independent currency. Changing a field’s currency converts that amount using the stored exchange-rate snapshot. Amounts normalize into the initial-deposit currency before calculating. Rates, dates, frequencies, and counts are never currency-converted.',
  },
];
