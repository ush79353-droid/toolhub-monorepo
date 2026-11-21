import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HOURLY_TO_SALARY_WITH_OVERTIME_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-hourly-ot', label: 'What Is Hourly to Salary with Overtime?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'ot-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'ot-faq', label: 'Frequently Asked Questions' },
];

export const HOURLY_TO_SALARY_WITH_OVERTIME_FAQS: readonly FAQItem[] = [
  {
    question: 'How is total regular pay calculated?',
    answer:
      'Regular hourly rate × regular monthly hours. Monthly hours = weekly hours × 52/12. If you enter pay or hours in other periods, the calculator normalizes to hourly and monthly amounts before multiplying. Day conversions assume five workdays per week.',
  },
  {
    question: 'What does the overtime multiplier do?',
    answer:
      'Overtime hourly rate = regular hourly rate × multiplier (user-defined; 1.5 is common time-and-a-half). Total overtime pay multiplies that rate by overtime hours after normalizing those hours to a monthly amount. The multiplier does not establish legal overtime eligibility.',
  },
  {
    question: 'How is this different from Salary Calculator With Overtime?',
    answer:
      'This tool is the Hourly to Salary with Overtime catalog entry. It uses the same core overtime math but ships with hourly-to-salary defaults (40 hours per week) and its own guide/SEO page. The Salary Calculator With Overtime sibling remains a separate activated tool.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Changing regular-pay currency converts that wage with stored FX rates. Result currencies re-express calculated pay. Hours, time units, and the multiplier never convert. Missing rates block cross-currency switches; stale rates show a warning.',
  },
  {
    question: 'Is this a legal overtime determination?',
    answer:
      'No. This is a planning estimate from the rates and hours you enter. It does not verify exemption status, daily overtime rules, taxes, or jurisdiction-specific labor law.',
  },
];
