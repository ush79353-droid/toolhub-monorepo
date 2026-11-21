import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MONTHLY_INCOME_HOURLY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  {
    id: 'what-is-monthly-income-hourly-calculator',
    label: 'What Is a Monthly Income Hourly Calculator?',
  },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'conversion-formulas', label: 'Conversion Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'monthly-income-hourly-faq', label: 'Frequently Asked Questions' },
];

export const MONTHLY_INCOME_HOURLY_FAQS: readonly FAQItem[] = [
  {
    question: 'How is hourly income calculated from monthly income?',
    answer:
      'Hourly = (Monthly × 12) ÷ (Hours per week × 52). This uses 52 paid weeks and 12 months; not a four-weeks-per-month shortcut.',
  },
  {
    question: 'Can I enter hourly income instead?',
    answer:
      'Yes. Editing hourly income makes it authoritative and reverse-calculates monthly = Hourly × Hours × 52 ÷ 12. Hours per week never FX-convert.',
  },
  {
    question: 'What is under Other income measures?',
    answer:
      'The screenshot shows a collapsed accordion without visible extra fields. No additional measures are invented beyond the monthly ↔ hourly conversion shown.',
  },
];
