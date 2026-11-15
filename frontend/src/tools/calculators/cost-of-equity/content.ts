import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const COST_OF_EQUITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-cost-of-equity', label: 'What Is Cost of Equity?' },
  { id: 'cost-of-equity-formula', label: 'Dividend Growth Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'cost-of-equity-faq', label: 'Frequently Asked Questions' },
];

export const COST_OF_EQUITY_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator compute?',
    answer:
      'For dividend-paying companies it estimates cost of equity with the Dividend Growth (Gordon Growth) Model: (D₁ / P₀) + g.',
  },
  {
    question: 'Is the dividend D₀ or D₁?',
    answer:
      'Dividend per share is treated as the expected next-year dividend (D₁). Example: D₁ = 5, price = 100, growth = 4% → cost of equity = 9%.',
  },
  {
    question: 'What about companies that do not pay a dividend?',
    answer:
      'The reference screenshot does not confirm non-dividend inputs. That mode is not calculated here. CAPM (Rf, Rm, beta) is available in the separate CAPM Calculator.',
  },
  {
    question: 'Can dividend growth be zero?',
    answer:
      'Yes. With zero growth, cost of equity equals the dividend yield (D₁ / P₀) as a percent.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the currency label and grouping. Enter money fields already in the selected currency.',
  },
];
