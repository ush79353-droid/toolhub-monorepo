import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const INTEREST_ONLY_MORTGAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-interest-only-mortgage', label: 'What Is an Interest-Only Mortgage?' },
  { id: 'interest-only-payment-formula', label: 'Interest-Only Payment Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'interest-only-mortgage-faq', label: 'Frequently Asked Questions' },
];

export const INTEREST_ONLY_MORTGAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'Does the loan balance go down during the interest-only period?',
    answer:
      'No. Interest-only payments cover interest only, so the principal stays the same until you start principal-and-interest payments or repay the balance as a lump sum.',
  },
  {
    question: 'How is the periodic payment calculated?',
    answer:
      'Periodic payment = loan amount × (annual rate ÷ 100) ÷ periods per year. Daily uses 365, monthly 12, quarterly 4, and yearly 1.',
  },
  {
    question: 'What does the Interest-only period section show?',
    answer:
      'Enter the IO length in years and months. The tool multiplies loan × annual rate × years to show total interest paid over that period. It does not invent a later amortization schedule.',
  },
  {
    question: 'Does changing currency convert the amounts?',
    answer:
      'Yes. Loan amount, periodic payment, and total interest each have their own currency. Changing the loan currency converts the loan amount. Changing a result currency re-expresses that money result using stored exchange rates. Rates and period lengths are never converted.',
  },
];
