import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NET_PROFIT_MARGIN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-net-profit-margin', label: 'What Is Net Profit Margin?' },
  { id: 'net-profit-margin-formula', label: 'Net Profit Margin Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'net-profit-margin-faq', label: 'Frequently Asked Questions' },
];

export const NET_PROFIT_MARGIN_FAQS: readonly FAQItem[] = [
  {
    question: 'What does net profit margin measure?',
    answer:
      'Net profit margin is net profit as a percentage of total revenues. Net profit is after all relevant expenses and taxes, so this ratio is stricter than gross margin (after COGS only) or operating margin (after operating expenses).',
  },
  {
    question: 'Can net profit or margin be negative or zero?',
    answer:
      'Yes. Zero net profit with positive revenues yields 0%. A loss yields a negative margin. Total revenues must be greater than zero — zero and negative revenues are rejected so the calculator never shows NaN or Infinity.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Net profit and total revenues each have an independent currency. Changing a field’s currency converts that amount using the stored exchange-rate snapshot. Net profit is normalized into the revenues currency before dividing, so a currency-only change does not alter the margin percent. The percentage itself is never currency-converted. Missing rates block cross-currency switching.',
  },
];
