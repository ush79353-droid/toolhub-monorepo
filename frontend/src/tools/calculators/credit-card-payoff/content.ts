import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CREDIT_CARD_PAYOFF_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-credit-card-payoff', label: 'What This Calculator Does' },
  { id: 'credit-card-payoff-formulas', label: 'Formulas' },
  { id: 'credit-card-payoff-example', label: 'Example' },
  { id: 'credit-card-payoff-faq', label: 'Frequently Asked Questions' },
];

export const CREDIT_CARD_PAYOFF_FAQS: readonly FAQItem[] = [
  {
    question: 'How is payoff time calculated?',
    answer:
      'Each month accrues interest at APR/12, then your fixed monthly payment reduces the balance. The loop continues until the balance is cleared. A final partial month is converted into an approximate day count (30-day month). When APR is 0%, payoff months = balance ÷ payment.',
  },
  {
    question: 'What if my payment is too small?',
    answer:
      'If the monthly payment is less than or equal to the first month’s interest, the balance never shrinks and the calculator reports that the card will not pay off under those settings.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Balance, monthly payment, and total paid each have independent currencies. Money amounts are normalized into the balance currency before calculating; total paid is re-expressed in its display currency. APR and years/months/days are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
];
