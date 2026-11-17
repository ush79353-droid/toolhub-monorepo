import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const OPERATING_MARGIN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-operating-margin', label: 'What Is Operating Margin?' },
  { id: 'operating-margin-formula', label: 'Operating Margin Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'operating-margin-faq', label: 'Frequently Asked Questions' },
];

export const OPERATING_MARGIN_FAQS: readonly FAQItem[] = [
  {
    question: 'What does operating margin measure?',
    answer:
      'It shows operating income as a percentage of revenue after cost of goods sold and operating expenses. A higher margin generally means more profit from core operations before interest and taxes. It is a screening ratio, not a full income-statement analysis.',
  },
  {
    question: 'Can operating income be negative?',
    answer:
      'Yes. When COGS plus operating expenses exceed revenue, operating income and the margin are negative. Revenue must be nonzero. The calculator never shows NaN or Infinity.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Revenue, COGS, operating expenses, and operating income each have an independent currency. Changing a field’s currency converts that amount using the stored exchange-rate snapshot. Costs normalize into the revenue currency before subtracting, so a currency-only change does not alter the margin percent. The percentage itself is never currency-converted. If rates are unavailable, cross-currency switching is blocked.',
  },
];
