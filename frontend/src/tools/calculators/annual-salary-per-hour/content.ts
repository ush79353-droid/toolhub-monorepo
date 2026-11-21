import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ANNUAL_SALARY_PER_HOUR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-salary-per-hour', label: 'What Is Salary per Hour Conversion?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'wage-conversion-formulas', label: 'Wage Conversion Formulas' },
  { id: 'working-assumptions', label: 'Working-Week Assumptions' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'annual-salary-per-hour-faq', label: 'Frequently Asked Questions' },
];

export const ANNUAL_SALARY_PER_HOUR_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert between hourly, daily, weekly, monthly, and annual pay?',
    answer:
      'Enter hours per week (default 40) and any one wage amount. That last-edited field is authoritative. The calculator derives annual pay first, then fills the other periods. Assumptions: annual hours = hours/week × 52; weekly = annual ÷ 52; monthly = annual ÷ 12; daily = weekly ÷ 5 (five-day week).',
  },
  {
    question: 'Why is a five-day week assumed for daily wage?',
    answer:
      'Daily wage equals weekly wage ÷ 5. This matches a standard Monday–Friday schedule. Weekend or rotating schedules are not modeled here.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Each wage field has an independent currency. Math runs in the authoritative field’s currency at full precision; other periods convert for display. Hours per week are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Is this the same as the Annual Salary Calculator?',
    answer:
      'No. Annual Salary Calculator converts hourly wage to annual (and a simplified flat-tax net). This tool converts among hourly, daily, weekly, monthly, and annual from any one entered wage.',
  },
];
