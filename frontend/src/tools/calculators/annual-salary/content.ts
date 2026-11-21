import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ANNUAL_SALARY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-annual-salary', label: 'What Is Annual Salary From Hourly?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'annual-salary-formulas', label: 'Salary Formulas' },
  { id: 'flat-tax-note', label: 'Simplified Flat Tax' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'annual-salary-faq', label: 'Frequently Asked Questions' },
];

export const ANNUAL_SALARY_FAQS: readonly FAQItem[] = [
  {
    question: 'How is annual salary calculated from hourly wage?',
    answer:
      'Annual salary equals hourly wage × working hours per week × working weeks per year. Defaults are 40 hours and 52 weeks. Zero hours, weeks, or wage are allowed when valid.',
  },
  {
    question: 'How are net hourly and net annual pay estimated?',
    answer:
      'Net hourly wage equals hourly wage × (1 − tax ÷ 100). Net annual salary equals annual salary × (1 − tax ÷ 100). Tax must be between 0% and 100%. This is a simplified flat-rate deduction, not a country-specific payroll or progressive tax calculation.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Hourly wage, annual salary, net hourly, and net annual each have independent currencies. Math runs in the hourly-wage currency at full precision; results convert for display. Hours, weeks, and tax percent are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Is this the same as Salary Calculator With Overtime?',
    answer:
      'No. This tool converts a simple hourly wage into annual and flat-tax net figures. Salary Calculator With Overtime models regular and overtime hours separately and remains a distinct calculator.',
  },
];
