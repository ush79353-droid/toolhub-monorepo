import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const REPAYMENT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Introduction' },
  { id: 'what-is', label: 'What Is Loan Repayment?' },
  { id: 'fixed-term', label: 'Fixed Loan Term' },
  { id: 'fixed-installment', label: 'Fixed Installments' },
  { id: 'loan-types', label: 'Common Loan Types' },
  { id: 'repay-faster', label: 'How to Repay Loans Faster' },
  { id: 'how-payment', label: 'How Is a Loan Payment Calculated?' },
  { id: 'compounding', label: 'How Does Compounding Affect Repayment?' },
  { id: 'frequency', label: 'Payment Frequency and Interest' },
  { id: 'amortization', label: 'What Is an Amortization Schedule?' },
  { id: 'too-small', label: 'What If the Payment Is Too Small?' },
  { id: 'compare-modes', label: 'Fixed-Term vs Fixed-Installment' },
  { id: 'reduce-interest', label: 'How Can I Reduce Total Interest?' },
  { id: 'rep-faq', label: 'Frequently Asked Questions' },
];

export const REPAYMENT_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I calculate a monthly loan repayment?',
    answer:
      'Convert the annual rate to a monthly effective rate, find n months in the term, then A = P·i/(1−(1+i)^−n). With zero interest, A = P/n.',
  },
  {
    question:
      'How much is the monthly payment on a $10,000 loan at 10% for five years?',
    answer:
      'About $212.47 per month with monthly compounding and payments (60 installments; total interest about $2,748).',
  },
  {
    question: 'What is a fixed repayment term?',
    answer:
      'You choose how long the loan should last; the calculator solves for the constant installment that pays it off in that time.',
  },
  {
    question: 'What is a fixed installment?',
    answer:
      'You choose how much to pay each period; the calculator estimates how many payments (and a smaller final payment if needed) clear the balance.',
  },
  {
    question: 'Can I calculate how long it will take to repay a loan?',
    answer:
      'Yes — use fixed-installment mode with your planned payment amount.',
  },
  {
    question: 'Does paying more reduce total interest?',
    answer:
      'Usually yes, when extra amounts reduce principal sooner and contract terms allow prepayment without offsetting penalties.',
  },
  {
    question: 'What happens if my installment is less than the interest?',
    answer:
      'Under a constant-rate model the balance does not amortize. Increase the payment above periodic interest.',
  },
  {
    question: 'Can I repay a loan early?',
    answer:
      'Many loans allow early payoff; check for prepayment penalties and how extra payments are applied to principal.',
  },
  {
    question: 'Is weekly repayment better than monthly repayment?',
    answer:
      'It depends on effective rates, total cash paid, and when payments are credited — not automatically better in every case.',
  },
  {
    question: 'What is the difference between APR and interest rate?',
    answer:
      'A nominal rate is the stated annual percentage. APR may fold in certain fees. This calculator uses the stated rate with compounding/payment conversion, not a fee-inclusive APR solver.',
  },
  {
    question: 'Does this calculator include loan fees?',
    answer:
      'No. Origination fees, insurance, penalties, and taxes are not added automatically.',
  },
  {
    question: 'What is an amortization table?',
    answer:
      'A payment-by-payment list of installment, interest, principal, and remaining balance.',
  },
  {
    question: 'Can this calculator be used for mortgages?',
    answer:
      'Yes for standard fixed-rate amortizing principal-and-interest schedules. Taxes/insurance (PITI) are separate.',
  },
  {
    question: 'Does it support variable interest rates?',
    answer:
      'The core model assumes a constant rate. Re-run with updated rates for what-if scenarios.',
  },
  {
    question: 'Why is my final installment different?',
    answer:
      'Rounding and the remaining balance usually make the last payment slightly smaller (or adjusted) so the loan clears to zero.',
  },
];
