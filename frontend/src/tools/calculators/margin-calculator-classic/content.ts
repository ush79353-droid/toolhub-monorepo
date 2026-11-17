import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MARGIN_CALCULATOR_CLASSIC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-margin-calculator-classic', label: 'What Is Margin Calculator Classic?' },
  { id: 'margin-calculator-classic-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'margin-calculator-classic-faq', label: 'Frequently Asked Questions' },
];

export const MARGIN_CALCULATOR_CLASSIC_FAQS: readonly FAQItem[] = [
  {
    question: 'How do the fields update each other?',
    answer:
      'Editing cost, margin, revenue, or profit updates the related fields without circular loops. The last-edited field is the driver. Pinning margin holds that percentage while cost, revenue, or profit changes.',
  },
  {
    question: 'What does the margin pin do?',
    answer:
      'When margin is pinned, changing cost recomputes revenue and profit from that margin. Changing revenue or profit with margin pinned solves for cost while keeping the margin. Unpin to let margin recalculate from cost and revenue or profit.',
  },
  {
    question: 'Do currency selectors convert amounts?',
    answer:
      'Yes. Cost, revenue, and profit each have an independent currency. Changing a currency converts that money amount using stored MongoDB rates. Amounts normalize into the cost currency before solving, so currency-only changes do not alter the margin percentage. Percentages are never FX-converted.',
  },
  {
    question: 'What about a 100% margin or zero revenue?',
    answer:
      'A 100% margin cannot solve revenue from cost (division by zero). Zero revenue is rejected because margin divides by revenue. Enter valid nonzero revenue or a margin below 100%.',
  },
];
