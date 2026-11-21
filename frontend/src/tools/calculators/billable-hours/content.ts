import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BILLABLE_HOURS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-billable-hours-calculator', label: 'What Is This Calculator?' },
  { id: 'billable-hours-formulas', label: 'Formulas' },
  { id: 'billable-hours-example', label: 'Example' },
  { id: 'billable-hours-faq', label: 'Frequently Asked Questions' },
];

export const BILLABLE_HOURS_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I use the Billable Hours Calculator?',
    answer:
      'Enter any two of Billable rate, Billable time, and Billable value, then leave the third blank. The calculator solves for the blank field. Zero is a filled value, not blank. If all three are filled, the last-edited field is recalculated from the other two.',
  },
  {
    question: 'How are time units converted?',
    answer:
      'Rate and time use seconds, minutes, or hours with exact conversions (60 seconds per minute, 60 minutes per hour). Time units are never FX-converted. Workday or calendar day lengths are not assumed.',
  },
  {
    question: 'Does changing currency convert my amounts?',
    answer:
      'Yes. Billable rate and Billable value each have independent currencies. Amounts are converted using stored Phase 2 rates and normalized into the rate currency before rate × time math. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Are taxes or discounts included?',
    answer:
      'No. This tool computes billable value as rate × time only. It does not apply taxes, retainers, overtime multipliers, or discounts.',
  },
];
