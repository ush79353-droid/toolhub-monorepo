import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FCFF_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-fcff', label: 'What Is FCFF?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'fcff-formulas', label: 'FCFF Formulas by Source' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'fcff-faq', label: 'Frequently Asked Questions' },
];

export const FCFF_FAQS: readonly FAQItem[] = [
  {
    question: 'What is free cash flow to firm (FCFF)?',
    answer:
      'FCFF is the cash flow available to all capital providers (equity and debt) after operating expenses, taxes, and investments in fixed and working capital. This calculator builds FCFF from net income, EBITDA, EBIT, or CFO with matching tax and investment adjustments.',
  },
  {
    question: 'Which source should I choose?',
    answer:
      'Use Net income when you start from the bottom of the income statement. Use EBITDA or EBIT when you start before interest (and for EBITDA, before D&A). Use CFO when you already have operating cash flow after working-capital changes — then ΔNWC is not deducted again.',
  },
  {
    question: 'How are CapEx and working capital investment treated?',
    answer:
      'Enter fixed capital investment (CapEx) and working capital investment (ΔNWC) as positive amounts when they are cash outflows. Negative ΔNWC (a working-capital release) increases FCFF. CFO mode does not subtract ΔNWC again.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Source value, D&A, interest, CapEx, ΔNWC, and FCFF each have independent currencies. Money fields are normalized into the FCFF currency before the formula runs. Corporate tax % is never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
];
