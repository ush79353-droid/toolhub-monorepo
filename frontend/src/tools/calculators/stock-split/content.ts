import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const STOCK_SPLIT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-stock-split', label: 'What Is a Stock Split?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'stock-split-formula', label: 'Stock Split Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'stock-split-faq', label: 'Frequently Asked Questions' },
];

export const STOCK_SPLIT_FAQS: readonly FAQItem[] = [
  {
    question: 'What does a 2-for-1 stock split mean?',
    answer:
      'A 2-for-1 split gives two new shares for every one old share. Share count doubles and the per-share price halves, so theoretical portfolio value stays the same.',
  },
  {
    question: 'Does this calculator support reverse stock splits?',
    answer:
      'Yes. Enter ratios such as 1-for-5 or 1-for-10 (A-for-B with A < B). New shares = original × A / B and new price = original price × B / A. Portfolio value is still preserved.',
  },
  {
    question: 'What about fractional shares?',
    answer:
      'This calculator keeps fractional shares mathematically. Brokers may round or pay cash-in-lieu for fractions — actual treatment can differ from the theoretical result shown here.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes for share prices and portfolio values. Split math runs in the before-split price currency at full precision; after-split price and portfolio values convert for display. Share quantities and the A-for-B ratio are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
];
