import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FREE_CASH_FLOW_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-free-cash-flow', label: 'What Is Free Cash Flow?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'fcf-formulas', label: 'Free Cash Flow Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'fcf-faq', label: 'Frequently Asked Questions' },
];

export const FREE_CASH_FLOW_FAQS: readonly FAQItem[] = [
  {
    question: 'What is free cash flow (FCF)?',
    answer:
      'Free cash flow is operating cash flow minus capital expenditures. It is the cash left after funding operations and maintaining or growing the asset base. Negative FCF is allowed when CapEx exceeds operating cash flow.',
  },
  {
    question: 'How should I enter capital expenditures?',
    answer:
      'Enter CapEx as a positive spending amount (cash outflow). The calculator subtracts CapEx from operating cash flow: FCF = OCF − CapEx.',
  },
  {
    question: 'How is FCF yield calculated?',
    answer:
      'FCF yield (%) = Free cash flow ÷ Market capitalization × 100. Market cap must be greater than zero. Stock price alone does not invent market cap; yield uses the market-cap field.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Operating cash flow, CapEx, FCF, stock price, market cap, and revenue each have independent currencies. Money fields are normalized into the FCF currency before formulas run. Shares outstanding and percentage results are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
];
