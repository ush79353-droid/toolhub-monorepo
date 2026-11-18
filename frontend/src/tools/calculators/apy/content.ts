import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const APY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-apy', label: 'What Is APY?' },
  { id: 'apy-formula', label: 'APY Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'apy-faq', label: 'Frequently Asked Questions' },
];

export const APY_FAQS: readonly FAQItem[] = [
  {
    question: 'What is APY?',
    answer:
      'Annual percentage yield (APY) is the effective yearly return after compounding. It is higher than APR when interest compounds more than once per year.',
  },
  {
    question: 'How is APY calculated from APR?',
    answer:
      'APY = (1 + APR/n)^n − 1, where APR is the nominal annual rate as a decimal and n is the number of compounding periods per year.',
  },
  {
    question: 'How is the final deposit calculated?',
    answer:
      'Final deposit = P × (1 + APR/n)^(n × t), where P is the initial deposit and t is the term in years (months ÷ 12 when the term is in months).',
  },
  {
    question: 'Does changing the currency convert the amount?',
    answer:
      'Yes. Changing currency converts the initial and final deposit with stored exchange rates. APR, compounding frequency, term, and APY percentage are not converted.',
  },
];
