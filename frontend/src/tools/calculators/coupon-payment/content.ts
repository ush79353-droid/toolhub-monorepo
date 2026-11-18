import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const COUPON_PAYMENT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-coupon-payment', label: 'What Is a Coupon Payment?' },
  { id: 'coupon-payment-formula', label: 'Coupon Payment Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'coupon-payment-faq', label: 'Frequently Asked Questions' },
];

export const COUPON_PAYMENT_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the coupon payment calculated?',
    answer:
      'Annual Coupon = Face Value × (Annual Coupon Rate / 100). Coupon Payment = Annual Coupon ÷ Number of Payments Per Annum. A zero coupon rate yields a zero payment when other inputs are valid.',
  },
  {
    question: 'What is current yield?',
    answer:
      'Current Yield (%) = Annual Coupon ÷ Market Price × 100. Expand the Current yield section, enter a positive market price in the face-value currency, and the yield appears. Market price is optional and does not affect the periodic coupon payment.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Face value and coupon payment each have independent currencies. Changing the face currency converts face value and market price using MongoDB-backed rates. Changing the result currency only re-expresses the coupon payment. Coupon rate %, payment count, and current yield % are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Does this include accrued interest or dirty price?',
    answer:
      'No. This tool reports the contractual periodic coupon and an optional clean current yield from market price. It does not schedule settlement dates or accrued interest.',
  },
];
