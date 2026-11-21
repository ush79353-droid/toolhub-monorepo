import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SEMI_MONTHLY_PAY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-semi-monthly-pay', label: 'What Is Semi-Monthly Pay?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'semi-monthly-pay-formulas', label: 'Semi-Monthly Pay Formulas' },
  { id: 'working-assumptions', label: 'Working Assumptions' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'semi-monthly-pay-faq', label: 'Frequently Asked Questions' },
];

export const SEMI_MONTHLY_PAY_FAQS: readonly FAQItem[] = [
  {
    question: 'Which wage field should I fill in?',
    answer:
      'Enter any one of hourly, daily, weekly, monthly, or yearly wage. The last field you edit is authoritative. Peer wages are derived so calculations stay consistent.',
  },
  {
    question: 'Is semi-monthly the same as biweekly?',
    answer:
      'No. Semi-monthly means twice per month (24 pay periods in a year. Biweekly means every two weeks) 26 periods. This calculator uses semi-monthly only.',
  },
  {
    question: 'How is semi-monthly pay calculated?',
    answer:
      'From yearly: yearly ÷ 24. From monthly: monthly ÷ 2. From weekly: weekly × 52 ÷ 24. From hourly or daily: convert to yearly via hours/days per week, then ÷ 24. Amounts keep full precision and round only for display.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Each wage input and the semi-monthly result have independent currencies. Math runs in the authoritative wage currency; peers and the answer convert for display. Hours and days per week are never FX-converted.',
  },
];
