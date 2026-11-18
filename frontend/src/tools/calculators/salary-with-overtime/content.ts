import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SALARY_WITH_OVERTIME_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-salary-with-overtime', label: 'What Is Salary With Overtime?' },
  { id: 'salary-with-overtime-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'salary-with-overtime-faq', label: 'Frequently Asked Questions' },
];

export const SALARY_WITH_OVERTIME_FAQS: readonly FAQItem[] = [
  {
    question: 'How is total regular pay calculated?',
    answer:
      'Regular hourly rate × regular monthly hours. If you enter pay or hours in other periods, the calculator normalizes to hourly and monthly amounts before multiplying. Weekly schedules use 52/12 weeks per month and five workdays per week when converting days.',
  },
  {
    question: 'What does the overtime multiplier do?',
    answer:
      'Overtime hourly rate = regular hourly rate × multiplier. Time-and-a-half is commonly 1.5. Total overtime pay multiplies that rate by your overtime hours after normalizing those hours to a monthly amount.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Changing regular-pay currency converts that wage with stored MongoDB FX rates. Result currencies only re-express calculated pay. Hours, time units, and the multiplier never convert. Missing rates block cross-currency switches; stale rates show a warning.',
  },
  {
    question: 'Is this a legal overtime determination?',
    answer:
      'No. This is a planning estimate from the rates and hours you enter. It does not verify exemption status, daily overtime rules, or jurisdiction-specific labor law. Confirm eligibility with your employer or counsel.',
  },
];
