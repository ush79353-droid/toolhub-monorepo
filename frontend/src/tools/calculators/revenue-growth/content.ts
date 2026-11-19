import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const REVENUE_GROWTH_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-revenue-growth', label: 'What Is Revenue Growth?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'revenue-growth-faq', label: 'Frequently Asked Questions' },
];

export const REVENUE_GROWTH_FAQS: readonly FAQItem[] = [
  {
    question: 'How is total revenue growth calculated?',
    answer:
      'Total Growth (%) = (Final Revenue − Initial Revenue) / Initial Revenue × 100. Initial revenue must be nonzero. Zero and negative total growth are allowed when mathematically valid.',
  },
  {
    question: 'How is the revenue growth rate per period calculated?',
    answer:
      'Growth Rate (%) = [(Final / Initial)^(1 / Periods) − 1] × 100. Initial and final revenues must be positive, and the number of periods must be positive. This is the compound growth rate between the two revenues.',
  },
  {
    question: 'Are the two sections independent?',
    answer:
      'Yes. Total growth and compound growth rate use separate initial/final inputs so you can model each question without overwriting the other.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Within each section, initial and final revenues can use independent currencies. Math normalizes into the section’s initial currency. Percentages and period counts never FX-convert.',
  },
];
