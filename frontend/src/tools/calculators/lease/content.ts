import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LEASE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-lease', label: 'What Is a Lease Calculator?' },
  { id: 'lease-formulas', label: 'Lease Payment Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'lease-faq', label: 'Frequently Asked Questions' },
];

export const LEASE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the monthly lease payment calculated?',
    answer:
      'This tool uses a fixed-rate present-value lease model. With monthly rate i = APR/1200 and term n months, PMT = [(P − D) − R/(1+i)^n] × i / [1 − (1+i)^(−n)]. When the rate is zero, PMT = (P − D − R) / n. P is product value, D is down payment, and R is residual/buyout value.',
  },
  {
    question: 'What is residual value?',
    answer:
      'Residual value is the expected end-of-lease buyout (or remaining asset value). Enter it as money or as a percent of product value. Both fields stay linked when product value is known.',
  },
  {
    question: 'How are total payments, interest, and cost to own defined?',
    answer:
      'Total payments = down payment + (monthly payment × months). Total interest = total payments + residual − product value. Total cost to own = total payments + residual buyout. Ordinary lease installments exclude the buyout; cost to own includes it.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Product value, residual amount, down payment, and each result have independent currencies. Money amounts are normalized into the product currency before calculation using stored FX rates. Term, interest rate, and residual percent are never converted.',
  },
  {
    question: 'Are taxes, insurance, or mileage fees included?',
    answer:
      'No. The calculator estimates fixed-rate lease cash flows only. It does not add sales tax, insurance, registration, or mileage penalties.',
  },
];
