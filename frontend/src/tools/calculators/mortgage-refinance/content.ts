import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MORTGAGE_REFINANCE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-mortgage-refinance', label: 'What Is Mortgage Refinancing?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'mortgage-refinance-formulas', label: 'Refinance Formulas' },
  { id: 'points-cash-notes', label: 'Points, Costs, and Cash In/Out' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'mortgage-refinance-faq', label: 'Frequently Asked Questions' },
];

export const MORTGAGE_REFINANCE_FAQS: readonly FAQItem[] = [
  {
    question: 'How does this mortgage refinance calculator work?',
    answer:
      'It amortizes the original mortgage from its due date to the new loan’s first due date, then compares the remaining balance with a new fixed-rate loan. The summary shows principal, monthly payment, rate, term, total interest, and total payments, plus upfront refinancing cost, monthly savings, and break-even.',
  },
  {
    question: 'How are mortgage points and closing costs treated?',
    answer:
      'Points are a percent of the new principal (after cash in/out) and are paid upfront with other refinancing costs. They are not added to the new loan balance. New total payments include those upfront costs so the comparison is not only the sum of monthly installments.',
  },
  {
    question: 'What does cash in / out mean?',
    answer:
      'Positive cash out increases the new principal (you borrow extra cash. Negative cash in reduces the new principal) you pay money toward the balance at refinance. Zero leaves the remaining balance unchanged before the new rate and term.',
  },
  {
    question: 'How is break-even calculated?',
    answer:
      'Break-even is the first month when cumulative monthly payment savings cover the upfront points and closing costs. If the new payment is not lower, the refinance does not break even on monthly cash flow. Totals still use each loan’s own term, so a longer new term can lower the payment without lowering lifetime interest.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Original amount, refinancing costs, and cash in/out each have their own currency. Amounts are converted into the original-amount currency with stored Phase 2 FX rates before the math. Interest rates, points, dates, and loan terms are never converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Is this the same as Refinance Calculator or Car Refinance?',
    answer:
      'No. This tool is the mortgage refinance comparison on /tools/mortgage-refinance-calculator. General refinance, cash-out refinance, and car refinance remain separate catalog tools.',
  },
];
