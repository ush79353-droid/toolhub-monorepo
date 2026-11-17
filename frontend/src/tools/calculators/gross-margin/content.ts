import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GROSS_MARGIN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-gross-margin', label: 'What Is Gross Margin?' },
  { id: 'gross-margin-formula', label: 'Gross Margin Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'gross-margin-faq', label: 'Frequently Asked Questions' },
];

export const GROSS_MARGIN_FAQS: readonly FAQItem[] = [
  {
    question: 'What does gross margin measure?',
    answer:
      'Gross margin is gross profit as a percentage of revenue. It shows how much of each sales dollar remains after direct cost of goods sold, before operating expenses, interest, and taxes.',
  },
  {
    question: 'Can gross profit or margin be negative?',
    answer:
      'Yes. When COGS exceeds revenue, gross profit and margin are negative. Revenue must be nonzero. The calculator never shows NaN or Infinity.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Revenue, COGS, and gross profit each have an independent currency. Changing a field’s currency converts that amount using the stored exchange-rate snapshot. COGS is normalized into the revenue currency before subtracting, and profit is re-expressed in its display currency, so a currency-only change does not alter the margin percent. The percentage itself is never currency-converted. Missing rates block cross-currency switching.',
  },
];
