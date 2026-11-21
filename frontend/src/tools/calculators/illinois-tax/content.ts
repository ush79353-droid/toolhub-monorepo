import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ILLINOIS_TAX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-illinois-tax', label: 'What This Calculator Estimates' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'illinois-tax-formulas', label: 'Formulas & Sources' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'illinois-tax-faq', label: 'Frequently Asked Questions' },
];

export const ILLINOIS_TAX_FAQS: readonly FAQItem[] = [
  {
    question: 'Which Illinois income-tax rules does this use?',
    answer:
      'Illinois individual income tax is a flat 4.95% (IDOR). Personal exemption is $2,850 for TY2025 and $2,925 for TY2026, with zero exemption when federal AGI exceeds $250,000 (single/HoH/MFS) or $500,000 (MFJ). Base income is treated as federal AGI without Schedule M adjustments.',
  },
  {
    question: 'Does this include FICA or a full paycheck?',
    answer:
      'No. The prompt forbids treating AGI as FICA wages. Results show federal and Illinois income tax and after-income-tax amounts, clearly labeled as excluding FICA/withholding.',
  },
  {
    question: 'How is property tax estimated?',
    answer:
      'Estimated property tax = entered home value × ACS 2024 county effective rate (median tax ÷ median home value) for all 102 Illinois counties. That rate is a market-value proxy—not a parcel TRA levy on equalized assessed value. Edit the rate when you know your bill rate. The screenshot 1.67% is not used as Adams County’s verified rate (ACS Adams ≈ 1.582%).',
  },
];
