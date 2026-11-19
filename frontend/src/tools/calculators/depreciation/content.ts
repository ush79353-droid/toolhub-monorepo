import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DEPRECIATION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-depreciation', label: 'What Is Depreciation?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'depreciation-methods', label: 'Depreciation Methods' },
  { id: 'depreciation-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'depreciation-faq', label: 'Frequently Asked Questions' },
];

export const DEPRECIATION_FAQS: readonly FAQItem[] = [
  {
    question: 'Is depreciation expense the same as accumulated depreciation?',
    answer:
      'No. Depreciation expense here is the expense for the selected year only. Accumulated depreciation is the sum of expense through that year. End book value equals original cost minus accumulated depreciation (floored at salvage).',
  },
  {
    question: 'What declining-balance rate is used?',
    answer:
      'When you choose declining balance, you set the annual rate percent. The default is the double-declining convention: 200% ÷ useful life (for a 5-year life, 40%). You can edit the rate; the calculator does not invent an unstated rate.',
  },
  {
    question: 'Can book value fall below salvage?',
    answer:
      'No. Each method caps depreciation so ending book value never goes below salvage value.',
  },
  {
    question: 'Are partial years supported?',
    answer:
      'No. Lifetime and “end book value after” must be whole years within the useful life.',
  },
  {
    question: 'How do the currency selectors work?',
    answer:
      'Original cost, salvage, depreciation expense, and end book value each have an independent currency. Cost and salvage are normalized before calculating. Results convert for display. Lifetime, selected years, and rates never convert.',
  },
  {
    question: 'How is this different from the Accumulated Depreciation Calculator?',
    answer:
      'This tool reports selected-year expense plus end book value for three methods with Phase 2 FX. The Accumulated Depreciation Calculator focuses on cumulative depreciation (and includes units of production) with denomination-only currency.',
  },
];
