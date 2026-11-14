import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FUTURE_VALUE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-future-value', label: 'What Is Future Value?' },
  { id: 'future-value-formula', label: 'Future Value Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'future-value-faq', label: 'Frequently Asked Questions' },
];

export const FUTURE_VALUE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is future value calculated?',
    answer:
      'Without deposits, FV = PV × (1 + r)^n. With deposits or withdrawals, each signed contribution is compounded for the remaining periods based on beginning or end timing.',
  },
  {
    question: 'How is total interest calculated?',
    answer:
      'Without contributions, Total Interest = FV − PV. With contributions, Total Interest = FV − PV − Net Contributions.',
  },
  {
    question: 'What does a negative periodic amount mean?',
    answer:
      'A negative periodic amount is a withdrawal. It reduces the balance and can produce lower (or negative) future value and interest.',
  },
  {
    question: 'Does changing the currency convert the amount?',
    answer:
      'No. Currency selection changes denomination and formatting only. It does not apply a live exchange rate.',
  },
];
