import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const AGI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-agi', label: 'What Is Adjusted Gross Income?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'agi-formulas', label: 'AGI Formulas' },
  { id: 'irs-adjustments-2025', label: 'IRS Adjustments (Tax Year 2025)' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'agi-faq', label: 'Frequently Asked Questions' },
];

export const AGI_FAQS: readonly FAQItem[] = [
  {
    question: 'What is AGI and how is it different from taxable income?',
    answer:
      'Adjusted Gross Income (AGI) is total income minus above-the-line adjustments listed on Schedule 1 (Form 1040). Standard or itemized deductions come after AGI and are not included here. This calculator estimates AGI only.',
  },
  {
    question: 'Which tax year do these limits use?',
    answer:
      'Tax Year 2025 limits from IRS publications (including Pub. 590-A, Pub. 969, Pub. 970, and Schedule 1). Thresholds are applied in USD; other currencies convert with stored FX rates before limit tests.',
  },
  {
    question: 'Why might health insurance premiums not reduce AGI?',
    answer:
      'Employee health premiums paid with after-tax dollars are generally not an above-the-line adjustment. Only self-employed health insurance (Schedule 1) is modeled, and only when you mark eligibility and have business income. Premiums already excluded from W-2 wages should not be entered again.',
  },
  {
    question: 'Are 401(k) deferrals entered under retirement contributions?',
    answer:
      'No. Elective deferrals already excluded from Form W-2 box 1 are not deducted again. The retirement field is for deductible traditional IRA (and similar above-the-line) contributions subject to annual caps and workplace-plan phaseouts.',
  },
];
