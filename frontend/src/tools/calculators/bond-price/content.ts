import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BOND_PRICE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-bond-price', label: 'What Is Bond Price?' },
  { id: 'bond-price-formula', label: 'Bond Price Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'bond-price-faq', label: 'Frequently Asked Questions' },
];

export const BOND_PRICE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the bond price calculated?',
    answer:
      'Annual Coupon = Face Value × (Annual Coupon Rate / 100). Coupon per period = Annual Coupon ÷ payments per year (m). With N = years × m coupon periods and annual YTM y, the clean price is the present value of each coupon plus the present value of face value: P = Σ (F r / m) / (1 + y/m)^t + F / (1 + y/m)^N. When YTM is zero, P = coupon per period × N + face value.',
  },
  {
    question: 'What assumption does this calculator make about coupon dates?',
    answer:
      'It prices on a regular coupon date (clean price): settlement coincides with a coupon payment, so there is no accrued interest. Years × coupon frequency must equal a whole number of periods. Fractional coupon periods are rejected rather than approximated.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Face value is the calculation currency. Coupon per period, annual coupon, and bond price each have independent result currencies. Changing the face currency converts the face amount using MongoDB-backed rates. Changing a result currency only re-expresses that output. Coupon rate %, YTM %, years, and frequency are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Can the coupon rate or YTM be zero?',
    answer:
      'Yes. A zero coupon rate yields zero coupons and prices the discounted face value only. A zero YTM uses the undiscounted sum of remaining coupons plus face value. Negative rates are rejected.',
  },
];
