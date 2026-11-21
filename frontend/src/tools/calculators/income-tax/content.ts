import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const INCOME_TAX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-income-tax-calculator', label: 'What Is This Calculator?' },
  { id: 'income-tax-formulas', label: 'How the Estimate Works' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'income-tax-faq', label: 'Frequently Asked Questions' },
];

export const INCOME_TAX_FAQS: readonly FAQItem[] = [
  {
    question: 'Which tax years are supported?',
    answer:
      'Tax years 2025 and 2026. Brackets and many thresholds come from IRS Rev. Proc. 2024-40 and Rev. Proc. 2025-32 / IR-2025-103, with OBBBA (P.L. 119-21) adjustments such as the enhanced standard deduction, $2,200 Child Tax Credit, $40,000 SALT cap, and Schedule 1-A tips/overtime/car-loan interest deductions.',
  },
  {
    question: 'Is this a complete Form 1040?',
    answer:
      'No. It is an educational federal estimate. State income tax liability, AMT, NIIT, self-employment tax, QBI, and many credits and limitations are out of scope. Disclosures appear under the results.',
  },
  {
    question: 'Are amounts converted across currencies?',
    answer:
      'No. All money fields are fixed US dollars. There is no currency selector and no FX conversion of brackets, percentages, or dependent counts.',
  },
  {
    question: 'Do state and local withholdings reduce federal tax owed?',
    answer:
      'No. Only federal income tax withheld (W-2 box 2) is compared to federal liability. State and local withholdings may increase the SALT itemized deduction and are never treated as federal withholding.',
  },
];
