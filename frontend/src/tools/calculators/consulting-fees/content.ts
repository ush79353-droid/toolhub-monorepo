import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CONSULTING_FEES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-this-calculator-does', label: 'What This Calculator Does' },
  { id: 'billable-days', label: 'Billable Days' },
  { id: 'rate-formulas', label: 'Rate Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'consulting-fees-faq', label: 'Frequently Asked Questions' },
];

export const CONSULTING_FEES_FAQS: readonly FAQItem[] = [
  {
    question: 'How are billable days calculated?',
    answer:
      'Billable days equal weekdays in the year minus holiday days, sick days, and marketing/admin/non-client days. Empty holiday, sick, or non-client fields are treated as zero.',
  },
  {
    question: 'How are daily and hourly rates calculated?',
    answer:
      'Required annual revenue is target income plus annual operating costs. Daily billable rate divides that revenue by billable days. Hourly rate divides the daily rate by working hours per day.',
  },
  {
    question: 'Does average project value change my rates?',
    answer:
      'No. Average project value is kept for planning context only. It does not enter the daily or hourly rate formulas.',
  },
  {
    question: 'Why must billable days and working hours be positive?',
    answer:
      'Rates divide by billable days and working hours. Zero or negative values would make the daily or hourly rate undefined, so the calculator blocks those cases.',
  },
  {
    question: 'Does changing the currency convert my numbers?',
    answer:
      'No. The currency selector only changes the display symbol and formatting. Entered amounts stay in the currency you choose.',
  },
];
