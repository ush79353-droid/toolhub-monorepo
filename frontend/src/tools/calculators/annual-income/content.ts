import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ANNUAL_INCOME_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-annual-income', label: 'What Is Annual Income From Hourly?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'annual-income-formulas', label: 'Income Formulas' },
  { id: 'flat-tax-note', label: 'Simplified Flat Tax' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'annual-income-faq', label: 'Frequently Asked Questions' },
];

export const ANNUAL_INCOME_FAQS: readonly FAQItem[] = [
  {
    question: 'How is annual income calculated from hourly wage?',
    answer:
      'Annual income equals hourly wage × working hours per week × working weeks per year. Defaults are 40 hours and 52 weeks. Zero hours, weeks, or wage are allowed when valid. Weeks must stay between 0 and 52 under the standard calendar-year model.',
  },
  {
    question: 'How are net hourly and net annual income estimated?',
    answer:
      'Net hourly wage equals hourly wage × (1 − tax ÷ 100). Net annual income equals annual income × (1 − tax ÷ 100). Tax must be between 0% and 100%. This is a simplified flat-rate deduction, not a country-specific payroll or progressive tax calculation.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Hourly wage, annual income, net hourly, and net annual each have independent currencies. Math runs in the hourly-wage currency at full precision; results convert for display. Hours, weeks, and tax percent are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'How is this different from Annual Salary or Yearly Wage?',
    answer:
      'The formulas match those siblings for hourly→annual conversion with a flat tax. This catalog tool uses the Annual Income labels and slug. Annual Salary Calculator and Yearly Wage Calculator remain separate tools.',
  },
];
