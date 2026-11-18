import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const REAL_ESTATE_COMMISSION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-real-estate-commission', label: 'What Is Real Estate Commission?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'real-estate-commission-formula', label: 'Commission Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'real-estate-commission-faq', label: 'Frequently Asked Questions' },
];

export const REAL_ESTATE_COMMISSION_FAQS: readonly FAQItem[] = [
  {
    question: 'How is real estate commission calculated?',
    answer:
      'Commission amount equals house price × commission rate ÷ 100. Owner receives equals house price minus that commission amount. Taxes, closing costs, and other fees are not included.',
  },
  {
    question: 'Can the commission rate be zero?',
    answer:
      'Yes. A 0% commission produces a commission amount of zero, so the owner receives the full house price (before any other costs you may negotiate separately).',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. House price, commission amount, and owner receives each have independent currencies. The math runs in the house-price currency at full precision; results are then converted for display. The commission percentage is never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Is this the same as Sales Commission Calculator?',
    answer:
      'No. Sales Commission Calculator models sales plans (quota, margin targets, OTE). This tool only estimates a flat real-estate brokerage commission from sale price and a percent rate.',
  },
];
