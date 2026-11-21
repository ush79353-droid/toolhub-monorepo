import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SALARY_INFLATION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-salary-inflation', label: 'What Is Salary Inflation?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'salary-inflation-formulas', label: 'Salary Inflation Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'salary-inflation-faq', label: 'Frequently Asked Questions' },
];

export const SALARY_INFLATION_FAQS: readonly FAQItem[] = [
  {
    question: 'How is inflation-adjusted salary calculated?',
    answer:
      'This tool uses a single-period adjustment: Inflation-Adjusted Salary = Reference Salary × (1 + Inflation Rate / 100). There is no multi-year compounding here; only one inflation rate for one period.',
  },
  {
    question: 'What does gain or loss mean?',
    answer:
      'Gain or Loss = Current Salary − Inflation-Adjusted Salary (after normalizing currencies). A positive value means your current pay exceeds the inflation-adjusted reference; a negative value means a purchasing-power loss relative to the reference period.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Reference salary, current salary, inflation-adjusted salary, and gain/loss each have independent currencies. Money is normalized with stored FX rates before comparison. Inflation % is never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Is zero inflation or deflation allowed?',
    answer:
      'Yes. Zero inflation leaves the adjusted salary equal to the reference. Deflation rates above −100% are allowed and reduce the inflation factor below 1. Rates of −100% or lower are rejected because they make the factor zero or negative.',
  },
];
