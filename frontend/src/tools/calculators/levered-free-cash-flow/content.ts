import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LEVERED_FCF_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-levered-fcf', label: 'What Is Levered Free Cash Flow?' },
  { id: 'levered-fcf-formula', label: 'Levered FCF Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'levered-fcf-faq', label: 'Frequently Asked Questions' },
];

export const LEVERED_FCF_FAQS: readonly FAQItem[] = [
  {
    question: 'How is levered free cash flow calculated here?',
    answer:
      'This tool uses a simplified estimate: Levered FCF = EBITDA − CapEx − Change in Working Capital − Mandatory Debt Repayments. CapEx and debt repayments are treated as positive outflows. Negative working-capital changes and negative results are allowed.',
  },
  {
    question: 'Is this the same as a full FCFE calculation?',
    answer:
      'No. This is a simplified cash-flow estimate, not a complete free cash flow to equity (FCFE) model. EBITDA excludes cash interest and taxes, so the result should not be treated as cash available to equity unless those effects are accounted for separately.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. EBITDA, CapEx, working-capital change, debt repayments, and the levered FCF result each have independent currencies. Inputs are normalized into the result currency before the formula runs. Missing rates block conversion; stale rates warn but still convert. Never assume a 1:1 exchange between different currencies.',
  },
  {
    question: 'What does a negative levered free cash flow mean?',
    answer:
      'A negative result means CapEx, working-capital investment, and mandatory debt repayments together exceed EBITDA for the period under this simplified model. That can happen during heavy investment or debt paydown cycles.',
  },
];
