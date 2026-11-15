import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TTM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-ttm', label: 'What Is TTM?' },
  { id: 'ttm-formula', label: 'TTM Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'ttm-faq', label: 'Frequently Asked Questions' },
];

export const TTM_FAQS: readonly FAQItem[] = [
  {
    question: 'What is trailing twelve months (TTM)?',
    answer:
      'TTM is the sum of a financial metric over the most recent four consecutive quarters. It is commonly used for dividends, free cash flow, operating cash flow, and other quarterly line items.',
  },
  {
    question: 'How is Original TTM calculated?',
    answer:
      'TTM = Q0 + Q1 + Q2 + Q3, where Q0 is the last reported quarter and Q1–Q3 are the three prior quarters. Do not average or multiply a single quarter by four.',
  },
  {
    question: 'Can quarterly values be negative?',
    answer:
      'Yes. Losses or outflows can be entered as negatives. Zero is allowed and is distinct from a blank (missing) input.',
  },
  {
    question: 'Why is there no result until all four quarters are filled?',
    answer:
      'A complete TTM needs four consecutive quarters. Incomplete data is left blank instead of inventing a partial or misleading total.',
  },
];
