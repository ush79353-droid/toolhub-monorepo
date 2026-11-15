import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DISCOUNT_RATE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-discount-rate', label: 'What Is Discount Rate?' },
  { id: 'discount-rate-formula', label: 'Discount Rate Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'discount-rate-faq', label: 'Frequently Asked Questions' },
];

export const DISCOUNT_RATE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a discount rate?',
    answer:
      'The discount rate is the interest rate used to convert future cash amounts into present value. This calculator solves for the nominal annual rate that equates your PV to discounted FV and optional periodic cash flows.',
  },
  {
    question: 'How is the discount rate calculated with no cash flows?',
    answer:
      'When CF = 0, r = m × [(FV ÷ PV)^(1 ÷ (m × t)) − 1], where m is compounds per year and t is the term in years.',
  },
  {
    question: 'How do periodic cash flows affect the rate?',
    answer:
      'Each cash flow is discounted to today using its payment date (beginning or end of period) and frequency. The rate is found numerically so PV equals the sum of discounted FV and cash flows.',
  },
  {
    question: 'Why might no rate appear?',
    answer:
      'If inputs are incomplete, invalid, or cannot be reconciled (for example inconsistent signs or horizons that admit no stable root), the calculator leaves the result blank instead of showing NaN or Infinity.',
  },
];
