import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BIWEEKLY_PAY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-biweekly-pay', label: 'What Is Biweekly Pay?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'biweekly-pay-formulas', label: 'Biweekly Pay Formulas' },
  { id: 'working-assumptions', label: 'Working Assumptions' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'biweekly-pay-faq', label: 'Frequently Asked Questions' },
];

export const BIWEEKLY_PAY_FAQS: readonly FAQItem[] = [
  {
    question: 'Which wage field should I fill in?',
    answer:
      'Enter any one of annual salary, monthly, weekly, daily, or hourly wage. The last field you edit is authoritative. Conflicting peer wages are ignored so calculations stay non-circular.',
  },
  {
    question: 'Is biweekly the same as semi-monthly?',
    answer:
      'No. Biweekly means every two weeks; 26 pay periods in a 52-week year. Semi-monthly means twice per month (24 periods). This calculator uses biweekly only.',
  },
  {
    question: 'How is biweekly pay calculated?',
    answer:
      'From annual: annual ÷ 26. From monthly: monthly × 12 ÷ 26. From weekly: weekly × 2. From daily: daily × days/week × 2. From hourly: hourly × hours/week × 2. Amounts keep full precision and round only for display.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Each wage input and the biweekly result have independent currencies. Math runs in the authoritative wage currency; the answer converts for display. Hours and days per week are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
];
