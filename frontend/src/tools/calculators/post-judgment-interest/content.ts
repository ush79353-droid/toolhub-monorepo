import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const POST_JUDGMENT_INTEREST_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-post-judgment-interest', label: 'What Is Post-Judgment Interest?' },
  { id: 'post-judgment-formula', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'post-judgment-faq', label: 'Frequently Asked Questions' },
];

export const POST_JUDGMENT_INTEREST_FAQS: readonly FAQItem[] = [
  {
    question: 'How is accumulated interest calculated?',
    answer:
      'Using simple annual interest on a 365-day year: Accumulated Interest = Judgment Amount × (Annual Rate / 100) × (Elapsed Days / 365). Elapsed days are civil calendar days from the judgment date to the writ date.',
  },
  {
    question: 'How is time passed shown?',
    answer:
      'Elapsed days are converted to whole weeks plus leftover days (for example, 10 days → 1 week and 3 days). Same-day dates produce 0 days and $0.00 interest.',
  },
  {
    question: 'Does this tool look up the legal interest rate?',
    answer:
      'No. Enter the applicable statutory or contractual rate yourself. The page links to the Federal Reserve website as a reference starting point only.',
  },
  {
    question: 'Is the currency convertible?',
    answer:
      'No. Judgment amount and accumulated interest are fixed USD ($) for this calculator. Percentages and dates are never converted.',
  },
];
