import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LOAN_PAYMENT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-loan-payment', label: 'What Is a Loan Payment?' },
  { id: 'loan-payment-formula', label: 'Loan Payment Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'loan-payment-faq', label: 'Frequently Asked Questions' },
];

export const LOAN_PAYMENT_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the periodic loan payment calculated?',
    answer:
      'Installments n = (years + months/12) × payments per year. The periodic rate r is the nominal annual rate divided by payments per year. Payment = P × r / (1 − (1+r)^(-n)). When the rate is zero, Payment = P / n. Loan payment total = Payment × n.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Loan amount, periodic loan payment, and loan payment total each have independent currencies. Changing the loan currency converts that principal using MongoDB-backed rates. Changing a result currency only re-expresses that money result. Annual rate, periodic rate, term, and installment counts are never FX-converted.',
  },
  {
    question: 'What payment frequencies are supported?',
    answer:
      'Yearly (default), Semi-annually, Quarterly, Monthly, Biweekly, and Weekly. The selected frequency sets both the installment count and the periodic interest rate.',
  },
  {
    question: 'Is this the same as the Payment Calculator?',
    answer:
      'No. This Loan Payment Calculator is a compact amortizing payment tool with payment frequency and independent FX on three money fields. The separate Payment Calculator focuses on fixed-term / fixed-payment modes with schedules in USD.',
  },
];
