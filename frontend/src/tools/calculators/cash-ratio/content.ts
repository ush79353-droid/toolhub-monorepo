import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CASH_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-cash-ratio', label: 'What Is Cash Ratio?' },
  { id: 'cash-ratio-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'cash-ratio-faq', label: 'Frequently Asked Questions' },
];

export const CASH_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the cash ratio calculated?',
    answer:
      'Cash Ratio = Cash and Cash Equivalents ÷ Current Liabilities. The result is a dimensionless multiple (for example 0.75x), not a percentage. Cash is normalized into the current-liabilities currency before dividing. Current liabilities must be greater than zero. Zero cash yields 0x.',
  },
  {
    question: 'What belongs in cash and cash equivalents?',
    answer:
      'Only highly liquid items such as cash, demand deposits, and short-term cash equivalents. Inventory, receivables, and other non-cash current assets are excluded from the numerator.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Cash and current liabilities each have an independent currency. Changing a selector converts that amount using stored MongoDB rates so the ratio stays the same. The cash ratio multiple is never FX-converted.',
  },
  {
    question: 'How is this different from Quick Ratio or Current Ratio?',
    answer:
      'Cash ratio uses only cash and cash equivalents in the numerator. Quick ratio typically adds receivables (and sometimes short-term investments). Current ratio uses all current assets. Quick Ratio Calculator and Current Ratio Calculator are separate tools.',
  },
];
