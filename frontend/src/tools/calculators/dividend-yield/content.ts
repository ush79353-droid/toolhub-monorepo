import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DIVIDEND_YIELD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-dividend-yield', label: 'What Is Dividend Yield?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'dividend-yield-formulas', label: 'Dividend Yield Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'dividend-yield-faq', label: 'Frequently Asked Questions' },
];

export const DIVIDEND_YIELD_FAQS: readonly FAQItem[] = [
  {
    question: 'How is dividend yield calculated?',
    answer:
      'Annual Dividends = Dividends per Period × Payments per Year. Dividend Yield (%) = Annual Dividends ÷ Share Price × 100. Use the same share unit for dividends and share price.',
  },
  {
    question: 'Which dividend frequencies are supported?',
    answer:
      'Annually (1), Semiannually (2), Quarterly (4), and Monthly (12). You must select a frequency before results appear: an unselected frequency does not invent a payment count.',
  },
  {
    question: 'Can dividends be zero?',
    answer:
      'Yes. Zero dividends produce zero annual dividends and a 0% yield when share price is positive. Share price must be greater than zero to compute yield.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Dividends per period, annual dividends, and share price each have independent currencies. Dividends and share price are normalized into one currency before the formulas run. Dividend yield % and frequency are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
];
