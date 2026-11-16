import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CANADIAN_MORTGAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-canadian-mortgage', label: 'What Is a Canadian Mortgage Payment?' },
  { id: 'canadian-mortgage-formula', label: 'Canadian Payment Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'canadian-mortgage-faq', label: 'Frequently Asked Questions' },
];

export const CANADIAN_MORTGAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the Canadian monthly rate different from a US mortgage?',
    answer:
      'Canadian fixed-rate residential mortgages quote a nominal annual rate that compounds semi-annually. The effective monthly rate is r = (1 + APR / 200)^(1/6) − 1. US mortgages typically use APR / 12.',
  },
  {
    question: 'How is the loan amount calculated?',
    answer:
      'Loan amount P = Home Price × (1 − Down Payment% / 100). Down payment dollars = Home Price × Down Payment% / 100.',
  },
  {
    question: 'What do the optional costs include?',
    answer:
      'When Include Optionals Below is checked, property taxes (percent of home price), home insurance, mortgage insurance, condo/HOA fees, and other annual costs are converted to monthly equivalents and added to out-of-pocket totals for the full loan term.',
  },
  {
    question: 'How is the payoff date determined?',
    answer:
      'Payoff date uses the selected start month and year plus the loan term in years (same calendar month). Example: Nov 2026 start with a 25-year term → Nov 2051.',
  },
  {
    question: 'Can I change currencies?',
    answer:
      'No. The reference shows fixed dollar ($) symbols without currency selectors, so amounts stay in fixed dollar formatting.',
  },
];
