import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const INTEREST_RATE_PARITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-irp', label: 'What Is Interest Rate Parity?' },
  { id: 'irp-formulas', label: 'IRP Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'irp-faq', label: 'Frequently Asked Questions' },
];

export const INTEREST_RATE_PARITY_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the spot price quoted?',
    answer:
      'As price-currency units per one base-currency unit (for example USD per EUR when USD is the price currency and EUR is the base). Keep that orientation when reading the forward or expected future spot.',
  },
  {
    question: 'How are annualised and period rates linked?',
    answer:
      'Using a 360-day money-market convention: period % = annualised % × (days / 360). Editing either field updates the other; changing days re-derives the dependent field from the last-edited source.',
  },
  {
    question: 'What is the difference between covered and uncovered?',
    answer:
      'Covered IRP gives a no-arbitrage forward quote: F = S × (1 + r_price) / (1 + r_base). Uncovered IRP estimates an expected future spot: E[S] = S × (1 + (r_price − r_base)). Uncovered is not a locked forward contract price.',
  },
  {
    question: 'Do the currency selectors convert the FX quote?',
    answer:
      'They select the quote (price) currency of the rate. Changing the spot currency re-quotes that number with stored MongoDB FX while keeping the same implied base. The forward selector only re-expresses the calculated quote once. Interest percentages and contract days never convert.',
  },
];
