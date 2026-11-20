import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BILL_RATE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-bill-rate', label: 'What Is a Bill Rate?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'bill-rate-formulas', label: 'Bill Rate Formulas' },
  { id: 'capacity-and-multiplier', label: 'Capacity and Multiplier' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'bill-rate-faq', label: 'Frequently Asked Questions' },
];

export const BILL_RATE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is bill rate calculated from annual salary?',
    answer:
      'Base hourly cost equals annual salary ÷ annual capacity (hours/year). Bill rate equals base hourly cost × multiplier, or equivalently (annual salary × multiplier) ÷ capacity. Capacity must be greater than zero. Salary and multiplier may be zero.',
  },
  {
    question: 'What does the multiplier mean?',
    answer:
      'The multiplier is a user-defined pricing uplift for overhead, indirect costs, and target margin. It is not a tax or utilization model. The default of 4 is a common consulting rule of thumb — change it to match your pricing policy.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Annual salary and bill rate each have independent currencies. Math runs in the annual-salary currency at full precision; the bill rate converts for display. Capacity (hours/year) and the multiplier are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Is bill rate the same as employee hourly wage?',
    answer:
      'No. Employee salary is an internal cost. Bill rate is the client-facing hourly charge after applying your multiplier. This tool does not invent taxes, benefits, or utilization inputs.',
  },
];
