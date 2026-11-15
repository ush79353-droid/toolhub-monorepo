import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MONEY_FACTOR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-money-factor', label: 'What Is a Money Factor?' },
  { id: 'money-factor-formula', label: 'Money Factor Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'money-factor-faq', label: 'Frequently Asked Questions' },
];

export const MONEY_FACTOR_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a money factor?',
    answer:
      'A money factor is a unitless rate used in many vehicle leases. Multiplying it by 2400 gives an approximate equivalent annual interest rate (%).',
  },
  {
    question: 'How do you convert interest rate to money factor?',
    answer: 'Money Factor = Annual Interest Rate (%) ÷ 2400. Example: 6% ÷ 2400 = 0.0025.',
  },
  {
    question: 'How do you convert money factor to interest rate?',
    answer: 'Annual Interest Rate (%) = Money Factor × 2400. Example: 0.003 × 2400 = 7.2%.',
  },
  {
    question: 'Can the money factor be zero?',
    answer: 'Yes. A zero money factor corresponds to a 0% interest rate in this conversion.',
  },
];
