import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BIWEEKLY_MORTGAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-biweekly-mortgage', label: 'What Is a Biweekly Mortgage?' },
  { id: 'biweekly-mortgage-formula', label: 'How the Comparison Works' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'biweekly-mortgage-faq', label: 'Frequently Asked Questions' },
];

export const BIWEEKLY_MORTGAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is accelerated biweekly different from twice-monthly?',
    answer:
      'Accelerated biweekly pays half of the standard monthly payment every 14 days (about 26 payments a year), which is roughly one extra monthly payment per year. Ordinary twice-monthly / non-accelerated biweekly schedules amortize with a period rate for 24 or 26 periods and do not use half the monthly payment.',
  },
  {
    question: 'Do mortgage points and upfront fees change the payment?',
    answer:
      'No. Points (percent of principal) and the upfront fee are closing costs added once to total payment. They are not rolled into the amortizing balance and are not double-counted as interest.',
  },
  {
    question: 'Which amounts convert when I change currency?',
    answer:
      'Loan amount, upfront fee, and extra payment each have independent currencies and convert with stored MongoDB exchange rates. Values are normalized into the loan currency before amortization. Interest rate, term, points, and compounding never convert.',
  },
];
