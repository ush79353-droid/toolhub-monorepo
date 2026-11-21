import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BIDENS_TAX_PLAN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'historical-context', label: 'Historical Context' },
  { id: 'baseline-and-proposal', label: 'Baseline & Proposal' },
  { id: 'how-estimates-work', label: 'How Estimates Work' },
  { id: 'important-limitations', label: 'Important Limitations' },
  { id: 'biden-tax-faq', label: 'Frequently Asked Questions' },
];

export const BIDENS_TAX_PLAN_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this a current-year federal income tax calculator?',
    answer:
      'No. This is a Historical Biden Tax Plan Comparison. It contrasts a simplified tax-year 2022 TCJA baseline with the May 2021 American Families Plan ordinary-rate and Child Tax Credit proposals. It is not advice for filing a 2025 or 2026 Form 1040.',
  },
  {
    question: 'Which Biden proposal does this model?',
    answer:
      'The American Families Plan (May 2021): raise the top ordinary marginal rate to 39.6% above $452,700 (single/HoH) or $509,300 (joint) in 2022 dollars, and extend the American Rescue Plan’s expanded Child Tax Credit ($3,600 under age 6 / $3,000 ages 6–17) with full refundability. Capital-gains and NIIT AFP items are excluded because the screenshot has no investment-income inputs.',
  },
  {
    question: 'What does “Number of dependents” mean here?',
    answer:
      'Additional dependents eligible for the $500 Credit for Other Dependents only. Children already entered in the under-6 or ages 6–17 fields must not be entered again; that would double-count credits.',
  },
  {
    question: 'How is the effective tax rate calculated?',
    answer:
      'Effective tax rate = estimated federal income tax ÷ annual AGI × 100. It is not the marginal bracket rate. When AGI is $0, the rate fields show an em dash instead of dividing by zero. Under the AFP estimate, a negative tax (refundable CTC) can produce a negative effective rate.',
  },
  {
    question: 'Why might Biden-plan tax be negative?',
    answer:
      'The AFP would make the Child Tax Credit fully refundable. When refundable CTC exceeds ordinary tax after the nonrefundable ODC, the estimate shows a negative “income tax paid,” illustrating a net refund; matching the historical product copy about additional tax refunds.',
  },
];
