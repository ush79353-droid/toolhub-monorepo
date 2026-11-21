import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SIMPLE_INTEREST_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-simple-interest', label: 'What Is Simple Interest?' },
  { id: 'simple-interest-formula', label: 'Simple Interest Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'simple-interest-faq', label: 'Frequently Asked Questions' },
];

export const SIMPLE_INTEREST_FAQS: readonly FAQItem[] = [
  {
    question: 'What is simple interest?',
    answer:
      'Simple interest is calculated only on the original principal for the full term. It does not compound; interest is never added to the principal during the term.',
  },
  {
    question: 'How is simple interest calculated?',
    answer:
      'Total interest I = P × (r ÷ 100) × t, and final balance A = P + I. Here t = years + months ÷ 12.',
  },
  {
    question: 'How is the term converted?',
    answer:
      'Years and months are combined as t = years + months ÷ 12. Months of 12 or more are normalized into additional years.',
  },
  {
    question: 'Is this the same as compound interest?',
    answer:
      'No. Compound interest earns interest on accumulated interest. This calculator always uses the original principal only.',
  },
];
