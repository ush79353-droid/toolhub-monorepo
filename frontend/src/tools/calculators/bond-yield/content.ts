import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BOND_YIELD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-bond-yield', label: 'What Is Bond Yield to Maturity?' },
  { id: 'bond-yield-formula', label: 'Yield to Maturity Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'bond-yield-faq', label: 'Frequently Asked Questions' },
];

export const BOND_YIELD_FAQS: readonly FAQItem[] = [
  {
    question: 'Is this current yield or yield to maturity?',
    answer:
      'This calculator solves annual nominal yield to maturity (YTM) from the coupon-date price equation. It is not current yield (annual coupon ÷ price). Current yield ignores the pull to par at maturity.',
  },
  {
    question: 'How is YTM solved?',
    answer:
      'The bond price equals the present value of remaining coupons plus face value, discounted at y/m each period. The calculator uses a bounded bisection root finder on that equation. Zero-coupon bonds use the closed-form y = m × ((F/P)^(1/N) − 1).',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Face value and bond price each have independent currencies. Changing either converts that money amount with MongoDB-backed rates. Before solving, bond price is normalized into the face-value currency. Coupon rate %, frequency, years, and bond yield % are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Why must years × frequency be a whole number?',
    answer:
      'Valuation is assumed on a coupon payment date with regular full coupon periods, so N = years × payments per year must be a positive integer. Fractional leftover periods (accrued interest / dirty price) are not modeled.',
  },
];
