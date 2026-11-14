import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const COMPOUND_GROWTH_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-compound-growth', label: 'What Is Compound Growth?' },
  { id: 'compound-growth-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'compound-growth-faq', label: 'Frequently Asked Questions' },
];

export const COMPOUND_GROWTH_FAQS: readonly FAQItem[] = [
  {
    question: 'How is compound growth calculated without contributions?',
    answer:
      'Final balance = initial deposit × (1 + r/n)^(n×t), where r is the annual rate, n is compounds per year, and t is time in years.',
  },
  {
    question: 'How are additional contributions handled?',
    answer:
      'The balance is stepped period by period. Deposits are added at the beginning or end of each contribution period, then interest compounds at r/n each compound period.',
  },
  {
    question: 'What is compounded growth?',
    answer: 'Compounded growth = final balance − total deposits (initial deposit + all additional contributions).',
  },
  {
    question: 'How do annual and periodic contribution growth rates work?',
    answer:
      'Periodic growth raises the contribution after each deposit. Annual growth raises it once per completed year. They are applied separately so the same increase is not double-counted.',
  },
];
