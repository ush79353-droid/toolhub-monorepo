import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const STOCK_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-stock-calculator', label: 'What Is a Stock Calculator?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'stock-trading-formulas', label: 'Trading Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'stock-faq', label: 'Frequently Asked Questions' },
];

export const STOCK_FAQS: readonly FAQItem[] = [
  {
    question: 'Are buying and selling prices per share or totals?',
    answer:
      'Buying price and selling price are per share. Buying commission amount, net buying price, selling commission amount, net selling price, and profit are totals for the whole position. Break-even selling price is per share.',
  },
  {
    question: 'How is ROI calculated?',
    answer:
      'ROI (%) = Profit ÷ Net buying cost × 100, where Profit = Net selling proceeds − Net buying cost. Share count, commission percents, and ROI itself are never FX-converted.',
  },
  {
    question: 'When is break-even selling price undefined?',
    answer:
      'When selling commission is 100%, the denominator N × (1 − s/100) is zero, so break-even cannot be computed. The calculator rejects that case instead of showing Infinity or NaN.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Money fields use independent currencies with stored Phase 2 FX rates. Trade math normalizes prices into the buying-price currency, then converts results for display. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Does this include taxes or dividends?',
    answer:
      'No. This tool models share count, per-share prices, and percent brokerage commissions only. It does not invent taxes, dividends, spreads, or other trading fees.',
  },
];
