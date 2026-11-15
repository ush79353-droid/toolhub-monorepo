import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ARM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-an-arm', label: 'What Is an Adjustable-Rate Mortgage?' },
  { id: 'how-arm-works', label: 'How Does an ARM Mortgage Work?' },
  { id: 'fixed-vs-adjustment', label: 'Fixed Period vs. Adjustment Period' },
  { id: 'five-one-vs-five-six', label: '5/1 ARM vs. 5/6 ARM' },
  { id: 'index-and-margin', label: 'Index and Lender Margin' },
  { id: 'arm-caps', label: 'Initial, Periodic, and Lifetime Caps' },
  { id: 'arm-example', label: 'ARM Payment Example' },
  { id: 'advantages-and-risks', label: 'Advantages, Risks, and Payment Shock' },
  { id: 'how-to-use-arm', label: 'How to Use This Calculator' },
  { id: 'arm-faq', label: 'Frequently Asked Questions' },
];

export const ARM_FAQS: readonly FAQItem[] = [
  {
    question: 'What does ARM mean?',
    answer:
      'ARM means adjustable-rate mortgage. The note rate stays fixed for an initial period, then can change on a set schedule. The new rate is built from an index, a lender margin, and the contract’s caps.',
  },
  {
    question: 'What is a 5/1 ARM?',
    answer:
      'A 5/1 ARM keeps the starting rate for five years. After that, the rate can adjust once every 12 months. The “1” means one year between adjustments, not one remaining year of the loan.',
  },
  {
    question: 'What is the difference between a 5/1 ARM and a 5/6 ARM?',
    answer:
      'Both are fixed for five years. A 5/1 ARM may then reset every 12 months. A 5/6 ARM may reset every 6 months. The second number is the adjustment interval, in years for “/1” products and in months for “/6” products.',
  },
  {
    question: 'How is the fully indexed rate calculated?',
    answer:
      'In this calculator the uncapped target is the index you enter plus the lender margin. Caps can stop the note rate from moving all the way to that target. The index is a number you supply. It is not a live market feed.',
  },
  {
    question: 'Can an ARM rate go down?',
    answer:
      'Yes, when your assumed index plus margin is below the current rate and the contract allows it. The periodic cap limits how far the rate can fall at one reset. The lifetime decrease cap, measured from the initial rate, is the lowest the model will go, and the rate never goes below 0%.',
  },
  {
    question: 'What is a lifetime rate cap?',
    answer:
      'The lifetime increase cap is the maximum rise above the initial note rate. A 5 percentage-point increase cap on a 5.5% start rate limits the rate to 10.5%. The lifetime decrease cap limits the fall below that same start rate.',
  },
  {
    question: 'What is payment shock?',
    answer:
      'Payment shock is a sharp increase in the monthly principal-and-interest payment at a reset. Caps slow the jump. They do not promise that the payment will stay near the introductory payment.',
  },
  {
    question: 'Does the loan term restart when the rate changes?',
    answer:
      'No. The calculator re-amortizes the remaining balance over the months still left. A 30-year loan that resets at year 5 has 25 years left, not a new 30-year term.',
  },
  {
    question: 'Are future ARM rates known?',
    answer:
      'No. The index after the fixed period is not known today. Every rate after the initial note rate on this page is a user-defined assumption, then limited by the caps you entered. Contract maximums are shown separately from that assumption.',
  },
  {
    question: 'What is a 10/1 ARM?',
    answer:
      'A 10/1 ARM keeps the initial interest rate fixed for the first 10 years (120 months) of the mortgage. After the 10-year introductory period, the interest rate adjusts once every 12 months for the remainder of the loan term, subject to the agreed rate caps and adjustment formula.',
  },
  {
    question: 'How is the APR calculated on an adjustable-rate mortgage?',
    answer:
      'Two common APR conventions exist for ARMs: (1) Average Note Rate APR (the arithmetic mean interest rate across the full loan term based on expected adjustments and rate caps, e.g., 6.125%), and (2) Truth in Lending Actuarial APR (the internal rate of return on cash flows accounting for upfront finance charges and the time-value of money, e.g., 5.357%). Both figures are surfaced to give transparent comparison against lender disclosure sheets.',
  },
  {
    question: 'Do property tax, insurance, HOA, and PMI earn interest?',
    answer:
      'No. Those amounts are added to the estimated housing payment and are not part of the loan balance or the interest total. This calculator holds them constant and does not decide when mortgage insurance ends.',
  },
];
