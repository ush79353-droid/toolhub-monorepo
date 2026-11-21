import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const STUDENT_LOAN_PAYMENT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-student-loan-payment', label: 'What This Calculator Estimates' },
  { id: 'student-loan-payment-formula', label: 'Payment & Fee Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'student-loan-payment-faq', label: 'Frequently Asked Questions' },
];

export const STUDENT_LOAN_PAYMENT_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the periodic payment calculated?',
    answer:
      'Financed principal includes the loan amount plus any loaned fees (and origination when rolled in). With periodic rate r and n payments: Payment = P × r / (1 − (1+r)^(−n)). When r = 0, Payment = P / n.',
  },
  {
    question: 'How do prepaid, loaned, and origination fees interact?',
    answer:
      'Prepaid fees are paid upfront and are not financed. Loaned fees are added to principal. Origination can be deducted from proceeds, rolled into the balance, or paid out of pocket; never double-counted across those modes.',
  },
  {
    question: 'How are APR and effective APR calculated?',
    answer:
      'Fee-inclusive APR solves net proceeds = (payment + prepaid/n) × annuity(r, n), then APR = r × payments per year. Effective APR = (1+r)^paymentsPerYear − 1.',
  },
  {
    question: 'Do currency selectors convert amounts?',
    answer:
      'Yes. Loan amount, prepaid fee, and loaned fee convert with stored MongoDB rates. Mixed currencies normalize into the loan-amount currency before amortization. Percentages, frequencies, and term are never converted.',
  },
];
