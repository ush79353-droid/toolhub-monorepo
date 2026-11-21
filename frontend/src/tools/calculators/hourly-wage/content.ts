import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HOURLY_WAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-hourly-wage', label: 'What Is an Hourly Wage Converter?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'hourly-wage-formula', label: 'Wage Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'hourly-wage-faq', label: 'Frequently Asked Questions' },
];

export const HOURLY_WAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'What schedule assumptions does this calculator use?',
    answer:
      'Daily wage assumes 5 working days per week (weekly hours ÷ 5). Annual and monthly figures assume 52 paid weeks per year. Monthly = weekly × 52 ÷ 12. No overtime, taxes, or unpaid leave are modeled.',
  },
  {
    question: 'How are per-second and per-minute wages calculated?',
    answer:
      'Per minute = hourly wage ÷ 60. Per second = hourly wage ÷ 3600. These divide the hourly rate only; weekly hours do not change them.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Hourly wage and each period result have independent currencies. Math runs in the hourly-wage currency at full precision; results convert for display. Hours per week is never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'How is this different from Hourly to Annual Salary?',
    answer:
      'Hourly to Annual Salary also asks for days per week and focuses on annual/monthly/weekly/daily. This Hourly Wage Calculator adds per-second, per-minute, and biweekly outputs with the fixed 5-day / 52-week assumptions stated above.',
  },
];
