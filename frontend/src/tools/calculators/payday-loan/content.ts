import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PAYDAY_LOAN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-payday-loan-apr', label: 'What Is Payday Loan APR?' },
  { id: 'payday-loan-formula', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'payday-loan-faq', label: 'Frequently Asked Questions' },
];

export const PAYDAY_LOAN_FAQS: readonly FAQItem[] = [
  {
    question: 'How is APR calculated?',
    answer:
      'This tool uses a simple annualized APR: (finance charge ÷ loan amount) × (365 ÷ days) × 100. It is not a compound APY and does not use a 360-day broker year.',
  },
  {
    question: 'What is APR amount?',
    answer:
      'APR amount is the annualized monetary finance charge: finance charge × (365 ÷ days). It re-expresses the term finance charge as a yearly amount and is not added again into total debt.',
  },
  {
    question: 'How are monthly fees handled?',
    answer:
      'Monthly fee = loan amount × (monthly fee percent ÷ 100). The reference did not confirm multi-month proration, so this tool adds one fee assessment to total debt. Total debt = loan + finance charge + that monthly fee.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Loan amount and finance charge convert on currency change using stored rates. APR amount, monthly fee, and total debt currencies only re-express calculated results. APR % and monthly fee % never convert.',
  },
];
