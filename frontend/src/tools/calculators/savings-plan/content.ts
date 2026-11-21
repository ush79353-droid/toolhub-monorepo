import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SAVINGS_PLAN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-a-savings-plan', label: 'What Is a Savings Plan?' },
  { id: 'savings-plan-formula', label: 'Savings Plan Formula' },
  { id: 'fixed-vs-target-modes', label: 'Fixed Deposit vs Target Balance' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'savings-plan-faq', label: 'Frequently Asked Questions' },
];

export const SAVINGS_PLAN_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the final balance calculated?',
    answer:
      'With a starting deposit A, an arithmetic increase G each period, and n periods, the total is n × A + G × n × (n − 1) / 2. There is no interest in this calculator; only principal from deposits.',
  },
  {
    question: 'What does “repeatedly increased by” mean?',
    answer:
      'Each period’s deposit grows by a fixed monetary amount G. Period 1 deposits A, period 2 deposits A+G, period 3 deposits A+2G, and so on. Set G to 0 for a fixed deposit every period.',
  },
  {
    question: 'What happens in “given final balance” mode?',
    answer:
      'You enter the target principal balance and the increase G. The calculator reverse-solves the required starting deposit A = (T − G × n × (n − 1) / 2) / n. If that starting deposit would be negative, the goal is unreachable with the chosen growth and period count.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Deposit, increase, and target each have independent currencies. Amounts are normalized into the deposit (or target) currency with stored FX rates before the arithmetic series runs. Durations and period counts never convert. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Is interest included?',
    answer:
      'No. This tool models principal contributions only. It does not invent an interest rate. Use a dedicated compound-interest or savings calculator when you need growth from yield.',
  },
];
