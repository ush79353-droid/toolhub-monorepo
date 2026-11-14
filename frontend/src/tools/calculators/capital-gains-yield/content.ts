import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CAPITAL_GAINS_YIELD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-capital-gains-yield', label: 'What Is Capital Gains Yield?' },
  { id: 'capital-gains-yield-formula', label: 'Capital Gains Yield Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'capital-gains-yield-faq', label: 'Frequently Asked Questions' },
];

export const CAPITAL_GAINS_YIELD_FAQS: readonly FAQItem[] = [
  {
    question: 'What is capital gains yield?',
    answer:
      'Capital gains yield is the percentage return from price change alone: capital gains divided by the bought price, times 100.',
  },
  {
    question: 'How do you calculate capital gains?',
    answer:
      'Capital Gains = Current Price − Bought Price. A negative result is a capital loss.',
  },
  {
    question: 'Why must bought price be greater than zero?',
    answer:
      'Yield divides by bought price. A zero or negative bought price would make the percentage undefined or meaningless.',
  },
  {
    question: 'Does changing the currency convert the amount?',
    answer:
      'No. Currency selection changes denomination and formatting only. It does not apply a live exchange rate.',
  },
];
