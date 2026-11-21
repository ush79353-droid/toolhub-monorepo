import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HOURLY_TO_SALARY_WAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-hourly-to-salary', label: 'What Is Hourly to Salary Conversion?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'wage-conversion-formulas', label: 'Wage Conversion Formulas' },
  { id: 'working-assumptions', label: 'Working-Week Assumptions' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'hourly-to-salary-wage-faq', label: 'Frequently Asked Questions' },
];

export const HOURLY_TO_SALARY_WAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert between hourly wage and annual salary?',
    answer:
      'Enter hours per week (default 40) and either hourly wage or annual salary. The last-edited of those two is authoritative. Annual = hourly × hours/week × 52; hourly = annual ÷ (hours/week × 52). Daily, weekly, biweekly, and monthly amounts are derived from that result.',
  },
  {
    question: 'Why is a five-day week assumed for daily wage?',
    answer:
      'Daily wage equals weekly wage ÷ 5. This matches a standard Monday–Friday schedule. Weekend or rotating schedules are not modeled here.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Hourly, annual, and each “Your wage as” field have independent currencies. Math runs in the authoritative field’s currency at full precision; other amounts convert for display. Hours per week are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Is this the same as Hourly to Annual Salary or Annual Salary per Hour?',
    answer:
      'No. Hourly to Annual starts from hourly only (with days/week). Annual Salary per Hour lets any period be authoritative. This Wage Calculator syncs hourly ↔ annual and shows daily, monthly, weekly, and biweekly pay — no overtime, tax, or unpaid leave.',
  },
];
