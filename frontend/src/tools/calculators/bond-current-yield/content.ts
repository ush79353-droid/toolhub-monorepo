import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BOND_CURRENT_YIELD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-current-yield', label: 'What Is Bond Current Yield?' },
  { id: 'current-yield-formulas', label: 'Current Yield Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'bond-current-yield-faq', label: 'Frequently Asked Questions' },
];

export const BOND_CURRENT_YIELD_FAQS: readonly FAQItem[] = [
  {
    question: 'How is current yield calculated?',
    answer:
      'Annual Coupon = Face Value × (Coupon Rate / 100). Coupon Per Period = Annual Coupon ÷ Payments Per Year (1, 2, 4, or 12). Current Yield (%) = Annual Coupon ÷ Bond Price × 100. A zero coupon rate is allowed and yields a 0% current yield when the bond price is positive.',
  },
  {
    question: 'Is current yield the same as yield to maturity (YTM)?',
    answer:
      'No. Current yield only compares the annual coupon with the bond’s market price. It ignores purchase discount or premium amortization, remaining maturity, and reinvestment assumptions that YTM includes.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Face value, bond price, coupon per period, and annual coupon each have independent currencies. Face value and bond price are normalized into the face-value currency before the formulas run. Output selectors only re-express coupon amounts. Frequency, coupon rate %, and current yield % are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Does this price accrued interest or dirty price?',
    answer:
      'No. Enter a clean market price for current yield. This tool does not schedule settlement dates, accrued interest, or YTM.',
  },
];
