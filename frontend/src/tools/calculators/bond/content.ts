import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BOND_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-bond-calculator', label: 'What Is This Calculator?' },
  { id: 'bond-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'bond-faq', label: 'Frequently Asked Questions' },
];

export const BOND_FAQS: readonly FAQItem[] = [
  {
    question: 'Which field should I leave blank?',
    answer:
      'Leave exactly one of Price, Face value, Yield, Time to maturity, or Annual coupon blank. Coupon frequency is always selected. The calculator solves for the blank field using the coupon-date bond pricing equation.',
  },
  {
    question: 'What does “bonds issued/traded at the coupon date” mean?',
    answer:
      'Cash flows are assumed to fall on whole coupon periods. Time to maturity × payments per year must be a positive integer number of periods. Accrued interest between coupon dates is not modeled.',
  },
  {
    question: 'Can I enter annual coupon as a dollar amount?',
    answer:
      'Yes. Use the unit selector next to Annual coupon: % means percent of face value; $ means a fixed annual coupon amount in USD. Periodic coupon = annual ÷ frequency.',
  },
  {
    question: 'Why is there no currency selector?',
    answer:
      'The reference layout formats money in USD only. Yield percentages and maturity years are never converted.',
  },
];
