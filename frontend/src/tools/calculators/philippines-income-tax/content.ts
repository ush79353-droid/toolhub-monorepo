import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PH_INCOME_TAX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-ph-income-tax', label: 'What Is This Calculator?' },
  { id: 'ph-income-tax-formulas', label: 'Formulas & Sources' },
  { id: 'employed-vs-self-employed', label: 'Employed vs Self-Employed' },
  { id: 'ph-income-tax-faq', label: 'Frequently Asked Questions' },
];

export const PH_INCOME_TAX_FAQS: readonly FAQItem[] = [
  {
    question: 'Which tax year and schedules are used?',
    answer:
      'Calendar year 2025. BIR TRAIN rates effective 1 January 2023 onwards (monthly withholding table and annual graduated brackets), SSS Circulars 2024-006/008 (January 2025 MSC and rates), PhilHealth Advisory 2025-0002 (5% with ₱10,000–₱100,000 base), and Pag-IBIG Circular 460 (₱10,000 maximum fund salary).',
  },
  {
    question: 'Are employer contributions deducted from net pay?',
    answer:
      'No. Only the employee (or self-employed member) shares of SSS, PhilHealth, and Pag-IBIG are deducted. Employer SSS EC, employer PhilHealth, and employer Pag-IBIG counterparts are excluded from take-home math.',
  },
  {
    question: 'Is withholding tax the same as my annual BIR tax?',
    answer:
      'No. For employed users this tool applies the BIR monthly withholding table on taxable compensation. Final annual income tax on the ITR can differ after 13th-month benefits, other income, and year-end adjustments.',
  },
  {
    question: 'How is self-employed tax estimated?',
    answer:
      'Self-employed users are not given payroll withholding. Contributions use self-employed SSS (15% of MSC), full PhilHealth premium, and Pag-IBIG employee+employer shares. Tax is an estimated monthly amount from the annual graduated rates on annualized taxable income ÷ 12; not the 8% optional flat rate and not a substitute for filing.',
  },
];
