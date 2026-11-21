import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NEW_YORK_TAX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-new-york-tax', label: 'What This Calculator Estimates' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'new-york-tax-formulas', label: 'Formulas & Sources' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'new-york-tax-faq', label: 'Frequently Asked Questions' },
];

export const NEW_YORK_TAX_FAQS: readonly FAQItem[] = [
  {
    question: 'Which New York income-tax rules does this use?',
    answer:
      '2025 NYS standard deductions ($8,000 single/MFS; $16,050 joint/QSS; $11,200 HoH), $1,000 dependent exemptions, and Tax Law §601 rate schedules for years before 2026. NYC resident rates follow IT-201 / IT-360.1 bracket tables for 2025.',
  },
  {
    question: 'Does this include federal tax?',
    answer:
      'Yes. Federal ordinary income tax uses IRS Rev. Proc. 2024-40 brackets and standard deductions for tax year 2025. Federal child and other dependent credits are not applied without eligibility details.',
  },
  {
    question: 'Are payroll taxes included?',
    answer:
      'No. This tool estimates federal, NY State, and NYC income taxes only. Social Security, Medicare, and other payroll taxes are not modeled.',
  },
  {
    question: 'How is NYC tax handled for non-residents?',
    answer:
      'When NYC resident is set to No, NYC income tax is $0. Yonkers and other local income taxes are not included.',
  },
  {
    question: 'Are post-tax deductions subtracted from taxable income?',
    answer:
      'No. Post-tax deductions reduce estimated take-home pay after income taxes. They do not reduce federal or New York taxable income.',
  },
];