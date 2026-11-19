import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RETURN_ON_SALES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-return-on-sales', label: 'What Is Return on Sales?' },
  { id: 'return-on-sales-formula', label: 'Return on Sales Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'return-on-sales-faq', label: 'Frequently Asked Questions' },
];

export const RETURN_ON_SALES_FAQS: readonly FAQItem[] = [
  {
    question: 'What does return on sales measure?',
    answer:
      'Return on sales (ROS) is operating profit as a percentage of net sales. Operating profit is earnings after operating expenses but before interest and taxes in many presentations, so ROS is distinct from net profit margin (after interest and taxes) and gross margin (after COGS only).',
  },
  {
    question: 'Can operating profit or ROS be negative or zero?',
    answer:
      'Yes. Zero operating profit with positive net sales yields 0%. An operating loss yields a negative ROS. Net sales must be greater than zero — zero and negative sales are rejected so the calculator never shows NaN or Infinity.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Operating profit and net sales each have an independent currency. Changing a field’s currency converts that amount using the stored exchange-rate snapshot. Operating profit is normalized into the net-sales currency before dividing, so a currency-only change does not alter the ROS percent. The percentage itself is never currency-converted. Missing rates block cross-currency switching.',
  },
];
