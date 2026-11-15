import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TIME_VALUE_OF_MONEY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-tvm-calculator', label: 'What Is a Time Value of Money Calculator?' },
  { id: 'tvm-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'tvm-faq', label: 'Frequently Asked Questions' },
];

export const TIME_VALUE_OF_MONEY_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this time value of money calculator do?',
    answer:
      'It links present value and future value using a nominal annual interest rate, a term in years and months, and a compounding frequency. Edit either money field and the other is calculated.',
  },
  {
    question: 'How is future value calculated?',
    answer:
      'FV = PV × (1 + r/m)^(m×t), where r is the annual rate as a decimal, m is compounding periods per year, and t is years + months ÷ 12.',
  },
  {
    question: 'How is present value calculated?',
    answer: 'PV = FV ÷ (1 + r/m)^(m×t) with the same r, m, and t.',
  },
  {
    question: 'Is this the same as the Present Value or Future Value calculators?',
    answer:
      'No. Those tools use different field sets and workflows. This TVM calculator is a bidirectional PV ↔ FV compound-interest link with years/months term and compound frequency.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the currency label and grouping. Enter money fields already in the selected currency.',
  },
];
