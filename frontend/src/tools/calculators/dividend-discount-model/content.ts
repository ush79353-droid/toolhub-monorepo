import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DDM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-ddm', label: 'What Is the Dividend Discount Model?' },
  { id: 'ddm-formulas', label: 'DDM Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'ddm-faq', label: 'Frequently Asked Questions' },
];

export const DDM_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator compute?',
    answer:
      'It estimates a constant-growth (Gordon Growth) stock value: growth from ROE and payout, next-year dividend from D₀, cost of equity from CAPM, then P₀ = D₁ / (Ke − g).',
  },
  {
    question: 'Is dividend per share D₀ or D₁?',
    answer:
      'Dividend per share is the current annual dividend (D₀). Expected dividend is D₁ = D₀ × (1 + g).',
  },
  {
    question: 'Why must cost of equity exceed growth?',
    answer:
      'The Gordon Growth Model divides by (Ke − g). If Ke ≤ g, the denominator is zero or negative and a finite constant-growth price does not exist.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Dividend per share, expected dividend, and stock value each have an independent currency. Changing dividend currency converts D₀ with stored FX rates. Changing expected-dividend or stock-value currency only re-expresses D₁ or P₀ for display. Payout, ROE, growth, Rf, MRP, beta, and Ke are never converted.',
  },
];
