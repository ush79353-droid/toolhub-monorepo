import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BOND_CONVEXITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-bond-convexity', label: 'What Is Bond Convexity?' },
  { id: 'bond-convexity-formulas', label: 'Bond Convexity Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'bond-convexity-faq', label: 'Frequently Asked Questions' },
];

export const BOND_CONVEXITY_FAQS: readonly FAQItem[] = [
  {
    question: 'How are coupon per period and annual coupon calculated?',
    answer:
      'Annual Coupon = Face Value × (Annual Coupon Rate / 100). Coupon Per Period = Annual Coupon ÷ Payments Per Year. A zero coupon rate is valid and yields a zero coupon (zero-coupon bond cash flows are the face value at maturity only).',
  },
  {
    question: 'How is bond price calculated?',
    answer:
      'Bond price is the present value of future coupon payments plus the present value of face value, discounted at the periodic yield r = YTM / payments per year. When r = 0, price = coupon × periods + face. Yield shifts that make 1 + r ≤ 0 are rejected.',
  },
  {
    question: 'Is this analytic Macaulay convexity?',
    answer:
      'No. This calculator reports finite-difference (effective) convexity: (P₋ + P₊ − 2P₀) / (P₀ (Δy)²), where annual yields are shifted by the entered yield differential in decimal units. Analytic Macaulay / modified convexity formulas are not used.',
  },
  {
    question: 'Why must the yield differential be greater than zero?',
    answer:
      'The finite-difference formula divides by (Δy)². A zero differential is undefined. Enter a small positive percent such as 0.01 (one basis point).',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Face value, coupon per period, annual coupon, and bond price each have independent currencies. Changing the face currency converts face value using MongoDB-backed rates. Changing a result currency only re-expresses that money output. Coupon rate %, YTM %, years, frequency, and dimensionless convexity are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
];
