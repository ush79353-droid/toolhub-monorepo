import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EV_TO_SALES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-ev-to-sales', label: 'What Is EV to Sales?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'ev-to-sales-formulas', label: 'EV and EV/Sales Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'ev-to-sales-faq', label: 'Frequently Asked Questions' },
];

export const EV_TO_SALES_FAQS: readonly FAQItem[] = [
  {
    question: 'How is enterprise value calculated?',
    answer:
      'Enterprise value equals market capitalization + total debt + minority interest + preferred shares − cash and cash equivalents. Debt, minority interest, and preferred shares are additions; cash is deducted once. Negative EV is allowed when cash exceeds those additions.',
  },
  {
    question: 'How is the EV to sales ratio calculated?',
    answer:
      'EV to sales equals enterprise value ÷ sales (revenues). Sales must be greater than zero for a defined ratio. Zero sales yields an undefined ratio (not Infinity). The ratio is dimensionless and is never FX-converted.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Each monetary field has its own currency. Amounts are normalized into the market-capitalization currency before the formulas run; EV converts into its display currency. The EV/Sales ratio never converts. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'How is this different from Enterprise Value or Price to Sales?',
    answer:
      'This tool builds EV from the capital-structure inputs shown, then divides by sales. Enterprise Value Calculator and Price to Sales Ratio Calculator remain separate catalog tools.',
  },
];
