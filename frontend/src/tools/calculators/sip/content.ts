import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SIP_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-sip', label: 'What Is a SIP?' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'sip-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Example' },
  { id: 'sip-faq', label: 'FAQ' },
];

export const SIP_FAQS: readonly FAQItem[] = [
  {
    question: 'How is SIP maturity calculated?',
    answer:
      'Monthly rate i = r/12/100 and n = years×12. Future value FV = P×[((1+i)^n−1)/i]×(1+i) for an ordinary monthly annuity. When r = 0, FV equals total investment P×n.',
  },
  {
    question: 'What is the investment multiplication factor?',
    answer:
      'Maturity amount ÷ total investment. It shows how many times your contributed principal grows at the assumed return.',
  },
  {
    question: 'Do currency selectors convert amounts?',
    answer:
      'Yes for money fields. Years and return % never convert. Missing rates block conversion; stale rates warn but still convert.',
  },
];
