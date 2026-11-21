import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const YEARLY_WAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-yearly-wage', label: 'What Is Yearly Wage From Hourly?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'yearly-wage-formulas', label: 'Wage Formulas' },
  { id: 'flat-tax-note', label: 'Simplified Flat Tax' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'yearly-wage-faq', label: 'Frequently Asked Questions' },
];

export const YEARLY_WAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is yearly wage calculated from hourly wage?',
    answer:
      'Yearly wage equals hourly wage × working hours per week × working weeks per year. Defaults are 40 hours and 52 weeks. Weeks must be between 0 and 52. Zero hours, weeks, or wage are allowed when valid.',
  },
  {
    question: 'How are net hourly and net yearly pay estimated?',
    answer:
      'Net hourly wage equals hourly wage × (1 − tax ÷ 100). Net yearly wage equals yearly wage × (1 − tax ÷ 100). Tax must be between 0% and 100%. This is a simplified flat-rate deduction, not a country-specific payroll or progressive tax calculation.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Hourly wage, yearly wage, net hourly, and net yearly each have independent currencies. Math runs in the hourly-wage currency at full precision; results convert for display. Hours, weeks, and tax percent are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'How is this different from Annual Salary Calculator?',
    answer:
      'The math family is the same (hourly × hours × weeks, then flat-tax nets), but Yearly Wage Calculator is a separate Wage Calculator catalog tool with its own route, labels, and 0–52 weeks validation. Annual Salary Calculator remains untouched.',
  },
];
