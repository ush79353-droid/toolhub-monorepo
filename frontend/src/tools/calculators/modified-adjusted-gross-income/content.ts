import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MAGI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-magi', label: 'What Is MAGI?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'magi-formulas', label: 'Formulas' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'magi-faq', label: 'Frequently Asked Questions' },
];

export const MAGI_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator compute?',
    answer:
      'An illustrative simplified estimate: MAGI equals your entered AGI plus the sum of the listed adjustment amounts (after converting each into the AGI currency). It is educational math, not a filed tax return or program eligibility test.',
  },
  {
    question: 'Does this establish IRA, Roth, ACA, or education benefit eligibility?',
    answer:
      'No. MAGI rules differ by program and tax year. This tool does not apply IRS limits, phaseouts, or program-specific add-back lists. Confirm eligibility with official IRS publications or a tax professional.',
  },
  {
    question: 'Should I enter amounts already included in AGI?',
    answer:
      'Generally no. Double-counting inflates the estimate. Enter only qualifying add-backs your situation requires—amounts excluded from AGI that must be added back for the purpose you are exploring.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Each money field has an independent currency. Math normalizes adjustments into the AGI currency, then converts the MAGI result for display. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Why PKR defaults if MAGI is a US tax concept?',
    answer:
      'The reference layout uses independent selectors; defaults match that screenshot. IRS reporting typically uses USD and applicable tax-year exchange rules—live FX here is a calculator convenience, not IRS filing guidance.',
  },
];