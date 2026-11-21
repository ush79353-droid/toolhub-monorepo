import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CASH_FLOW_TO_DEBT_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-cash-flow-to-debt-ratio', label: 'What Is Cash Flow to Debt Ratio?' },
  { id: 'cash-flow-to-debt-ratio-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'cash-flow-to-debt-ratio-faq', label: 'Frequently Asked Questions' },
];

export const CASH_FLOW_TO_DEBT_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'How are the ratios calculated?',
    answer:
      'Cash Flow to Debt Ratio (%) = Operating Cash Flow ÷ Total Debt × 100. Debt to Cash Flow Ratio = Total Debt ÷ Operating Cash Flow (a dimensionless multiple). Amounts normalize into the total-debt currency first. Percentages and multiples are never FX-converted.',
  },
  {
    question: 'What if total debt or operating cash flow is zero?',
    answer:
      'If total debt is zero, cash flow to debt is undefined (not Infinity). If operating cash flow is zero, debt to cash flow is undefined. Zero debt with positive OCF still shows debt-to-cash-flow as 0x when OCF ≠ 0.',
  },
  {
    question: 'Can operating cash flow be negative?',
    answer:
      'Yes. Negative OCF produces a negative cash-flow-to-debt percentage and a negative debt-to-cash-flow multiple when debt is positive. That signals cash burn relative to leverage, not a formatting error.',
  },
  {
    question: 'How do total debt components work?',
    answer:
      'When expanded, total debt = short-term debt + long-term debt (same pattern as Debt to Asset Ratio). Components are normalized into the total-debt currency and are not double-counted with a separate total.',
  },
];
