import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DEBT_TO_EQUITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-debt-to-equity', label: 'What Is the Debt to Equity Ratio?' },
  { id: 'debt-to-equity-formula', label: 'Debt to Equity Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'debt-to-equity-faq', label: 'Frequently Asked Questions' },
];

export const DEBT_TO_EQUITY_FAQS: readonly FAQItem[] = [
  {
    question: 'What does the debt to equity (D/E) ratio measure?',
    answer:
      "It compares total liabilities with stockholders' equity. A higher ratio means more leverage relative to equity. This calculator uses total liabilities (D), not interest-bearing debt only.",
  },
  {
    question: "Can stockholders' equity be zero or negative?",
    answer:
      "Zero equity is rejected so the calculator never shows Infinity or NaN. Negative equity is allowed and can produce a negative ratio when liabilities are positive.",
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      "Yes. Total liabilities and stockholders' equity each have an independent currency. Changing a field’s currency converts that amount using the stored exchange-rate snapshot. Equity is normalized into the liabilities currency before dividing, so a currency-only change does not alter the D/E ratio. The ratio itself is dimensionless and is never converted. If rates are unavailable, cross-currency switching is blocked.",
  },
];
