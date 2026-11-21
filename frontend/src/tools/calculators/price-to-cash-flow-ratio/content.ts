import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PRICE_TO_CASH_FLOW_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-pcf', label: 'What Is Price to Cash Flow?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'pcf-formulas', label: 'Price to Cash Flow Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'pcf-faq', label: 'Frequently Asked Questions' },
];

export const PRICE_TO_CASH_FLOW_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the price to cash flow ratio calculated?',
    answer:
      'Cash Flow per Share = Cash Flow ÷ Shares Outstanding. Price to Cash Flow = Price per Share ÷ Cash Flow per Share. Equivalently, P/CF = Market Capitalization ÷ Operating Cash Flow when market cap = price × shares.',
  },
  {
    question: 'What cash flow should I enter?',
    answer:
      'Use operating cash flow for the same reporting period as the share count. Keep cash flow and shares on a consistent per-period basis.',
  },
  {
    question: 'What if cash flow per share is zero?',
    answer:
      'The ratio is undefined (not Infinity). Enter a non-zero cash flow, or check that shares outstanding is correct.',
  },
  {
    question: 'Can cash flow be negative?',
    answer:
      'Yes. Negative operating cash flow produces a negative P/CF, which is generally unsuitable for conventional valuation comparisons.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Cash flow, cash flow per share, and price per share each have independent currencies. Money amounts are normalized before division. Share counts and the dimensionless P/CF ratio are never FX-converted.',
  },
];
