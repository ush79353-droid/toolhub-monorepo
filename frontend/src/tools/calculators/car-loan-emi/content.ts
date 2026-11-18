import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CAR_LOAN_EMI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-car-loan-emi', label: 'What Is a Car Loan EMI?' },
  { id: 'car-loan-emi-formula', label: 'Car Loan EMI Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'car-loan-emi-faq', label: 'Frequently Asked Questions' },
];

export const CAR_LOAN_EMI_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the loan amount calculated?',
    answer:
      'Sales tax amount = car price × (sales tax % / 100). Loan amount = car price + sales tax amount − money you have − trade-in value. When those money fields use different currencies, each amount is converted into the loan-amount currency with stored MongoDB exchange rates before the arithmetic.',
  },
  {
    question: 'How is the monthly EMI calculated?',
    answer:
      'Using a fixed-rate amortizing loan: n = years × 12 + months, r = APR / 1200, Monthly Payment = P × r / (1 − (1 + r)^(−n)). When the rate is zero, Monthly Payment = P / n. Total interest = Monthly Payment × n − P.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Car price, money you have, trade-in, loan amount, monthly payment, and total interest each have independent currencies. Mixed inputs normalize into the loan-amount currency before EMI math. Sales tax %, interest rate, and term never convert. Stale rates warn; missing rates block conversion.',
  },
  {
    question: 'Are insurance, registration, or dealer fees included?',
    answer:
      'No. This calculator estimates financed principal and principal-and-interest EMI from car price, cash on hand, trade-in, sales tax %, rate, and term only.',
  },
];
