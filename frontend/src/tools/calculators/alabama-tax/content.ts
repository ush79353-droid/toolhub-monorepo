import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ALABAMA_TAX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-alabama-tax', label: 'What This Calculator Estimates' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'alabama-tax-formulas', label: 'Formulas & Sources' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'alabama-tax-faq', label: 'Frequently Asked Questions' },
];

export const ALABAMA_TAX_FAQS: readonly FAQItem[] = [
  {
    question: 'Which Alabama tax rules does this use?',
    answer:
      'State brackets, personal exemptions, dependent exemptions, and the Form 40 standard-deduction chart come from the Alabama Department of Revenue (ADOR) 2025 Form 40 instructions and ADOR individual income-tax rate FAQ. Tax year 2026 uses the same enacted schedules pending publication of TY2026 Form 40. Educational estimate only.',
  },
  {
    question: 'How are local occupational taxes applied?',
    answer:
      'Bessemer 1%, Birmingham 1%, Gadsden 2%, and Macon County 1% apply to earned wages for work performed in that jurisdiction (not merely because you selected a city). This tool applies the selected rate to annualized AGI as an earned-income proxy and labels that assumption.',
  },
  {
    question: 'Is federal income tax deducted on the Alabama return?',
    answer:
      'Alabama Form 40 allows a federal income tax deduction (line 12). This calculator does not collect federal tax liability, so that deduction is treated as $0. Entered AGI is used as Alabama AGI without other Alabama adjustments.',
  },
  {
    question: 'Are post-tax deductions subtracted from taxable income?',
    answer:
      'No. Post-tax deductions reduce take-home pay after estimated state and local tax. They do not reduce Alabama taxable income. FICA and other payroll taxes are not modeled.',
  },
];
