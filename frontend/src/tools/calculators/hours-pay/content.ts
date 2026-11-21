import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HOURS_PAY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-hours-pay', label: 'What Is Hours Pay Conversion?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'pay-conversion-formulas', label: 'Pay Conversion Formulas' },
  { id: 'working-hours-assumptions', label: 'Working-Hours Assumptions' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'hours-pay-faq', label: 'Frequently Asked Questions' },
];

export const HOURS_PAY_FAQS: readonly FAQItem[] = [
  {
    question: 'Which pay field should I fill in?',
    answer:
      'Enter any one of daily, weekly, monthly, or annual pay. The last field you edit is authoritative. The other pay inputs sync from that source so calculations stay non-circular.',
  },
  {
    question: 'How is hourly wage calculated?',
    answer:
      'Hourly wage = annual pay ÷ (hours/day × days/week × weeks/year). Equivalent shortcuts apply when daily or weekly pay is authoritative (daily ÷ hours/day, or weekly ÷ weekly hours).',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Each pay input and the hourly result has an independent currency. Math runs in the authoritative pay currency at full precision; other amounts convert for display. Hours, days, and weeks are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Is this the same as Wage to Salary or Hourly Wage?',
    answer:
      'No. Those tools start from hourly (or hourly/daily/weekly) wages and project salaries. Hours Pay starts from daily through annual pay and derives the equivalent hourly wage using your working-hours schedule.',
  },
];
