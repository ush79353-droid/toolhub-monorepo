import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LONG_TERM_CARE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-ltc', label: 'What is long-term care?' },
  { id: 'how-to-use', label: 'How to use our long-term care cost calculator' },
  { id: 'ltc-formula', label: 'Formula used to calculate long-term care' },
  { id: 'formula-example', label: 'How our calculator uses the formula' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'ltc-faq', label: 'Frequently asked questions' },
];

export const LONG_TERM_CARE_FAQS: readonly FAQItem[] = [
  {
    question: 'How can I calculate the cost of long-term care for three years?',
    answer:
      'Convert daily or monthly care to an annual baseline P, choose inflation i, then TC = P + P(1+i) + P(1+i)². Or use TC = P × ((1+i)³ − 1) / i when i ≠ 0.',
  },
  {
    question: 'What is a long-term care facility?',
    answer:
      'A long-term care facility provides residential support and ongoing assistance, for example assisted living, nursing homes, residential care, or specialized care facilities.',
  },
  {
    question: 'What is a long-term acute care hospital?',
    answer:
      'Long-term acute care hospitals deliver extended hospital-level medical treatment for serious conditions. That is different from residential long-term care focused on daily living assistance.',
  },
];
