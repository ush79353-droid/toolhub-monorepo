import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MONTHLY_INCOME_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-monthly-income', label: 'What Is Monthly Income Conversion?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'conversion-formulas', label: 'Conversion Formulas' },
  { id: 'schedule-assumptions', label: 'Schedule Assumptions' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'monthly-income-faq', label: 'Frequently Asked Questions' },
];

export const MONTHLY_INCOME_FAQS: readonly FAQItem[] = [
  {
    question: 'Which earnings field should I fill in?',
    answer:
      'Enter any one of hourly, daily, weekly, or yearly. The last field you edit is authoritative. The others sync from that source.',
  },
  {
    question: 'How is monthly income calculated?',
    answer:
      'Normalize to yearly earnings using hours/day, days/week, and weeks/year, then Monthly = Yearly ÷ 12. Defaults are 8 / 5 / 52.',
  },
  {
    question: 'Do currency selectors convert amounts?',
    answer:
      'Yes. Each earnings field and monthly income has an independent currency. Math runs in the authoritative earnings currency; other amounts convert for display. Hours/days/weeks never FX-convert.',
  },
];
