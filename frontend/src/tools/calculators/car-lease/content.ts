import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CAR_LEASE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-car-lease', label: 'What Is a Car Lease Payment?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'car-lease-formula', label: 'Money-Factor Lease Formulas' },
  { id: 'fees-and-tax', label: 'Fees Financed & Monthly Tax' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'car-lease-faq', label: 'Frequently Asked Questions' },
];

export const CAR_LEASE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the monthly lease payment calculated?',
    answer:
      'Residual value equals MSRP × residual factor ÷ 100. Net capitalized cost equals negotiated price plus dealer and registration fees minus down payment, trade-in, and other reductions. Monthly depreciation is (net cap − residual) ÷ months. Monthly lease fee is (net cap + residual) × money factor. Base payment is depreciation + lease fee; monthly sales tax is base × tax%; total payment is base + tax.',
  },
  {
    question: 'Are dealer and registration fees financed into the lease?',
    answer:
      'Yes. This calculator assumes dealer fee and registration fee are added into the net capitalized cost. Down payment, trade-in, and other reductions are subtracted once; they are not applied again as upfront credits outside the payment.',
  },
  {
    question: 'How is sales tax applied?',
    answer:
      'Sales tax is applied monthly to the base (pre-tax) payment: monthly sales tax = base × sales tax % ÷ 100. No extra acquisition tax or local penalties are invented.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Money fields use independent currencies. Lease math normalizes MSRP, negotiated price, fees, and reductions into the negotiated-price currency at full precision; each result converts for display. Sales tax %, residual factor, money factor, and lease term never convert. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'What happens with a zero money factor or zero tax?',
    answer:
      'Zero money factor produces a zero monthly lease fee. Zero sales tax produces a zero monthly tax and a payment equal to the base payment. Negative or non-finite payments are rejected instead of clamped.',
  },
];
