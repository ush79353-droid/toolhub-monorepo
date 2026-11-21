import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MARGIN_AND_MARKUP_TOC_ITEMS: readonly TableOfContentsItem[] = [
  {
    id: 'what-is-margin-and-markup',
    label: 'What Are Margin and Markup?',
  },
  { id: 'how-to-use-markup-and-margin', label: 'How to Use This Calculator' },
  { id: 'formulas', label: 'Formulas' },
  { id: 'margin-and-markup-faq', label: 'Frequently Asked Questions' },
];

export const MARGIN_AND_MARKUP_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the difference between margin and markup?',
    answer:
      'Margin is profit as a percentage of revenue (Profit ÷ Revenue × 100). Markup is profit as a percentage of cost (Profit ÷ Cost × 100). The same profit produces different margin and markup percentages unless both are zero.',
  },
  {
    question: 'How do I compare two markups and margins?',
    answer:
      'Check “Compare two markups and margins” to open a second scenario that shares the same cost. Enter a second margin or markup to see the matching revenue, profit, and related percentage: the Omni reference uses two sets with one shared cost.',
  },
  {
    question: 'Why can’t margin be 100% or higher when deriving revenue?',
    answer:
      'Revenue = Cost ÷ (1 − Margin/100). At 100% margin the denominator is zero, so revenue is undefined. Enter a margin below 100%.',
  },
  {
    question: 'Do currency changes affect margin or markup?',
    answer:
      'No. Changing Cost, Revenue, or Profit currency converts that money amount with stored FX rates. Percentages are never converted. Mixed currencies normalize into the cost currency before formulas run.',
  },
];
