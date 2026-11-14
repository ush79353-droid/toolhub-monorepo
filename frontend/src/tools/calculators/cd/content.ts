import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-cd', label: 'What Is a CD?' },
  { id: 'cd-formula', label: 'Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'cd-faq', label: 'Frequently Asked Questions' },
];

export const CD_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this CD calculator compute?',
    answer:
      'It projects the final balance and interest earned on a certificate of deposit using compound interest for a chosen term and compounding frequency.',
  },
  {
    question: 'What formula is used?',
    answer:
      'Final Balance = P × (1 + r/n)^(n × t), where P is the initial deposit, r is the annual rate as a decimal, n is compounds per year, and t is years (including months ÷ 12). Interest earned is final balance minus deposit.',
  },
  {
    question: 'Can the interest rate be zero?',
    answer: 'Yes. With 0% interest, the final balance equals the initial deposit and interest earned is zero.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the currency label and formatting. Enter the deposit already in the selected currency.',
  },
];
