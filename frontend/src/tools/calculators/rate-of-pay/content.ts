import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RATE_OF_PAY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-rate-of-pay', label: 'What Is a Rate of Pay Calculator?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'rate-of-pay-formulas', label: 'Wage Conversion Formulas' },
  { id: 'working-assumptions', label: 'Working-Week Assumptions' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'rate-of-pay-faq', label: 'Frequently Asked Questions' },
];

export const RATE_OF_PAY_FAQS: readonly FAQItem[] = [
  {
    question: 'How does the Rate of Pay Calculator convert wages?',
    answer:
      'Enter hours per week (default 40) and any one wage amount. That last-edited field is authoritative. The calculator derives the hourly rate first, then fills hourly, daily, weekly, biweekly, monthly, and annual salary. Assumptions: weekly = hourly × hours/week; annual = weekly × 52; monthly = annual ÷ 12; biweekly = weekly × 2; daily = weekly ÷ 5.',
  },
  {
    question: 'Is biweekly the same as semi-monthly?',
    answer:
      'No. Biweekly means every two weeks (26 pay periods per year, or weekly × 2). Semi-monthly means twice per month (24 periods). This calculator uses biweekly only.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Each money field has an independent currency. Math runs in the authoritative field’s currency at full precision; other periods convert for display. Hours per week are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'How is this different from the Wage Calculator?',
    answer:
      'Rate of Pay focuses on the six screenshot periods (hourly through annual) without per-second or per-minute pay. Wage Calculator adds those finer periods. Formulas for shared periods match the verified wage family.',
  },
];
