import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const UNLEVERED_FCF_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-ufcf', label: 'What Is Unlevered Free Cash Flow?' },
  { id: 'ufcf-formula', label: 'UFCF Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'ufcf-faq', label: 'Frequently Asked Questions' },
];

export const UNLEVERED_FCF_FAQS: readonly FAQItem[] = [
  {
    question: 'How is unlevered free cash flow calculated here?',
    answer:
      'NOPAT = EBIT × (1 − ETR / 100). UFCF = NOPAT + D&A − CapEx − ΔWC. CapEx is positive spending. An increase in working capital reduces cash; a decrease (negative ΔWC) increases cash. Interest expense and mandatory debt repayments are not deducted.',
  },
  {
    question: 'How is this different from levered free cash flow or FCFF?',
    answer:
      'This UFCF path starts from EBIT and taxes only; no interest or debt principal. Levered FCF on this site uses a simplified EBITDA − CapEx − ΔWC − debt repayments estimate. FCFF supports multiple source formulas with source-specific adjustments. Use each tool for its stated model.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. EBIT, D&A, CapEx, ΔWC, and the UFCF result each have independent currencies. Inputs are normalized into the result currency before the formula runs. The effective tax rate is a percent and is never converted. Missing rates block conversion; stale rates warn but still convert. Never assume a 1:1 exchange between different currencies.',
  },
  {
    question: 'Can EBIT or UFCF be negative?',
    answer:
      'Yes. Negative EBIT produces negative NOPAT (tax benefit is still applied via the ETR formula). Negative UFCF means CapEx and working-capital investment exceed NOPAT plus D&A for the period.',
  },
];
