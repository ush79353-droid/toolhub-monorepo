import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PRICE_TO_SALES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-ps', label: 'What Is Price to Sales?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'ps-formulas', label: 'Price to Sales Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'ps-faq', label: 'Frequently Asked Questions' },
];

export const PRICE_TO_SALES_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the price to sales ratio calculated?',
    answer:
      'Sales per Share = Sales ÷ Shares Outstanding. Price to Sales = Price per Share ÷ Sales per Share. Equivalently, P/S = Market Capitalization ÷ Annual Revenue when market cap = price × shares.',
  },
  {
    question: 'What sales figure should I enter?',
    answer:
      'Use total revenue / sales for the same reporting period as the share count. Keep sales and shares on a consistent per-period basis.',
  },
  {
    question: 'What if sales per share is zero?',
    answer:
      'The ratio is undefined (not Infinity). Enter positive sales, or check that shares outstanding is correct.',
  },
  {
    question: 'Can price per share be zero?',
    answer:
      'Yes. Zero price (zero market capitalization) yields a P/S of 0 when sales per share is positive.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Sales, sales per share, and price per share each have independent currencies. Money amounts are normalized before division. Share counts and the dimensionless P/S ratio are never FX-converted.',
  },
];
