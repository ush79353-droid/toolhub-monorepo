import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const OCF_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-operating-cash-flow', label: 'What Is Operating Cash Flow?' },
  { id: 'ocf-formula', label: 'Operating Cash Flow Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'ocf-faq', label: 'Frequently Asked Questions' },
];

export const OCF_FAQS: readonly FAQItem[] = [
  {
    question: 'How is operating cash flow calculated here?',
    answer:
      'This tool uses the indirect method. Working-capital cash adjustment = −ΔInventories − ΔAccounts receivable + ΔAccounts payable + ΔIncome tax payable (ending − beginning). Operating cash flow = Net income + Depreciation + Amortization + Working-capital cash adjustment + Net other operating cash flows. Negative results are allowed.',
  },
  {
    question: 'Is “Income tax payable” a balance or a change?',
    answer:
      'Enter the change in income tax payable (ending balance minus beginning balance), not an absolute tax-payable balance. Treating a stock balance as a cash adjustment would misstate operating cash flow.',
  },
  {
    question: 'What does “Change in operating working capital” show?',
    answer:
      'It shows the working-capital cash adjustment added in the OCF formula: −ΔInv − ΔAR + ΔAP + ΔTax payable. That is the cash-flow impact of those balance changes, not the unsigned sum of the balance deltas.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Every money field has an independent currency. Inputs are normalized into the operating cash flow currency before the formulas run. The WC result can be shown in its own currency. Missing rates block conversion; stale rates warn but still convert. Never assume a 1:1 exchange between different currencies.',
  },
];
