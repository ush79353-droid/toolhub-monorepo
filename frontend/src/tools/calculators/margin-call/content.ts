import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MARGIN_CALL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-margin-call-calculator', label: 'What Is a Margin Call Calculator?' },
  { id: 'margin-call-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'margin-call-faq', label: 'Frequently Asked Questions' },
];

export const MARGIN_CALL_FAQS: readonly FAQItem[] = [
  {
    question: 'How is point value calculated?',
    answer:
      'Point value = tick value × number of ticks per point. For E-Mini S&P 500 the contract tick size implies 4 ticks per point; the monetary tick value is whatever you enter (no live market feed).',
  },
  {
    question: 'How are long and short profit/loss related?',
    answer:
      'Long P/L = (selling price − buying price) × point value × contracts. Short P/L is the negative of long P/L. Prices are in points and never convert with FX.',
  },
  {
    question: 'When is a margin call indicated?',
    answer:
      'After normalizing deposit, margins, and P/L into the initial-deposit currency, account equity = deposit + active P/L. A margin call is flagged when equity falls below total maintenance margin for open contracts.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Each monetary field has an independent currency. Changing a field’s currency converts that amount with stored MongoDB rates. Mixed currencies normalize into the deposit currency for P/L and margin totals. Missing rates block conversion; stale rates still convert with a warning. Counts, ticks, and point prices never convert.',
  },
];
