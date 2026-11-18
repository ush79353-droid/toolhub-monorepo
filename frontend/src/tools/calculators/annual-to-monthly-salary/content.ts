import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ANNUAL_TO_MONTHLY_SALARY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-annual-to-monthly', label: 'What Is Annual to Monthly Conversion?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'wage-conversion-formulas', label: 'Wage Conversion Formulas' },
  { id: 'working-assumptions', label: 'Working-Week Assumptions' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'annual-to-monthly-salary-faq', label: 'Frequently Asked Questions' },
];

export const ANNUAL_TO_MONTHLY_SALARY_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert an annual salary to monthly, weekly, daily, and hourly pay?',
    answer:
      'Enter your annual salary and hours per week (default 40). Monthly = annual ÷ 12; weekly = annual ÷ 52; daily = annual ÷ (52 × 5); hourly = annual ÷ (52 × hours per week). Assumptions are disclosed on the page.',
  },
  {
    question: 'Why is a five-day week assumed for daily wage?',
    answer:
      'Daily salary equals annual ÷ (52 × 5), which is the same as weekly ÷ 5. This matches a standard Monday–Friday schedule. Weekend or rotating schedules are not modeled here.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Annual salary and each derived wage have independent currencies. Math runs in the annual salary currency at full precision; other wages convert for display. Hours per week are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Is this the same as Annual Salary or Annual Salary per Hour?',
    answer:
      'No. Annual Salary converts hourly wage to annual (with a simplified flat-tax net). Annual Salary per Hour converts among any wage period. This tool starts from annual salary and derives monthly, weekly, daily, and hourly only.',
  },
];
