import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CALIFORNIA_TAX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-california-tax', label: 'What This Calculator Estimates' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'california-tax-formulas', label: 'Formulas & Sources' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'california-tax-faq', label: 'Frequently Asked Questions' },
];

export const CALIFORNIA_TAX_FAQS: readonly FAQItem[] = [
  {
    question: 'Which California income-tax rules does this use?',
    answer:
      '2025 Franchise Tax Board Form 540 tax rate schedules (Schedules X/Y/Z), standard deduction ($5,706 single/MFS; $11,412 joint/HoH), personal and dependent exemption credits, and the Mental Health Services Tax (1% of taxable income over $1,000,000). Tax year 2026 reuses 2025 FTB schedules pending published indexing and is labeled accordingly.',
  },
  {
    question: 'Does this include federal tax and payroll taxes?',
    answer:
      'Yes. Federal ordinary income tax uses IRS Rev. Proc. 2024-40 (2025) / 2025-32 (2026) brackets and standard deductions. Employee Social Security, Medicare, Additional Medicare, and California SDI (EDD) use AGI as a wage proxy. Employer payroll taxes are not included.',
  },
  {
    question: 'How is property tax estimated?',
    answer:
      'Estimated property tax = assessed home value × applied rate ÷ 100. County defaults are California BOE 2024–25 county-average statutory rates of assessed value (for example Alameda 1.22%). TRA-specific rates and special assessments vary, edit the rate when you know your bill rate. The illustrative 0.88% screenshot value is not used as a verified Alameda default.',
  },
  {
    question: 'Are post-tax deductions subtracted from taxable income?',
    answer:
      'No. Post-tax deductions reduce estimated take-home pay after federal income tax, California income tax, and employee payroll taxes. They do not reduce taxable income.',
  },
];
