import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PVIFA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-pvifa', label: 'What Is PVIFA?' },
  { id: 'pvifa-formula', label: 'PVIFA Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'pvifa-faq', label: 'Frequently Asked Questions' },
];

export const PVIFA_FAQS: readonly FAQItem[] = [
  {
    question: 'What is PVIFA?',
    answer:
      'PVIFA is the Present Value Interest Factor of Annuity: a dimensionless factor that converts a series of equal end-of-period payments into a present-value multiple of one payment.',
  },
  {
    question: 'How is PVIFA calculated?',
    answer:
      'PVIFA = [1 − (1 + r)^(−n)] ÷ r, where r is the period rate as a decimal and n is the number of periods. When r = 0, PVIFA = n.',
  },
  {
    question: 'Can the interest rate be negative?',
    answer:
      'Yes, when the rate is greater than −100% and the math stays finite. Rates of −100% or lower are rejected.',
  },
  {
    question: 'Does PVIFA include a payment amount?',
    answer:
      'No. PVIFA is a unitless factor. Multiply it by the payment amount to get the present value of the annuity.',
  },
];
