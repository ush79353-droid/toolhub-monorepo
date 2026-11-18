import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BI_WEEKLY_MORTGAGE_PAYMENT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  {
    id: 'what-is-bi-weekly-mortgage-payment',
    label: 'What Is a Bi-Weekly Mortgage Payment?',
  },
  { id: 'bi-weekly-mortgage-payment-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'bi-weekly-mortgage-payment-faq', label: 'Frequently Asked Questions' },
];

export const BI_WEEKLY_MORTGAGE_PAYMENT_FAQS: readonly FAQItem[] = [
  {
    question: 'What is accelerated bi-weekly vs twice-monthly?',
    answer:
      'Accelerated bi-weekly pays half of the standard monthly installment every 14 days (26 half-payments ≈ 13 monthly payments per year). Twice-monthly (24 payments per year) is a different schedule and is not used here.',
  },
  {
    question: 'How is the bi-weekly payment calculated?',
    answer:
      'First compute the fixed monthly payment from the mortgage amount, rate, and term. The accelerated bi-weekly installment is that monthly payment divided by two. Interest accrues on a bi-weekly period rate derived from the selected compounding convention.',
  },
  {
    question: 'Does extra payment apply to both columns?',
    answer:
      'Yes. Extra principal is applied with each scheduled payment on both the monthly and bi-weekly schedules so the frequency comparison stays fair.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Mortgage amount and extra payment (and optional upfront fee) use stored MongoDB FX rates and normalize into the mortgage currency before amortization. Interest rate and term are never converted.',
  },
];
