import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LOTTERY_ANNUITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-lottery-annuity', label: 'What Is a Lottery Annuity?' },
  { id: 'lottery-annuity-formulas', label: 'Lottery Annuity Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'lottery-annuity-faq', label: 'Frequently Asked Questions' },
];

export const LOTTERY_ANNUITY_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the first payout calculated?',
    answer:
      'The prize is treated as the present value of a growing ordinary annuity. The first payout is solved from the growing-annuity PV formula using your years, payout growth rate, and rate of return. Later years multiply the first payout by (1 + g) each year. The prize is never simply divided by the number of years when growth or discounting applies.',
  },
  {
    question: 'What do the tax treatment options do?',
    answer:
      'Without tax shows gross payouts. Customized tax rate applies one user-entered rate to every yearly payout (net = gross × (1 − tax)). US taxes are not estimated here — federal brackets and state withholding are not invented; choose Without tax or Customized instead.',
  },
  {
    question: 'Does the currency selector convert the prize?',
    answer:
      'Yes. Changing the prize currency converts the entered amount using the stored exchange-rate snapshot so the economic prize stays the same. The payout table uses that same currency. Percentages and years are never converted. If rates are unavailable, cross-currency switching is blocked.',
  },
];
