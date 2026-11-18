import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SALARY_TO_HOURLY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-salary-to-hourly', label: 'What Is Salary to Hourly Conversion?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'wage-conversion-formulas', label: 'Wage Conversion Formulas' },
  { id: 'working-assumptions', label: 'Working-Week Assumptions' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'salary-to-hourly-faq', label: 'Frequently Asked Questions' },
];

export const SALARY_TO_HOURLY_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert annual salary to hourly wage?',
    answer:
      'Enter hours per week (default 40) and either annual salary or hourly wage. The last-edited of those two is authoritative. Hourly = annual ÷ (hours/week × 52); annual = hourly × hours/week × 52. Daily, weekly, biweekly, and monthly amounts are derived from that result.',
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
    question: 'Is this the same as Hourly to Salary - Wage Calculator?',
    answer:
      'The formulas match. This tool is framed for salary → hourly workflows on its own catalog page. Neither includes overtime, tax, or unpaid leave.',
  },
];
