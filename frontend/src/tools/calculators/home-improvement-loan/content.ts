import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HOME_IMPROVEMENT_LOAN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-home-improvement-loan', label: 'What Is a Home Improvement Loan?' },
  { id: 'home-improvement-loan-formulas', label: 'Payment and APR Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'home-improvement-loan-faq', label: 'Frequently Asked Questions' },
];

export const HOME_IMPROVEMENT_LOAN_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the monthly payment calculated?',
    answer:
      'n = years × 12 + months, r = annual interest rate / 1200, and Monthly Payment = P × r / (1 − (1+r)^(−n)). If the interest rate is zero, Payment = P / n. Interest and repayment totals come from a full-precision amortization schedule.',
  },
  {
    question: 'How is APR different from the interest rate?',
    answer:
      'The interest rate is the contractual note rate. APR is a fee-adjusted annual percentage rate solved from cash flows: net proceeds = loan − application fee − home loan fees, against the scheduled monthly payments. APR = 12 × monthly IRR × 100. It is not the same as the nominal interest rate.',
  },
  {
    question: 'How do application fee % and application fee stay in sync?',
    answer:
      'Application Fee = Loan Amount × Fee% / 100. Editing the percent updates the amount; editing the amount updates the percent. Only the fee amount (not a second percent-derived fee) is counted in loan fees and APR.',
  },
  {
    question: 'Does changing currency convert the amounts?',
    answer:
      'Yes. Loan amount, application fee, and home loan fees each have their own currency. Mixed-currency fees are normalized into the loan currency before calculation using stored MongoDB exchange rates. Interest rate, term, and fee percentages are never converted. Stale rates warn; missing rates block conversion.',
  },
];
