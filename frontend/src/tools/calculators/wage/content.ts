import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const WAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-wage-calculator', label: 'What Is a Wage Calculator?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'wage-conversion-formulas', label: 'Wage Conversion Formulas' },
  { id: 'working-assumptions', label: 'Working-Week Assumptions' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'wage-faq', label: 'Frequently Asked Questions' },
];

export const WAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'How does the Wage Calculator convert between time frames?',
    answer:
      'Enter hours per week (default 40) and any one wage amount. That last-edited field is authoritative. The calculator derives the hourly rate first, then fills every other period. Assumptions: weekly = hourly × hours/week; annual = weekly × 52; monthly = annual ÷ 12; biweekly = weekly × 2; daily = weekly ÷ 5; per minute = hourly ÷ 60; per second = hourly ÷ 3600.',
  },
  {
    question: 'Why is a five-day week assumed for daily wage?',
    answer:
      'Daily wage equals weekly wage ÷ 5. This matches a standard Monday–Friday schedule. Weekend or rotating schedules are not modeled here.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Each money field has an independent currency. Math runs in the authoritative field’s currency at full precision; other periods convert for display. Hours per week are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'How is this different from Salary to Hourly or Hourly to Salary - Wage?',
    answer:
      'Those tools focus on hourly ↔ annual with derived daily/weekly/biweekly/monthly. This Wage Calculator also includes per-second and per-minute pay and lets any screenshot period be the authoritative input.',
  },
];
