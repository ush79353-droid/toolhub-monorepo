import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EXPECTED_UTILITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-expected-utility', label: 'What Is Expected Utility?' },
  { id: 'eu-formula', label: 'Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'eu-faq', label: 'Frequently Asked Questions' },
];

export const EXPECTED_UTILITY_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator compute?',
    answer:
      'It computes expected utility for two mutually exclusive events using a risk-neutral linear utility function U(x) = x, so the result equals expected monetary value.',
  },
  {
    question: 'What formula is used?',
    answer:
      'Expected Utility = (P1 / 100 × V1) + (P2 / 100 × V2), where P1 and P2 are probabilities in percent that must total 100%, and V1 and V2 are monetary outcomes.',
  },
  {
    question: 'Is this a universal utility measure?',
    answer:
      'No. This tool uses the explicitly documented assumption U(x) = x. It does not model risk aversion or other utility functions.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the currency label and formatting. Enter values already in the selected currency.',
  },
];
