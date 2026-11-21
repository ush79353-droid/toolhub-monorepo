import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TEXAS_TAX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-texas-tax', label: 'What This Calculator Estimates' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'texas-tax-formulas', label: 'Formulas & Sources' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'texas-tax-faq', label: 'Frequently Asked Questions' },
];

export const TEXAS_TAX_FAQS: readonly FAQItem[] = [
  {
    question: 'Does Texas have a state income tax?',
    answer:
      'No. Texas does not levy a state individual income tax. This calculator shows Texas state income tax as $0 and focuses on federal income tax plus an optional county property tax estimate.',
  },
  {
    question: 'Does this include FICA or a full paycheck?',
    answer:
      'No. AGI is not treated as FICA wages. Results show federal income tax, $0 Texas state tax, combined income tax, per-pay-period splits, and optional property tax, clearly labeled as excluding FICA/withholding.',
  },
  {
    question: 'How is property tax estimated?',
    answer:
      'Estimated property tax = entered home value × ACS 2020–2024 county effective rate (median tax ÷ median home value) for Texas counties in the dropdown. That rate is a market-value proxy, not your parcel’s combined taxing-unit levy. The rate field is pre-filled from the county and can be edited when you know your bill rate.',
  },
];