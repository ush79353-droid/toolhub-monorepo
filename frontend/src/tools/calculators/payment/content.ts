import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PAYMENT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-payment-calculator', label: 'What Is This Calculator?' },
  { id: 'payment-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'payment-faq', label: 'Frequently Asked Questions' },
];

export const PAYMENT_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the difference between Fixed Term and Fixed Payments?',
    answer:
      'Fixed Term solves the equal monthly payment for a known loan length. Fixed Payments keeps your monthly payment fixed and solves how many months (and years) are needed to pay off the loan.',
  },
  {
    question: 'How is the amortization schedule built?',
    answer:
      'Each month applies interest at annual rate ÷ 1200 on the remaining balance, then applies principal. The final installment is adjusted so the ending balance reaches zero. Annual rows sum twelve monthly periods.',
  },
  {
    question: 'Why is there no currency selector?',
    answer:
      'This calculator follows the reference layout and formats amounts in USD. It does not convert currencies.',
  },
];
