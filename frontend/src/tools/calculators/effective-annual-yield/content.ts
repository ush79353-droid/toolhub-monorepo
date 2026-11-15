import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EFFECTIVE_ANNUAL_YIELD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-effective-annual-yield', label: 'What Is Effective Annual Yield?' },
  { id: 'effective-annual-yield-formula', label: 'Effective Annual Yield Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'effective-annual-yield-faq', label: 'Frequently Asked Questions' },
];

export const EFFECTIVE_ANNUAL_YIELD_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator measure?',
    answer:
      'It converts a bond’s coupon rate into an effective annual yield assuming coupons compound at the periodic coupon rate. It is not bond yield to maturity and does not use market price.',
  },
  {
    question: 'How is coupon rate calculated?',
    answer: 'Coupon Rate (%) = (Annual Coupon Payment ÷ Face Value) × 100.',
  },
  {
    question: 'How is effective annual yield calculated?',
    answer:
      'Effective Annual Yield (%) = [(1 + r/n)^n − 1] × 100, where r is the coupon rate as a decimal and n is the number of coupon periods per year.',
  },
  {
    question: 'Does changing the currency convert the amount?',
    answer:
      'No. Currency selection changes denomination and formatting only. It does not apply a live exchange rate.',
  },
];
