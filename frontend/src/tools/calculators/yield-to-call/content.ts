import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const YIELD_TO_CALL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Yield to Call Calculator' },
  { id: 'definition', label: 'What Is Yield to Call?' },
  { id: 'formula', label: 'Yield to Call Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate YTC' },
  { id: 'ytc-vs-ytm', label: 'YTC vs YTM' },
  { id: 'when-to-use', label: 'When to Use YTC' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'ytc-faq', label: 'Frequently Asked Questions' },
];

export const YIELD_TO_CALL_FAQS: readonly FAQItem[] = [
  {
    question: 'What does yield to call mean?',
    answer:
      'Yield to call (YTC) is the constant annualized discount rate that makes the present value of remaining coupons through the call date plus the call redemption price equal to the bond’s current market price, assuming the issuer calls on that date.',
  },
  {
    question: 'How do I calculate yield to call?',
    answer:
      'Set market price equal to the PV of annual interest payments until call plus the discounted call price, then solve for the annual yield numerically. This calculator uses bounded bisection (and a closed form when annual interest is zero).',
  },
  {
    question: 'What is the yield to call formula?',
    answer:
      'P = Σ C/(1+y)^t + Call/(1+y)^N for t = 1…N, where C is annual interest, Call is the call price, N is whole years until call, and y is the annual YTC (decimal).',
  },
  {
    question: 'Is yield to call the same as yield to maturity?',
    answer:
      'No. YTM discounts cash flows through final maturity and uses face value at maturity. YTC stops at the call date and uses the call price instead of maturity face value.',
  },
  {
    question: 'Why use annual interest as an amount instead of a coupon rate?',
    answer:
      'This calculator follows the screenshot inputs: annual interest is the yearly coupon cash amount. If you only know a coupon percent, multiply face (or the relevant principal base) by that rate to get the annual interest amount.',
  },
  {
    question: 'Can yield to call be negative?',
    answer:
      'Yes, when the market price is high enough relative to remaining coupons and the call redemption. The solver allows y > −100% so that 1+y stays positive.',
  },
  {
    question: 'Is the approximate YTC formula used here?',
    answer:
      'No. The approximate shortcut [C + (Call−P)/N] / [(Call+P)/2] is not used. Results come from solving the full pricing equation.',
  },
  {
    question: 'Does currency selection convert amounts?',
    answer:
      'No. The currency control is denomination only for formatting. It does not apply foreign-exchange conversion.',
  },
];
