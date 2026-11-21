import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const YIELD_TO_MATURITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Yield to Maturity Calculator' },
  { id: 'definition', label: 'What Is Yield to Maturity?' },
  { id: 'formula', label: 'Yield to Maturity Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate YTM' },
  { id: 'factors', label: 'What Factors Affect YTM?' },
  { id: 'comparisons', label: 'Coupon vs Current Yield vs YTM' },
  { id: 'discount-premium', label: 'Discount, Premium, and Par' },
  { id: 'frequency', label: 'How Coupon Frequency Affects YTM' },
  { id: 'zero-coupon', label: 'Zero-Coupon Bond YTM' },
  { id: 'ytc', label: 'YTM vs Yield to Call' },
  { id: 'yield-curve', label: 'Understanding the Yield Curve' },
  { id: 'rates-prices', label: 'Interest Rates and Bond Prices' },
  { id: 'limitations', label: 'Limitations of YTM' },
  { id: 'when-to-use', label: 'When to Use a YTM Calculator' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'ytm-faq', label: 'Frequently Asked Questions' },
];

export const YIELD_TO_MATURITY_FAQS: readonly FAQItem[] = [
  {
    question: 'What does yield to maturity mean?',
    answer:
      'YTM is the constant annualized discount rate that makes the present value of a bond’s remaining coupons and principal equal to its purchase price, assuming payments are made as promised and the bond is held to maturity.',
  },
  {
    question: 'How do I calculate YTM?',
    answer:
      'Set price equal to the PV of coupons and face value discounted at y/m each period, then solve for y numerically. This calculator uses bounded bisection (and a closed form for zero-coupon bonds).',
  },
  {
    question: 'What is the formula for yield to maturity?',
    answer:
      'P = Σ C/(1+y/m)^t + F/(1+y/m)^N, with C = F×c/m and N = m×T. y is the nominal annual YTM.',
  },
  {
    question: 'Is yield to maturity the same as coupon rate?',
    answer:
      'Only for a conventional fixed-rate bond priced at par under the standard model. Discount bonds typically have YTM above the coupon; premium bonds typically have YTM below it.',
  },
  {
    question: 'Is yield to maturity the same as current yield?',
    answer:
      'No. Current yield = annual coupon ÷ price. It ignores the timing of remaining cash flows and principal repayment that YTM includes.',
  },
  {
    question: 'Why does bond price affect YTM?',
    answer:
      'A lower price raises the IRR of the same promised cash flows, so YTM rises. A higher price lowers YTM.',
  },
  {
    question: 'Can yield to maturity be negative?',
    answer:
      'Yes, when price is high enough relative to remaining cash flows. The solver allows y > −m so that 1+y/m stays positive.',
  },
  {
    question: 'What happens when a bond trades below face value?',
    answer:
      'It is a discount bond. For a standard fixed coupon with positive remaining maturity, YTM generally exceeds the coupon rate.',
  },
  {
    question: 'What happens when a bond trades above face value?',
    answer:
      'It is a premium bond. YTM generally falls below the coupon rate under the standard model.',
  },
  {
    question: 'Does YTM include coupon payments?',
    answer:
      'Yes. Coupons and the final principal (and any capital gain/loss to face) are part of the cash flows discounted in the YTM equation.',
  },
  {
    question: 'Does YTM assume reinvestment of coupon payments?',
    answer:
      'The IRR interpretation assumes interim coupons can be reinvested at the YTM. Actual reinvestment rates may differ.',
  },
  {
    question: 'Is yield to maturity guaranteed?',
    answer:
      'No. Default, call, taxes, fees, and changing market rates can change realized returns.',
  },
  {
    question: 'What is a good yield to maturity?',
    answer:
      'There is no universal good YTM. Compare peers with similar credit, maturity, currency, and structure, and weigh risk tolerance.',
  },
  {
    question: 'What is the difference between YTM and yield to call?',
    answer:
      'YTM assumes cash flows through maturity. Yield to call discounts cash flows to an assumed call date and call price — often more relevant for callable bonds.',
  },
  {
    question: 'How do I calculate YTM on a zero-coupon bond?',
    answer:
      'With C = 0, P = F/(1+y/m)^N so y = m×((F/P)^(1/N) − 1). For annual compounding, y = (F/P)^(1/T) − 1.',
  },
  {
    question: 'How does coupon frequency change YTM?',
    answer:
      'Frequency changes m, C, and N. Nominal annual YTM = periodic yield × m. Effective annual yield = (1+periodic)^m − 1.',
  },
  {
    question: 'What is a yield curve?',
    answer:
      'A plot of yields versus maturity for comparable bonds (often government benchmarks). Shape reflects term premia, policy, and expectations.',
  },
  {
    question: 'What causes an inverted yield curve?',
    answer:
      'Short-term yields above longer-term yields. Drivers include expected rate cuts, policy, and risk premia — not a single mechanical rule.',
  },
  {
    question: 'Can YTM change before the bond matures?',
    answer:
      'Yes. As price, remaining term, and market rates change, the implied YTM changes.',
  },
  {
    question: 'How does inflation affect the real return from a bond?',
    answer:
      'YTM is typically a nominal measure. Higher inflation erodes real purchasing power of fixed coupons and principal.',
  },
  {
    question: 'What is the difference between nominal and effective annual yield?',
    answer:
      'Nominal annual YTM is periodic yield × m. Effective annual yield compounds those periods: (1+r)^m − 1.',
  },
  {
    question: 'What happens to bond prices when interest rates rise?',
    answer:
      'Existing fixed-coupon bond prices generally fall so that their yields rise toward new market rates (other factors equal).',
  },
  {
    question: 'How do I calculate the price of a bond using YTM?',
    answer:
      'Discount each coupon and the face value at y/m for the remaining periods and sum the PVs — available as the Bond price solve mode.',
  },
  {
    question: 'What is the relationship between bond duration and YTM?',
    answer:
      'Duration measures interest-rate sensitivity of price around a given yield. Higher duration usually means larger price changes for a given yield shift.',
  },
  {
    question: 'Why is yield to maturity important for bond investors?',
    answer:
      'It summarizes price, coupons, and maturity into one comparable IRR-style yield — useful for screening, still incomplete without credit and structural analysis.',
  },
];
