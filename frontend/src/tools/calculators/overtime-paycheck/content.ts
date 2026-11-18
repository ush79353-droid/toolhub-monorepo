import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const OVERTIME_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-overtime-pay', label: 'What Is Overtime Pay?' },
  { id: 'overtime-formula', label: 'Overtime Pay Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'overtime-faq', label: 'Frequently Asked Questions' },
];

export const OVERTIME_FAQS: readonly FAQItem[] = [
  {
    question: 'How is overtime pay calculated?',
    answer:
      'Overtime hourly rate = regular hourly rate × overtime multiplier (often 1.5). Monthly overtime pay = overtime hourly rate × overtime hours in the month. Total pay adds monthly regular pay and monthly overtime pay.',
  },
  {
    question: 'How does regular monthly pay use weekly hours?',
    answer:
      'Regular monthly pay = hourly rate × weekly regular hours × 52/12. That converts a weekly schedule into an average month without inventing a fixed 4-week month.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Monetary fields have independent currencies. Changing a field’s currency converts that amount (or re-expresses a result) using the stored exchange-rate snapshot. Hours, time units, and the overtime multiplier are never currency-converted. If rates are unavailable, cross-currency switching is blocked.',
  },
];
