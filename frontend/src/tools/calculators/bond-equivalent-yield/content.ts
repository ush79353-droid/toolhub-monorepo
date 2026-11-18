import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BOND_EQUIVALENT_YIELD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-bey', label: 'What Is Bond Equivalent Yield?' },
  { id: 'bey-formula', label: 'BEY Formula (365-Day)' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'bond-equivalent-yield-faq', label: 'Frequently Asked Questions' },
];

export const BOND_EQUIVALENT_YIELD_FAQS: readonly FAQItem[] = [
  {
    question: 'How is bond equivalent yield (BEY) calculated?',
    answer:
      'For discount instruments on an investment basis: BEY (%) = ((Face Value − Bond Price) / Bond Price) × (365 / Days to Maturity) × 100. Money amounts are normalized into one currency first. When price equals face value, BEY is 0%.',
  },
  {
    question: 'Is BEY the same as bank discount yield, YTM, or current yield?',
    answer:
      'No. Bank discount yield divides the discount by face value and often uses a 360-day year. Yield to maturity solves the full coupon cash-flow equation. Coupon current yield is annual coupon ÷ price. This tool reports investment-basis BEY with a 365-day year only.',
  },
  {
    question: 'Why use 365 days?',
    answer:
      'Investment-basis BEY annualizes the holding-period return with an actual/365 convention. It does not use the 360-day bank discount convention.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Bond price and face value each have independent currencies. Bond price is converted into the face-value currency before the formula runs. Days to maturity and BEY % are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Can bond price exceed face value?',
    answer:
      'Not in this calculator. The supported scenario is a discount (or par) instrument. Premium prices are rejected.',
  },
];
