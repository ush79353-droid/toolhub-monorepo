import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SALARY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-salary-calculator', label: 'What Is a Salary Calculator?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'salary-conversion-formulas', label: 'Salary Conversion Formulas' },
  { id: 'leave-and-holidays', label: 'Holidays and Paid Vacation' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'salary-calculator-faq', label: 'Frequently Asked Questions' },
];

export const SALARY_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert hourly pay into daily, weekly, monthly, and annual salary?',
    answer:
      'Enter your hourly pay, hours per day (default 8), and days per week (default 5). Weekly hours = hours/day × days/week. Weekly pay = hourly × weekly hours. Annual scheduled days = days/week × 52. Annual = hourly × hours/day × annual scheduled days. Monthly = annual ÷ 12. Daily = hourly × hours/day. The year uses a 52-week convention.',
  },
  {
    question: 'Are holidays and paid vacation subtracted from annual salary?',
    answer:
      'No. Holidays per year and paid vacation days are shown for schedule context. For typical paid-leave arrangements they are compensated days, so this calculator does not deduct them from annual paid salary. Unpaid time-off deductions are not modeled.',
  },
  {
    question: 'Why only “Per hour” in I get paid?',
    answer:
      'The reference supports hourly pay as the verified mode. Other pay frequencies are omitted until they are explicitly specified for this tool.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Pay and each result (hourly, daily, weekly, monthly, annual) have independent currencies. Math runs in the pay currency at full precision; results convert for display. Hours, days, holidays, and vacation counts are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
];
