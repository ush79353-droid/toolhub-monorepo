import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HOURLY_TO_ANNUAL_SALARY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-hourly-to-annual', label: 'What Is Hourly to Annual Conversion?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'salary-conversion-formulas', label: 'Salary Conversion Formulas' },
  { id: 'working-assumptions', label: 'Working-Week Assumptions' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'hourly-to-annual-salary-faq', label: 'Frequently Asked Questions' },
];

export const HOURLY_TO_ANNUAL_SALARY_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert an hourly wage to annual, monthly, weekly, and daily pay?',
    answer:
      'Enter your hourly wage, hours per week (default 40), and days per week (default 5). Weekly = hourly × hours/week; Annual = weekly × 52; Monthly = annual ÷ 12; Per day = weekly ÷ days/week. Assumptions are disclosed on the page.',
  },
  {
    question: 'Why do I enter days per week?',
    answer:
      'Daily pay equals weekly pay ÷ days per week. The default is 5 (Monday–Friday). Change it if your schedule uses a different number of workdays; unpaid leave and holidays are not modeled.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Hourly wage and each result (annual, monthly, weekly, daily) have independent currencies. Math runs in the hourly wage currency at full precision; results convert for display. Hours and days per week are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Is this the same as Annual Salary or Annual to Monthly Salary?',
    answer:
      'No. Annual Salary converts hourly to annual with weeks/year and a simplified flat-tax net. Annual to Monthly starts from annual salary. This tool starts from hourly wage and uses hours/week and days/week only — no tax, overtime, or unpaid leave.',
  },
];
