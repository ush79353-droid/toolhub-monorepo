import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const STOCK_AVERAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-stock-average', label: 'What Is a Stock Average?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'stock-average-formula', label: 'Weighted Average Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'stock-average-faq', label: 'Frequently Asked Questions' },
];

export const STOCK_AVERAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'Why is this a weighted average, not a simple average of prices?',
    answer:
      'Each purchase contributes cost equal to shares × price. The average purchase price is Total Cost ÷ Total Shares, so larger purchases weigh more. Averaging P1 and P2 alone would ignore share counts.',
  },
  {
    question: 'How many purchases do I need to enter?',
    answer:
      'Enter at least the first two buys; both share quantities and per-share prices. The optional current stock price unlocks market value and unrealized profit/loss.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Current price, 1st buy price, and 2nd buy price each have independent currencies. Purchase prices and the optional market price are normalized into the 1st buy price currency before the weighted average. Share quantities and return % are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'What if my total investment cost is zero?',
    answer:
      'Zero-cost purchases are allowed (nonnegative prices). Total shares and average price still compute when shares are positive. Return (%) is undefined when total cost is zero because there is no investment base to divide by.',
  },
];
