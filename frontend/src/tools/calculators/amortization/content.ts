import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '../auto-loan/TableOfContents';

export const AMORTIZATION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-an-amortization-calculator', label: 'What Is an Amortization Calculator?' },
  { id: 'what-is-an-amortized-loan', label: 'What Is an Amortized Loan?' },
  { id: 'how-loan-amortization-works', label: 'How Loan Amortization Works' },
  { id: 'amortization-formula', label: 'The Amortization Payment Formula' },
  { id: 'how-to-calculate-monthly-payments', label: 'How to Calculate Monthly Payments' },
  { id: 'loan-amortization-schedule', label: 'Reading an Amortization Schedule' },
  { id: 'principal-vs-interest', label: 'Principal vs. Interest Breakdown' },
  { id: 'compounding-vs-payment-frequency', label: 'Compounding Frequency vs. Payment Frequency' },
  { id: 'how-extra-payments-affect-amortization', label: 'How Extra Payments Accelerate Payoff' },
  { id: 'how-to-pay-off-a-loan-faster', label: '5 Strategies to Pay Off Loans Faster' },
  { id: 'amortization-examples', label: 'Step-by-Step Worked Example' },
  { id: 'fixed-rate-vs-variable-rate', label: 'Fixed-Rate vs. Variable-Rate Loans' },
  { id: 'common-amortization-mistakes', label: 'Common Amortization Pitfalls' },
  { id: 'frequently-asked-questions', label: 'Frequently Asked Questions' },
] as const;

export const AMORTIZATION_FAQS: readonly FAQItem[] = [
  {
    question: 'What is loan amortization?',
    answer:
      'Loan amortization is the process of spreading out a loan into a series of equal, periodic payments over a designated term. Each payment is split between the interest charged by the lender and the principal balance owed. Over time, the interest portion gradually decreases while the principal portion increases until the debt reaches zero.',
  },
  {
    question: 'How is the monthly payment calculated on an amortized loan?',
    answer:
      'The fixed monthly payment is calculated using the annuity formula: P = L · [r(1 + r)ⁿ] / [(1 + r)ⁿ - 1], where L is the loan amount, r is the effective periodic interest rate, and n is the total number of scheduled payments. For zero-interest loans, the payment is simply the loan amount divided by the number of installments.',
  },
  {
    question: 'What is the difference between compounding frequency and payment frequency?',
    answer:
      'Payment frequency is how often you submit money to the lender (e.g., monthly, biweekly, or weekly). Compounding frequency is how often the lender calculates and capitalizes accrued interest on the outstanding principal balance. When compounding occurs more frequently than payments (e.g., daily compounding with monthly payments), the effective periodic interest rate is slightly higher than the simple nominal rate divided by 12.',
  },
  {
    question: 'How do extra payments reduce my total loan cost?',
    answer:
      'Because interest is calculated strictly on the current unpaid principal balance, extra payments reduce the balance immediately. In a reduce-term loan strategy (the standard convention), regular monthly payments remain the same, which rapidly increases the percentage of every subsequent payment that goes toward principal, shaving months or years off your debt and saving significant interest.',
  },
  {
    question: 'Why is the interest portion so high at the beginning of a loan?',
    answer:
      'Interest is computed as: Interest = Outstanding Balance × Periodic Rate. In the early stages of a loan, your principal balance is at its highest, which generates the largest interest charge. As payments chip away at the principal, the remaining balance shrinks, causing the periodic interest fee to decline and leaving more of your payment to extinguish principal.',
  },
  {
    question: 'Can I use this calculator for mortgages, auto loans, and personal loans?',
    answer:
      'Yes. This calculator applies to any fixed-rate fully amortizing consumer or commercial loan, including conventional mortgages, auto loans, student loans, and unsecured personal financing. For mortgages with escrow accounts (property tax and insurance), those fees are added on top of the principal and interest payment calculated here.',
  },
  {
    question: 'What happens to the final payment on an amortization schedule?',
    answer:
      'Because intermediate interest charges are rounded to the nearest cent on each billing cycle, tiny penny rounding discrepancies can emerge over long terms (such as 360 months). In institutional banking, the final scheduled payment is automatically adjusted by a few cents so that the ending balance lands at exactly $0.00.',
  },
  {
    question: 'Does changing the currency change the math or exchange rates?',
    answer:
      'No. The currency selector changes the display denomination and formatting symbols only. All calculations remain numerically identical regardless of whether USD, EUR, GBP, CAD, or PKR is selected.',
  },
] as const;
