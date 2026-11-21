import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PRORATED_SALARY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-prorated-salary', label: 'What Is Prorated Salary?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'prorated-salary-formula', label: 'Proration Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'prorated-salary-faq', label: 'Frequently Asked Questions' },
];

export const PRORATED_SALARY_FAQS: readonly FAQItem[] = [
  {
    question: 'How are payable days counted?',
    answer:
      'Payable days equal days worked plus paid holidays plus approved leave. Enter each category once so the same calendar day is not counted twice. Holidays and approved leave are treated as compensated (paid), not unpaid.',
  },
  {
    question: 'How are scheduled working days determined?',
    answer:
      'The calculator walks the real civil calendar for the selected month and year (including leap Februaries). Any weekday marked as a day off is excluded. The remaining days are the scheduled working days used in the denominator.',
  },
  {
    question: 'How is non-monthly pay converted?',
    answer:
      'Before proration, gross pay is normalized to a monthly amount: month uses the amount as-is; year divides by 12; week multiplies by 52/12; day multiplies by that month’s scheduled working days. Prorated salary = monthly × payable ÷ scheduled.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Gross salary and prorated salary each have independent currencies. Math runs in the gross-salary currency at full precision; the result converts for display. Dates, day counts, holidays, leave, and workweek settings are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
];
