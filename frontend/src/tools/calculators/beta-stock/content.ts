import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BETA_STOCK_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-stock-beta', label: 'What Is Stock Beta?' },
  { id: 'stock-beta-formula', label: 'Stock Beta Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'beta-stock-faq', label: 'Frequently Asked Questions' },
];

export const BETA_STOCK_FAQS: readonly FAQItem[] = [
  {
    question: 'What is stock beta?',
    answer:
      'Stock beta (β) measures how an asset’s returns move relative to a benchmark. β = 1 means the asset moves with the market; above 1 is more volatile; below 1 is less; negative beta moves opposite the benchmark.',
  },
  {
    question: 'How is beta calculated here?',
    answer:
      'Daily percentage returns are computed for the asset and benchmark, then β = Cov(asset returns, benchmark returns) ÷ Var(benchmark returns). At least four price pairs are required.',
  },
  {
    question: 'Why must prices be positive?',
    answer:
      'Returns divide by the previous day’s price. Zero or negative prices make percentage returns undefined for this calculator.',
  },
  {
    question: 'When is beta undefined?',
    answer:
      'If benchmark returns have zero variance (the benchmark never changes in percentage terms across the sample), the denominator is zero and beta cannot be calculated.',
  },
];
