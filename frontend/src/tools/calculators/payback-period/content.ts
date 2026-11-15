import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PAYBACK_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-payback', label: 'What This Calculator Does' },
  { id: 'payback-formulas', label: 'Formulas' },
  { id: 'payback-scenarios', label: 'Steady vs Irregular' },
  { id: 'payback-example', label: 'Example' },
  { id: 'payback-faq', label: 'Frequently Asked Questions' },
];

export const PAYBACK_FAQS: readonly FAQItem[] = [
  {
    question: 'What does “Not recovered” mean?',
    answer:
      'Cash flows never accumulate to the initial investment within the available years (or the discounted perpetuity is too small). The calculator shows Not recovered instead of NaN or Infinity.',
  },
  {
    question: 'Are steady and irregular cash flows combined?',
    answer:
      'No. They are alternative scenarios that share the discount rate and initial investment. Steady uses one annual cash flow; irregular uses the year-by-year amounts only.',
  },
  {
    question: 'How is discounted payback calculated?',
    answer:
      'Each year’s cash flow is divided by (1 + r)^t, then cumulative discounted cash flows are compared with the investment using the same fractional-year recovery rule.',
  },
  {
    question: 'Does currency convert amounts?',
    answer:
      'No. Currency changes the symbol and grouping only. Enter all money fields in the same currency.',
  },
];
