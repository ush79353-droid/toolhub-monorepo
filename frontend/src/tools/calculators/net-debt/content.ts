import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NET_DEBT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-net-debt', label: 'What Is Net Debt?' },
  { id: 'net-debt-formula', label: 'Net Debt Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'net-debt-faq', label: 'Frequently Asked Questions' },
];

export const NET_DEBT_FAQS: readonly FAQItem[] = [
  {
    question: 'How is net debt calculated?',
    answer:
      'Cash and cash equivalents = cash + cash equivalents. Short-term debt and long-term debt are sums of their line items. Net debt = short-term debt + long-term debt − cash and cash equivalents. A negative result means cash exceeds total debt.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Each money field has an independent currency. Mixed currencies normalize into the cash currency before addition. Section totals and net debt can display in other currencies using stored FX rates.',
  },
  {
    question: 'What happens if a line is blank?',
    answer:
      'Blank money lines are treated as zero so you can leave optional items empty without breaking the totals.',
  },
  {
    question: 'Are contingent liabilities or equity included?',
    answer:
      'No. This calculator only sums the cash and debt line items shown. It is a balance-sheet style estimate, not a full enterprise valuation.',
  },
];
